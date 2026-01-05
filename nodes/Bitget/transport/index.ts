/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IWebhookFunctions,
  IPollFunctions,
  IHttpRequestMethods,
  IRequestOptions,
} from 'n8n-workflow';
import { BITGET_API_BASE_URL, ERROR_CODE_MAP, ERROR_MESSAGES } from '../constants';
import { BitgetCredentials, BitgetApiResponse } from '../types/BitgetTypes';
import { removeEmptyProperties, buildQueryString, sleep } from '../utils';

// Log licensing notice once on module load
let licenseNoticeLogged = false;

function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeLogged = true;
  }
}

/**
 * Generate HMAC-SHA256 signature for Bitget API
 */
export function generateSignature(
  timestamp: string,
  method: string,
  requestPath: string,
  body: string,
  secretKey: string,
): string {
  const prehash = timestamp + method.toUpperCase() + requestPath + body;
  const hash = crypto.createHmac('sha256', secretKey).update(prehash).digest('base64');
  return hash;
}

/**
 * Get Bitget API credentials
 */
async function getCredentials(
  context:
    | IExecuteFunctions
    | ILoadOptionsFunctions
    | IHookFunctions
    | IWebhookFunctions
    | IPollFunctions,
): Promise<BitgetCredentials> {
  const credentials = await context.getCredentials('bitgetApi');

  return {
    apiKey: credentials.apiKey as string,
    secretKey: credentials.secretKey as string,
    passphrase: credentials.passphrase as string,
    environment: (credentials.environment as 'production' | 'demo') || 'production',
  };
}

/**
 * Build request headers with authentication
 */
function buildHeaders(
  credentials: BitgetCredentials,
  timestamp: string,
  signature: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    'ACCESS-KEY': credentials.apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': credentials.passphrase,
    'Content-Type': 'application/json',
    locale: 'en-US',
  };

  if (credentials.environment === 'demo') {
    headers['paptrading'] = '1';
  }

  return headers;
}

/**
 * Handle Bitget API errors
 */
function handleApiError(response: BitgetApiResponse): void {
  if (response.code !== '00000') {
    const errorMessage =
      ERROR_CODE_MAP[response.code] || response.msg || ERROR_MESSAGES.UNKNOWN_ERROR;
    throw new Error(`Bitget API Error: ${errorMessage} (Code: ${response.code})`);
  }
}

/**
 * Make authenticated request to Bitget API
 */
export async function bitgetApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: Record<string, any> = {},
  query: Record<string, any> = {},
): Promise<any> {
  // Log licensing notice once
  logLicenseNotice();

  const credentials = await getCredentials(this);
  const timestamp = Date.now().toString();

  // Clean up empty values
  const cleanedQuery = removeEmptyProperties(query);
  const cleanedBody = removeEmptyProperties(body);

  // Build request path with query string
  let requestPath = endpoint;
  if (Object.keys(cleanedQuery).length > 0) {
    requestPath += '?' + buildQueryString(cleanedQuery);
  }

  // Build body string for signature
  const bodyString = Object.keys(cleanedBody).length > 0 ? JSON.stringify(cleanedBody) : '';

  // Generate signature
  const signature = generateSignature(timestamp, method, requestPath, bodyString, credentials.secretKey);

  // Build request options
  const options: IRequestOptions = {
    method,
    uri: `${BITGET_API_BASE_URL}${requestPath}`,
    headers: buildHeaders(credentials, timestamp, signature),
    json: true,
  };

  // Add body if present
  if (Object.keys(cleanedBody).length > 0) {
    options.body = cleanedBody;
  }

  try {
    const response = (await this.helpers.request(options)) as BitgetApiResponse;

    // Handle API errors
    handleApiError(response);

    return response.data;
  } catch (error: any) {
    // Check for rate limiting
    if (error.statusCode === 429 || (error.message && error.message.includes('40006'))) {
      throw new Error('Rate limit exceeded. Please wait before retrying.');
    }

    // Re-throw formatted error
    if (error.message?.startsWith('Bitget API Error:')) {
      throw error;
    }

    throw new Error(`Bitget API Request Failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Make authenticated request with retry logic
 */
export async function bitgetApiRequestWithRetry(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: Record<string, any> = {},
  query: Record<string, any> = {},
  maxRetries = 3,
): Promise<any> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await bitgetApiRequest.call(this, method, endpoint, body, query);
    } catch (error: any) {
      lastError = error;

      // Don't retry on authentication errors
      const noRetryErrors = ['40001', '40002', '40003', '40004', '40005', '40007'];
      if (noRetryErrors.some((code) => error.message?.includes(code))) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt - 1) * 1000;
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Make paginated request to Bitget API
 */
export async function bitgetApiRequestAllItems(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: Record<string, any> = {},
  query: Record<string, any> = {},
  itemsKey = 'data',
  idKey = 'orderId',
  maxItems?: number,
): Promise<any[]> {
  const items: any[] = [];
  let hasMore = true;
  let lastId: string | undefined;

  while (hasMore) {
    const currentQuery = { ...query };

    if (lastId) {
      currentQuery.idLessThan = lastId;
    }

    const response = await bitgetApiRequest.call(this, method, endpoint, body, currentQuery);

    // Handle different response structures
    let responseItems: any[];
    if (Array.isArray(response)) {
      responseItems = response;
    } else if (response && typeof response === 'object' && itemsKey in response) {
      responseItems = response[itemsKey] || [];
    } else {
      responseItems = response ? [response] : [];
    }

    if (responseItems.length === 0) {
      hasMore = false;
      break;
    }

    items.push(...responseItems);

    // Check if we've reached the max items
    if (maxItems && items.length >= maxItems) {
      hasMore = false;
      break;
    }

    // Get the last ID for pagination
    const lastItem = responseItems[responseItems.length - 1];
    lastId = lastItem?.[idKey];

    // If we got fewer items than the limit, we've reached the end
    const limit = query.limit || 100;
    if (responseItems.length < limit) {
      hasMore = false;
    }
  }

  return maxItems ? items.slice(0, maxItems) : items;
}

/**
 * Make unauthenticated request to Bitget API (for public endpoints)
 */
export async function bitgetPublicApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  query: Record<string, any> = {},
): Promise<any> {
  // Log licensing notice once
  logLicenseNotice();

  // Clean up empty values
  const cleanedQuery = removeEmptyProperties(query);

  // Build request path with query string
  let requestPath = endpoint;
  if (Object.keys(cleanedQuery).length > 0) {
    requestPath += '?' + buildQueryString(cleanedQuery);
  }

  // Build request options
  const options: IRequestOptions = {
    method,
    uri: `${BITGET_API_BASE_URL}${requestPath}`,
    headers: {
      'Content-Type': 'application/json',
      locale: 'en-US',
    },
    json: true,
  };

  try {
    const response = (await this.helpers.request(options)) as BitgetApiResponse;

    // Handle API errors
    handleApiError(response);

    return response.data;
  } catch (error: any) {
    if (error.message?.startsWith('Bitget API Error:')) {
      throw error;
    }

    throw new Error(`Bitget API Request Failed: ${error.message || 'Unknown error'}`);
  }
}

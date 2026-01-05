/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodePropertyOptions } from 'n8n-workflow';

/**
 * Remove undefined and empty string values from an object
 */
export function removeEmptyProperties<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== '' && value !== null) {
      result[key as keyof T] = value;
    }
  }

  return result;
}

/**
 * Convert timestamp to ISO string or return undefined
 */
export function toTimestamp(date: string | number | undefined): string | undefined {
  if (!date) return undefined;

  if (typeof date === 'string') {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) {
      return parsed.toString();
    }
    return date;
  }

  return date.toString();
}

/**
 * Format date to Bitget timestamp (milliseconds)
 */
export function formatTimestamp(date: Date | string | number): string {
  if (date instanceof Date) {
    return date.getTime().toString();
  }

  if (typeof date === 'string') {
    return new Date(date).getTime().toString();
  }

  return date.toString();
}

/**
 * Parse Bitget timestamp to Date
 */
export function parseTimestamp(timestamp: string | number): Date {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  return new Date(ts);
}

/**
 * Generate a unique client order ID
 */
export function generateClientOrderId(prefix = 'n8n'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Validate trading pair format
 */
export function validateSymbol(symbol: string): boolean {
  // Bitget symbols are uppercase without separators (e.g., BTCUSDT)
  return /^[A-Z0-9]+$/.test(symbol);
}

/**
 * Format symbol to uppercase
 */
export function formatSymbol(symbol: string): string {
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  initialDelay = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      const delay = initialDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const cleaned = removeEmptyProperties(params);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(cleaned)) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Pagination helper for cursor-based pagination
 */
export interface PaginationOptions {
  limit?: number;
  idLessThan?: string;
  startTime?: string;
  endTime?: string;
}

export function buildPaginationParams(options: PaginationOptions): Record<string, string> {
  const params: Record<string, string> = {};

  if (options.limit) {
    params.limit = options.limit.toString();
  }

  if (options.idLessThan) {
    params.idLessThan = options.idLessThan;
  }

  if (options.startTime) {
    params.startTime = options.startTime;
  }

  if (options.endTime) {
    params.endTime = options.endTime;
  }

  return params;
}

/**
 * Convert coin options to n8n dropdown format
 */
export function coinToOptions(coins: string[]): INodePropertyOptions[] {
  return coins.map((coin) => ({
    name: coin,
    value: coin,
  }));
}

/**
 * Common cryptocurrency options
 */
export const COMMON_COINS: INodePropertyOptions[] = [
  { name: 'Bitcoin (BTC)', value: 'BTC' },
  { name: 'Ethereum (ETH)', value: 'ETH' },
  { name: 'Tether (USDT)', value: 'USDT' },
  { name: 'USD Coin (USDC)', value: 'USDC' },
  { name: 'BNB', value: 'BNB' },
  { name: 'XRP', value: 'XRP' },
  { name: 'Solana (SOL)', value: 'SOL' },
  { name: 'Cardano (ADA)', value: 'ADA' },
  { name: 'Dogecoin (DOGE)', value: 'DOGE' },
  { name: 'Polygon (MATIC)', value: 'MATIC' },
];

/**
 * Common trading pair options
 */
export const COMMON_SYMBOLS: INodePropertyOptions[] = [
  { name: 'BTC/USDT', value: 'BTCUSDT' },
  { name: 'ETH/USDT', value: 'ETHUSDT' },
  { name: 'BNB/USDT', value: 'BNBUSDT' },
  { name: 'XRP/USDT', value: 'XRPUSDT' },
  { name: 'SOL/USDT', value: 'SOLUSDT' },
  { name: 'ADA/USDT', value: 'ADAUSDT' },
  { name: 'DOGE/USDT', value: 'DOGEUSDT' },
  { name: 'MATIC/USDT', value: 'MATICUSDT' },
  { name: 'DOT/USDT', value: 'DOTUSDT' },
  { name: 'AVAX/USDT', value: 'AVAXUSDT' },
];

/**
 * Format number for display
 */
export function formatNumber(value: string | number, decimals = 8): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Validate leverage value
 */
export function validateLeverage(leverage: number, maxLeverage = 125): boolean {
  return leverage >= 1 && leverage <= maxLeverage && Number.isInteger(leverage);
}

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { ENDPOINTS } from './constants';
import {
  bitgetApiRequest,
  bitgetApiRequestWithRetry,
  bitgetPublicApiRequest,
} from './transport';
import {
  generateClientOrderId,
  formatSymbol,
  toTimestamp,
} from './utils';

// Import action definitions
import { spotAccountOperations, spotAccountFields } from './actions/spotAccount';
import { spotTradingOperations, spotTradingFields } from './actions/spotTrading';
import { futuresAccountOperations, futuresAccountFields } from './actions/futuresAccount';
import { futuresTradingOperations, futuresTradingFields } from './actions/futuresTrading';
import { copyTradingOperations, copyTradingFields } from './actions/copyTrading';
import { marketDataOperations, marketDataFields } from './actions/marketData';
import { earnOperations, earnFields } from './actions/earn';

export class Bitget implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bitget',
    name: 'bitget',
    icon: 'file:bitget.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Bitget cryptocurrency exchange API',
    defaults: {
      name: 'Bitget',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bitgetApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Copy Trading',
            value: 'copyTrading',
            description: 'Copy trading operations',
          },
          {
            name: 'Earn',
            value: 'earn',
            description: 'Earn products operations',
          },
          {
            name: 'Futures Account',
            value: 'futuresAccount',
            description: 'Futures account operations',
          },
          {
            name: 'Futures Trading',
            value: 'futuresTrading',
            description: 'Futures trading operations',
          },
          {
            name: 'Market Data',
            value: 'marketData',
            description: 'Market data operations',
          },
          {
            name: 'Spot Account',
            value: 'spotAccount',
            description: 'Spot account operations',
          },
          {
            name: 'Spot Trading',
            value: 'spotTrading',
            description: 'Spot trading operations',
          },
        ],
        default: 'spotTrading',
      },
      // Operations
      ...spotAccountOperations,
      ...spotTradingOperations,
      ...futuresAccountOperations,
      ...futuresTradingOperations,
      ...copyTradingOperations,
      ...marketDataOperations,
      ...earnOperations,
      // Fields
      ...spotAccountFields,
      ...spotTradingFields,
      ...futuresAccountFields,
      ...futuresTradingFields,
      ...copyTradingFields,
      ...marketDataFields,
      ...earnFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: any;

        // Route to appropriate handler based on resource
        switch (resource) {
          case 'spotAccount':
            responseData = await executeSpotAccount.call(this, operation, i);
            break;
          case 'spotTrading':
            responseData = await executeSpotTrading.call(this, operation, i);
            break;
          case 'futuresAccount':
            responseData = await executeFuturesAccount.call(this, operation, i);
            break;
          case 'futuresTrading':
            responseData = await executeFuturesTrading.call(this, operation, i);
            break;
          case 'copyTrading':
            responseData = await executeCopyTrading.call(this, operation, i);
            break;
          case 'marketData':
            responseData = await executeMarketData.call(this, operation, i);
            break;
          case 'earn':
            responseData = await executeEarn.call(this, operation, i);
            break;
          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown resource: ${resource}`,
            );
        }

        // Handle response
        if (Array.isArray(responseData)) {
          returnData.push(...responseData.map((item) => ({ json: item })));
        } else if (responseData !== null && responseData !== undefined) {
          returnData.push({ json: responseData });
        }
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

// ============================================================================
// SPOT ACCOUNT OPERATIONS
// ============================================================================

async function executeSpotAccount(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'getBalance': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_ACCOUNT_ASSETS, {}, query);
    }

    case 'getBills': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const groupType = this.getNodeParameter('groupType', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;
      
      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      if (groupType) query.groupType = groupType;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;
      
      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_ACCOUNT_BILLS, {}, query);
    }

    case 'transfer': {
      const fromType = this.getNodeParameter('fromType', itemIndex) as string;
      const toType = this.getNodeParameter('toType', itemIndex) as string;
      const coin = this.getNodeParameter('coin', itemIndex) as string;
      const amount = this.getNodeParameter('size', itemIndex) as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      const body: Record<string, any> = {
        fromType,
        toType,
        coin: coin.toUpperCase(),
        amount,
      };

      if (clientOid) body.clientOid = clientOid;

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.SPOT_WALLET_TRANSFER, body);
    }

    case 'getTransferHistory': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const fromType = this.getNodeParameter('fromType', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      if (fromType) query.fromType = fromType;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.clientOid) query.clientOid = additionalOptions.clientOid;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_WALLET_TRANSFER_RECORDS, {}, query);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// SPOT TRADING OPERATIONS
// ============================================================================

async function executeSpotTrading(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'placeOrder': {
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const side = this.getNodeParameter('side', itemIndex) as string;
      const orderType = this.getNodeParameter('orderType', itemIndex) as string;
      const size = this.getNodeParameter('size', itemIndex) as string;
      const force = this.getNodeParameter('force', itemIndex, 'GTC') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      const body: Record<string, any> = {
        symbol,
        side,
        orderType,
        size,
        force,
        clientOid: clientOid || generateClientOrderId(),
      };

      if (orderType === 'limit') {
        const price = this.getNodeParameter('price', itemIndex) as string;
        body.price = price;
      }

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.SPOT_TRADE_PLACE_ORDER, body);
    }

    case 'batchPlaceOrders': {
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const ordersCollection = this.getNodeParameter('orders', itemIndex, {}) as { order?: any[] };
      const orders = ordersCollection.order || [];

      if (orders.length === 0) {
        throw new Error('At least one order is required');
      }

      if (orders.length > 50) {
        throw new Error('Maximum 50 orders per batch');
      }

      const orderList = orders.map((order, index) => ({
        side: order.side,
        orderType: order.orderType,
        size: order.size,
        price: order.price,
        force: order.force || 'GTC',
        clientOid: order.clientOid || generateClientOrderId(`batch${index}`),
      }));

      const body = {
        symbol,
        orderList,
      };

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.SPOT_TRADE_BATCH_ORDERS, body);
    }

    case 'cancelOrder': {
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const orderId = this.getNodeParameter('orderId', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      if (!orderId && !clientOid) {
        throw new Error('Either Order ID or Client Order ID is required');
      }

      const body: Record<string, any> = { symbol };
      if (orderId) body.orderId = orderId;
      if (clientOid) body.clientOid = clientOid;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.SPOT_TRADE_CANCEL_ORDER, body);
    }

    case 'batchCancelOrders': {
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const orderIds = this.getNodeParameter('orderIds', itemIndex, '') as string;

      const body: Record<string, any> = { symbol };
      if (orderIds) {
        body.orderIds = orderIds.split(',').map((id) => id.trim());
      }

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.SPOT_TRADE_BATCH_CANCEL, body);
    }

    case 'getOpenOrders': {
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = {};
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.orderType) query.orderType = additionalOptions.orderType;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_TRADE_OPEN_ORDERS, {}, query);
    }

    case 'getOrderHistory': {
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = {};
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_TRADE_HISTORY_ORDERS, {}, query);
    }

    case 'getOrderDetail': {
      const orderId = this.getNodeParameter('orderId', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      if (!orderId && !clientOid) {
        throw new Error('Either Order ID or Client Order ID is required');
      }

      const query: Record<string, any> = {};
      if (orderId) query.orderId = orderId;
      if (clientOid) query.clientOid = clientOid;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_TRADE_ORDER_INFO, {}, query);
    }

    case 'getFills': {
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = {};
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.orderId) query.orderId = additionalOptions.orderId;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.SPOT_TRADE_FILLS, {}, query);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// FUTURES ACCOUNT OPERATIONS
// ============================================================================

async function executeFuturesAccount(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'getAccount': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex, '') as string;

      const query: Record<string, any> = { productType };
      if (marginCoin) query.marginCoin = marginCoin.toUpperCase();

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_ACCOUNT, {}, query);
    }

    case 'getPositions': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex, '') as string;

      const query: Record<string, any> = { productType };
      if (marginCoin) query.marginCoin = marginCoin.toUpperCase();

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_POSITIONS, {}, query);
    }

    case 'getSinglePosition': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;

      const query: Record<string, any> = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
      };

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_SINGLE_POSITION, {}, query);
    }

    case 'setLeverage': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;
      const leverage = this.getNodeParameter('leverage', itemIndex) as number;
      const holdSide = this.getNodeParameter('holdSide', itemIndex, '') as string;

      const body: Record<string, any> = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
        leverage: leverage.toString(),
      };

      if (holdSide) body.holdSide = holdSide;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_SET_LEVERAGE, body);
    }

    case 'setMarginMode': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;
      const marginMode = this.getNodeParameter('marginMode', itemIndex) as string;

      const body = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
        marginMode,
      };

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_SET_MARGIN_MODE, body);
    }

    case 'getBills': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (additionalOptions.coin) query.coin = additionalOptions.coin.toUpperCase();
      if (additionalOptions.businessType) query.businessType = additionalOptions.businessType;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_BILLS, {}, query);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// FUTURES TRADING OPERATIONS
// ============================================================================

async function executeFuturesTrading(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'placeOrder': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;
      const side = this.getNodeParameter('side', itemIndex) as string;
      const orderType = this.getNodeParameter('orderType', itemIndex) as string;
      const size = this.getNodeParameter('size', itemIndex) as string;
      const tradeSide = this.getNodeParameter('tradeSide', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      const body: Record<string, any> = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
        side,
        orderType,
        size,
        clientOid: clientOid || generateClientOrderId('futures'),
      };

      if (tradeSide) body.tradeSide = tradeSide;

      if (orderType === 'limit') {
        const price = this.getNodeParameter('price', itemIndex) as string;
        const force = this.getNodeParameter('force', itemIndex, 'GTC') as string;
        body.price = price;
        body.force = force;
      }

      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;
      if (additionalOptions.reduceOnly) body.reduceOnly = additionalOptions.reduceOnly;
      if (additionalOptions.presetStopSurplusPrice) body.presetStopSurplusPrice = additionalOptions.presetStopSurplusPrice;
      if (additionalOptions.presetStopLossPrice) body.presetStopLossPrice = additionalOptions.presetStopLossPrice;

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.FUTURES_PLACE_ORDER, body);
    }

    case 'batchPlaceOrders': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;
      const ordersCollection = this.getNodeParameter('orders', itemIndex, {}) as { order?: any[] };
      const orders = ordersCollection.order || [];

      if (orders.length === 0) {
        throw new Error('At least one order is required');
      }

      if (orders.length > 50) {
        throw new Error('Maximum 50 orders per batch');
      }

      const orderList = orders.map((order, index) => ({
        side: order.side,
        orderType: order.orderType,
        size: order.size,
        price: order.price,
        tradeSide: order.tradeSide,
        clientOid: order.clientOid || generateClientOrderId(`fbatch${index}`),
      }));

      const body = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
        orderList,
      };

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.FUTURES_BATCH_ORDERS, body);
    }

    case 'modifyOrder': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const orderId = this.getNodeParameter('orderId', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      if (!orderId && !clientOid) {
        throw new Error('Either Order ID or Client Order ID is required');
      }

      const body: Record<string, any> = {
        productType,
        symbol,
      };

      if (orderId) body.orderId = orderId;
      if (clientOid) body.clientOid = clientOid;

      const newPrice = this.getNodeParameter('newPrice', itemIndex, '') as string;
      const newSize = this.getNodeParameter('newSize', itemIndex, '') as string;

      if (newPrice) body.newPrice = newPrice;
      if (newSize) body.newSize = newSize;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_MODIFY_ORDER, body);
    }

    case 'cancelOrder': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const orderId = this.getNodeParameter('orderId', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      if (!orderId && !clientOid) {
        throw new Error('Either Order ID or Client Order ID is required');
      }

      const body: Record<string, any> = {
        productType,
        symbol,
      };

      if (orderId) body.orderId = orderId;
      if (clientOid) body.clientOid = clientOid;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_CANCEL_ORDER, body);
    }

    case 'cancelAllOrders': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex, '') as string;

      const body: Record<string, any> = { productType };
      if (symbol) body.symbol = formatSymbol(symbol);
      if (marginCoin) body.marginCoin = marginCoin.toUpperCase();

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_CANCEL_ALL_ORDERS, body);
    }

    case 'getOpenOrders': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.orderId) query.orderId = additionalOptions.orderId;
      if (additionalOptions.clientOid) query.clientOid = additionalOptions.clientOid;
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_OPEN_ORDERS, {}, query);
    }

    case 'getOrderHistory': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_HISTORY_ORDERS, {}, query);
    }

    case 'getFills': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.orderId) query.orderId = additionalOptions.orderId;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_FILLS, {}, query);
    }

    case 'placePlanOrder': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const marginCoin = this.getNodeParameter('marginCoin', itemIndex) as string;
      const side = this.getNodeParameter('side', itemIndex) as string;
      const size = this.getNodeParameter('size', itemIndex) as string;
      const triggerPrice = this.getNodeParameter('triggerPrice', itemIndex) as string;
      const triggerType = this.getNodeParameter('triggerType', itemIndex) as string;
      const orderType = this.getNodeParameter('orderType', itemIndex) as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      const body: Record<string, any> = {
        productType,
        symbol,
        marginCoin: marginCoin.toUpperCase(),
        side,
        size,
        triggerPrice,
        triggerType,
        orderType,
        clientOid: clientOid || generateClientOrderId('plan'),
      };

      if (orderType === 'limit') {
        const executePrice = this.getNodeParameter('executePrice', itemIndex) as string;
        body.executePrice = executePrice;
      }

      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;
      if (additionalOptions.tradeSide) body.tradeSide = additionalOptions.tradeSide;
      if (additionalOptions.reduceOnly) body.reduceOnly = additionalOptions.reduceOnly;

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.FUTURES_PLACE_PLAN_ORDER, body);
    }

    case 'cancelPlanOrder': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const orderId = this.getNodeParameter('orderId', itemIndex, '') as string;
      const clientOid = this.getNodeParameter('clientOid', itemIndex, '') as string;

      if (!orderId && !clientOid) {
        throw new Error('Either Order ID or Client Order ID is required');
      }

      const body: Record<string, any> = { productType };
      if (orderId) body.orderId = orderId;
      if (clientOid) body.clientOid = clientOid;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.FUTURES_CANCEL_PLAN_ORDER, body);
    }

    case 'getPlanOrders': {
      const productType = this.getNodeParameter('productType', itemIndex) as string;
      const symbol = this.getNodeParameter('symbol', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (symbol) query.symbol = formatSymbol(symbol);
      if (additionalOptions.planType) query.planType = additionalOptions.planType;
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.FUTURES_PLAN_ORDERS, {}, query);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// COPY TRADING OPERATIONS
// ============================================================================

async function executeCopyTrading(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'getTraders': {
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (additionalOptions.pageNo) query.pageNo = additionalOptions.pageNo;
      if (additionalOptions.pageSize) query.pageSize = additionalOptions.pageSize;
      if (additionalOptions.sortBy) query.sortBy = additionalOptions.sortBy;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.COPY_TRADERS, {}, query);
    }

    case 'getTraderPositions': {
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;

      const query = {
        traderId,
        productType,
      };

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.COPY_TRADER_POSITIONS, {}, query);
    }

    case 'followTrader': {
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
      const copyMode = this.getNodeParameter('copyMode', itemIndex) as string;
      const copyTradeCoin = this.getNodeParameter('copyTradeCoin', itemIndex) as string;

      const body: Record<string, any> = {
        traderId,
        productType,
        copyTradeCoin: copyTradeCoin.toUpperCase(),
      };

      if (copyMode === 'fixedAmount') {
        const fixedAmount = this.getNodeParameter('fixedAmount', itemIndex) as string;
        body.fixedAmount = fixedAmount;
      } else {
        const copyRatio = this.getNodeParameter('copyRatio', itemIndex) as number;
        body.copyRatio = copyRatio.toString();
      }

      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;
      if (additionalOptions.maxFollowAmount) body.maxFollowAmount = additionalOptions.maxFollowAmount;
      if (additionalOptions.totalLimit) body.totalLimit = additionalOptions.totalLimit;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.COPY_FOLLOW_TRADER, body);
    }

    case 'unfollowTrader': {
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;

      const body = {
        traderId,
        productType,
      };

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.COPY_UNFOLLOW_TRADER, body);
    }

    case 'getFollowSettings': {
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;

      const query = {
        traderId,
        productType,
      };

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.COPY_FOLLOW_SETTINGS, {}, query);
    }

    case 'updateFollowSettings': {
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
      const settings = this.getNodeParameter('settings', itemIndex, {}) as Record<string, any>;

      const body: Record<string, any> = {
        traderId,
        productType,
      };

      if (settings.fixedAmount) body.fixedAmount = settings.fixedAmount;
      if (settings.copyRatio) body.copyRatio = settings.copyRatio;
      if (settings.maxFollowAmount) body.maxFollowAmount = settings.maxFollowAmount;
      if (settings.totalLimit) body.totalLimit = settings.totalLimit;

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.COPY_UPDATE_SETTINGS, body);
    }

    case 'getFollowerHistory': {
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = { productType };
      if (additionalOptions.traderId) query.traderId = additionalOptions.traderId;
      if (additionalOptions.symbol) query.symbol = formatSymbol(additionalOptions.symbol);
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.COPY_FOLLOWER_HISTORY, {}, query);
    }

    case 'closeFollowerPosition': {
      const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const traderId = this.getNodeParameter('traderId', itemIndex) as string;
      const holdSide = this.getNodeParameter('holdSide', itemIndex) as string;

      const body = {
        productType,
        symbol,
        traderId,
        holdSide,
      };

      return await bitgetApiRequest.call(this, 'POST', ENDPOINTS.COPY_CLOSE_POSITION, body);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// MARKET DATA OPERATIONS
// ============================================================================

async function executeMarketData(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'getTickers': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_TICKERS 
        : ENDPOINTS.FUTURES_MARKET_TICKERS;

      const query: Record<string, any> = {};
      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getTicker': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_TICKER 
        : ENDPOINTS.FUTURES_MARKET_TICKER;

      const query: Record<string, any> = { symbol };
      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getOrderBook': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const limit = this.getNodeParameter('limit', itemIndex, 15) as number;

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_ORDERBOOK 
        : ENDPOINTS.FUTURES_MARKET_ORDERBOOK;

      const query: Record<string, any> = { 
        symbol,
        limit: limit.toString(),
      };
      
      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getCandles': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const granularity = this.getNodeParameter('granularity', itemIndex) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_CANDLES 
        : ENDPOINTS.FUTURES_MARKET_CANDLES;

      const query: Record<string, any> = { 
        symbol,
        granularity,
      };

      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getTrades': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;
      const symbol = formatSymbol(this.getNodeParameter('symbol', itemIndex) as string);
      const limit = this.getNodeParameter('limit', itemIndex, 100) as number;

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_TRADES 
        : ENDPOINTS.FUTURES_MARKET_TRADES;

      const query: Record<string, any> = { 
        symbol,
        limit: limit.toString(),
      };

      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getSymbols': {
      const marketType = this.getNodeParameter('marketType', itemIndex, 'spot') as string;

      const endpoint = marketType === 'spot' 
        ? ENDPOINTS.MARKET_SYMBOLS 
        : ENDPOINTS.FUTURES_MARKET_SYMBOLS;

      const query: Record<string, any> = {};
      if (marketType !== 'spot') {
        const productType = this.getNodeParameter('productType', itemIndex, 'USDT-FUTURES') as string;
        query.productType = productType;
      }

      return await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
    }

    case 'getServerTime': {
      return await bitgetPublicApiRequest.call(this, 'GET', ENDPOINTS.MARKET_SERVER_TIME);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// ============================================================================
// EARN OPERATIONS
// ============================================================================

async function executeEarn(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<any> {
  switch (operation) {
    case 'getProducts': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const periodType = this.getNodeParameter('periodType', itemIndex, '') as string;

      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      if (periodType) query.periodType = periodType;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.EARN_PRODUCTS, {}, query);
    }

    case 'subscribe': {
      const productId = this.getNodeParameter('productId', itemIndex) as string;
      const amount = this.getNodeParameter('amount', itemIndex) as string;

      const body = {
        productId,
        amount,
      };

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.EARN_SUBSCRIBE, body);
    }

    case 'redeem': {
      const productId = this.getNodeParameter('productId', itemIndex) as string;
      const amount = this.getNodeParameter('amount', itemIndex) as string;

      const body = {
        productId,
        amount,
      };

      return await bitgetApiRequestWithRetry.call(this, 'POST', ENDPOINTS.EARN_REDEEM, body);
    }

    case 'getSubscriptions': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const productId = this.getNodeParameter('productId', itemIndex, '') as string;

      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      if (productId) query.productId = productId;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.EARN_SUBSCRIPTIONS, {}, query);
    }

    case 'getHistory': {
      const coin = this.getNodeParameter('coin', itemIndex, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, any>;

      const query: Record<string, any> = {};
      if (coin) query.coin = coin.toUpperCase();
      if (additionalOptions.productId) query.productId = additionalOptions.productId;
      if (additionalOptions.operationType) query.operationType = additionalOptions.operationType;
      if (additionalOptions.startTime) query.startTime = toTimestamp(additionalOptions.startTime);
      if (additionalOptions.endTime) query.endTime = toTimestamp(additionalOptions.endTime);
      if (additionalOptions.limit) query.limit = additionalOptions.limit;
      if (additionalOptions.idLessThan) query.idLessThan = additionalOptions.idLessThan;

      return await bitgetApiRequest.call(this, 'GET', ENDPOINTS.EARN_HISTORY, {}, query);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

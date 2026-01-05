/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  INodeType,
  INodeTypeDescription,
  IPollFunctions,
  INodeExecutionData,
} from 'n8n-workflow';

import { ENDPOINTS } from './constants';
import { bitgetApiRequest, bitgetPublicApiRequest } from './transport';
import { formatSymbol } from './utils';

export class BitgetTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bitget Trigger',
    name: 'bitgetTrigger',
    icon: 'file:bitget.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Triggers on Bitget events via polling',
    defaults: {
      name: 'Bitget Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'bitgetApi',
        required: true,
        displayOptions: {
          show: {
            event: ['orderFilled', 'positionChange', 'balanceChange'],
          },
        },
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Price Alert',
            value: 'priceAlert',
            description: 'Trigger when price crosses a threshold',
          },
          {
            name: 'Order Filled',
            value: 'orderFilled',
            description: 'Trigger when an order is filled',
          },
          {
            name: 'Position Change',
            value: 'positionChange',
            description: 'Trigger when a futures position changes',
          },
          {
            name: 'Balance Change',
            value: 'balanceChange',
            description: 'Trigger when account balance changes',
          },
          {
            name: 'New Trade',
            value: 'newTrade',
            description: 'Trigger on new market trades for a symbol',
          },
        ],
        default: 'priceAlert',
      },

      // Price Alert fields
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: 'BTCUSDT',
        required: true,
        description: 'Trading pair symbol',
        displayOptions: {
          show: {
            event: ['priceAlert', 'newTrade'],
          },
        },
      },
      {
        displayName: 'Market Type',
        name: 'marketType',
        type: 'options',
        options: [
          { name: 'Spot', value: 'spot' },
          { name: 'Futures', value: 'futures' },
        ],
        default: 'spot',
        displayOptions: {
          show: {
            event: ['priceAlert', 'newTrade'],
          },
        },
      },
      {
        displayName: 'Product Type',
        name: 'productType',
        type: 'options',
        options: [
          { name: 'USDT-M Futures', value: 'USDT-FUTURES' },
          { name: 'USDC-M Futures', value: 'USDC-FUTURES' },
          { name: 'Coin-M Futures', value: 'COIN-FUTURES' },
        ],
        default: 'USDT-FUTURES',
        displayOptions: {
          show: {
            event: ['priceAlert', 'newTrade'],
            marketType: ['futures'],
          },
        },
      },
      {
        displayName: 'Price Condition',
        name: 'priceCondition',
        type: 'options',
        options: [
          { name: 'Price Above', value: 'above' },
          { name: 'Price Below', value: 'below' },
          { name: 'Crosses Above', value: 'crossesAbove' },
          { name: 'Crosses Below', value: 'crossesBelow' },
        ],
        default: 'above',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      {
        displayName: 'Target Price',
        name: 'targetPrice',
        type: 'string',
        default: '',
        required: true,
        description: 'Price threshold to trigger alert',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },

      // Order Filled fields
      {
        displayName: 'Order Symbol Filter',
        name: 'orderSymbol',
        type: 'string',
        default: '',
        placeholder: 'BTCUSDT (leave empty for all)',
        displayOptions: {
          show: {
            event: ['orderFilled'],
          },
        },
      },
      {
        displayName: 'Order Type Filter',
        name: 'orderTypeFilter',
        type: 'options',
        options: [
          { name: 'All Orders', value: 'all' },
          { name: 'Spot Only', value: 'spot' },
          { name: 'Futures Only', value: 'futures' },
        ],
        default: 'all',
        displayOptions: {
          show: {
            event: ['orderFilled'],
          },
        },
      },

      // Position Change fields
      {
        displayName: 'Position Product Type',
        name: 'positionProductType',
        type: 'options',
        options: [
          { name: 'All Products', value: 'all' },
          { name: 'USDT-M Futures', value: 'USDT-FUTURES' },
          { name: 'USDC-M Futures', value: 'USDC-FUTURES' },
          { name: 'Coin-M Futures', value: 'COIN-FUTURES' },
        ],
        default: 'all',
        displayOptions: {
          show: {
            event: ['positionChange'],
          },
        },
      },
      {
        displayName: 'Position Symbol Filter',
        name: 'positionSymbol',
        type: 'string',
        default: '',
        placeholder: 'BTCUSDT (leave empty for all)',
        displayOptions: {
          show: {
            event: ['positionChange'],
          },
        },
      },

      // Balance Change fields
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        options: [
          { name: 'All Accounts', value: 'all' },
          { name: 'Spot', value: 'spot' },
          { name: 'Futures', value: 'futures' },
        ],
        default: 'spot',
        displayOptions: {
          show: {
            event: ['balanceChange'],
          },
        },
      },
      {
        displayName: 'Coin Filter',
        name: 'coinFilter',
        type: 'string',
        default: '',
        placeholder: 'USDT (leave empty for all)',
        displayOptions: {
          show: {
            event: ['balanceChange'],
          },
        },
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const event = this.getNodeParameter('event') as string;
    const webhookData = this.getWorkflowStaticData('node');

    try {
      let responseData: any[] = [];

      switch (event) {
        case 'priceAlert': {
          const result = await handlePriceAlert.call(this, webhookData);
          if (result) responseData = [result];
          break;
        }

        case 'orderFilled': {
          responseData = await handleOrderFilled.call(this, webhookData);
          break;
        }

        case 'positionChange': {
          responseData = await handlePositionChange.call(this, webhookData);
          break;
        }

        case 'balanceChange': {
          responseData = await handleBalanceChange.call(this, webhookData);
          break;
        }

        case 'newTrade': {
          responseData = await handleNewTrade.call(this, webhookData);
          break;
        }
      }

      if (responseData.length === 0) {
        return null;
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      // Log error but don't fail the trigger
      console.error(`Bitget Trigger Error: ${error.message}`);
      return null;
    }
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

async function handlePriceAlert(
  this: IPollFunctions,
  webhookData: Record<string, any>,
): Promise<any | null> {
  const symbol = formatSymbol(this.getNodeParameter('symbol') as string);
  const marketType = this.getNodeParameter('marketType') as string;
  const priceCondition = this.getNodeParameter('priceCondition') as string;
  const targetPrice = parseFloat(this.getNodeParameter('targetPrice') as string);

  // Get current price
  let endpoint: string;
  const query: Record<string, any> = { symbol };

  if (marketType === 'spot') {
    endpoint = ENDPOINTS.MARKET_TICKER;
  } else {
    const productType = this.getNodeParameter('productType') as string;
    endpoint = ENDPOINTS.FUTURES_MARKET_TICKER;
    query.productType = productType;
  }

  const ticker = await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);
  const currentPrice = parseFloat(ticker.lastPr || ticker.last || '0');

  const lastPrice = (webhookData.lastPrice as number) || currentPrice;
  webhookData.lastPrice = currentPrice;

  let triggered = false;

  switch (priceCondition) {
    case 'above':
      triggered = currentPrice > targetPrice;
      break;
    case 'below':
      triggered = currentPrice < targetPrice;
      break;
    case 'crossesAbove':
      triggered = lastPrice <= targetPrice && currentPrice > targetPrice;
      break;
    case 'crossesBelow':
      triggered = lastPrice >= targetPrice && currentPrice < targetPrice;
      break;
  }

  if (triggered) {
    return {
      symbol,
      marketType,
      currentPrice,
      targetPrice,
      priceCondition,
      previousPrice: lastPrice,
      timestamp: new Date().toISOString(),
    };
  }

  return null;
}

async function handleOrderFilled(
  this: IPollFunctions,
  webhookData: Record<string, any>,
): Promise<any[]> {
  const orderSymbol = this.getNodeParameter('orderSymbol', '') as string;
  const orderTypeFilter = this.getNodeParameter('orderTypeFilter') as string;

  const lastOrderId = (webhookData.lastOrderId as string) || '';
  const results: any[] = [];

  // Check spot orders
  if (orderTypeFilter === 'all' || orderTypeFilter === 'spot') {
    const query: Record<string, any> = { limit: 20 };
    if (orderSymbol) query.symbol = formatSymbol(orderSymbol);

    try {
      const spotOrders = await bitgetApiRequest.call(
        this,
        'GET',
        ENDPOINTS.SPOT_TRADE_HISTORY_ORDERS,
        {},
        query,
      );

      if (Array.isArray(spotOrders)) {
        for (const order of spotOrders) {
          if (order.status === 'full_fill' || order.status === 'partial_fill') {
            if (!lastOrderId || order.orderId > lastOrderId) {
              results.push({
                ...order,
                orderType: 'spot',
              });
            }
          }
        }
      }
    } catch {
      // Ignore spot order errors if user might not have spot account
    }
  }

  // Check futures orders
  if (orderTypeFilter === 'all' || orderTypeFilter === 'futures') {
    for (const productType of ['USDT-FUTURES', 'USDC-FUTURES']) {
      const query: Record<string, any> = { productType, limit: 20 };
      if (orderSymbol) query.symbol = formatSymbol(orderSymbol);

      try {
        const futuresOrders = await bitgetApiRequest.call(
          this,
          'GET',
          ENDPOINTS.FUTURES_HISTORY_ORDERS,
          {},
          query,
        );

        if (Array.isArray(futuresOrders)) {
          for (const order of futuresOrders) {
            if (order.status === 'filled' || order.status === 'partial_fill') {
              if (!lastOrderId || order.orderId > lastOrderId) {
                results.push({
                  ...order,
                  orderType: 'futures',
                  productType,
                });
              }
            }
          }
        }
      } catch {
        // Ignore errors for individual product types
      }
    }
  }

  // Update last order ID
  if (results.length > 0) {
    const maxOrderId = results.reduce(
      (max, order) => (order.orderId > max ? order.orderId : max),
      lastOrderId,
    );
    webhookData.lastOrderId = maxOrderId;
  }

  return results;
}

async function handlePositionChange(
  this: IPollFunctions,
  webhookData: Record<string, any>,
): Promise<any[]> {
  const positionProductType = this.getNodeParameter('positionProductType') as string;
  const positionSymbol = this.getNodeParameter('positionSymbol', '') as string;

  const productTypes =
    positionProductType === 'all'
      ? ['USDT-FUTURES', 'USDC-FUTURES', 'COIN-FUTURES']
      : [positionProductType];

  const results: any[] = [];
  const previousPositions = (webhookData.positions as Record<string, any>) || {};
  const currentPositions: Record<string, any> = {};

  for (const productType of productTypes) {
    try {
      const query: Record<string, any> = { productType };
      if (positionSymbol) query.symbol = formatSymbol(positionSymbol);

      const positions = await bitgetApiRequest.call(
        this,
        'GET',
        ENDPOINTS.FUTURES_POSITIONS,
        {},
        query,
      );

      if (Array.isArray(positions)) {
        for (const position of positions) {
          const posKey = `${productType}-${position.symbol}-${position.holdSide}`;
          currentPositions[posKey] = position;

          const prevPosition = previousPositions[posKey];

          // Check for changes
          if (!prevPosition) {
            // New position
            results.push({
              ...position,
              changeType: 'opened',
              productType,
            });
          } else if (
            position.total !== prevPosition.total ||
            position.available !== prevPosition.available
          ) {
            // Position size changed
            results.push({
              ...position,
              changeType: 'modified',
              previousTotal: prevPosition.total,
              previousAvailable: prevPosition.available,
              productType,
            });
          }
        }
      }
    } catch {
      // Ignore errors for individual product types
    }
  }

  // Check for closed positions
  for (const [posKey, prevPosition] of Object.entries(previousPositions)) {
    if (!currentPositions[posKey]) {
      results.push({
        ...prevPosition,
        changeType: 'closed',
      });
    }
  }

  // Update stored positions
  webhookData.positions = currentPositions;

  return results;
}

async function handleBalanceChange(
  this: IPollFunctions,
  webhookData: Record<string, any>,
): Promise<any[]> {
  const accountType = this.getNodeParameter('accountType') as string;
  const coinFilter = this.getNodeParameter('coinFilter', '') as string;

  const results: any[] = [];
  const previousBalances = (webhookData.balances as Record<string, any>) || {};
  const currentBalances: Record<string, any> = {};

  // Check spot balances
  if (accountType === 'all' || accountType === 'spot') {
    try {
      const query: Record<string, any> = {};
      if (coinFilter) query.coin = coinFilter.toUpperCase();

      const assets = await bitgetApiRequest.call(
        this,
        'GET',
        ENDPOINTS.SPOT_ACCOUNT_ASSETS,
        {},
        query,
      );

      if (Array.isArray(assets)) {
        for (const asset of assets) {
          const balKey = `spot-${asset.coin}`;
          currentBalances[balKey] = {
            ...asset,
            accountType: 'spot',
          };

          const prevBalance = previousBalances[balKey];

          if (
            prevBalance &&
            (asset.available !== prevBalance.available || asset.frozen !== prevBalance.frozen)
          ) {
            results.push({
              ...asset,
              accountType: 'spot',
              previousAvailable: prevBalance.available,
              previousFrozen: prevBalance.frozen,
              changeType: 'modified',
            });
          }
        }
      }
    } catch {
      // Ignore spot account errors
    }
  }

  // Check futures balances
  if (accountType === 'all' || accountType === 'futures') {
    for (const productType of ['USDT-FUTURES', 'USDC-FUTURES']) {
      try {
        const query: Record<string, any> = { productType };
        if (coinFilter) query.marginCoin = coinFilter.toUpperCase();

        const account = await bitgetApiRequest.call(
          this,
          'GET',
          ENDPOINTS.FUTURES_ACCOUNT,
          {},
          query,
        );

        if (account && Array.isArray(account)) {
          for (const acc of account) {
            const balKey = `futures-${productType}-${acc.marginCoin}`;
            currentBalances[balKey] = {
              ...acc,
              accountType: 'futures',
              productType,
            };

            const prevBalance = previousBalances[balKey];

            if (
              prevBalance &&
              (acc.available !== prevBalance.available ||
                acc.equity !== prevBalance.equity)
            ) {
              results.push({
                ...acc,
                accountType: 'futures',
                productType,
                previousAvailable: prevBalance.available,
                previousEquity: prevBalance.equity,
                changeType: 'modified',
              });
            }
          }
        }
      } catch {
        // Ignore errors for individual product types
      }
    }
  }

  // Update stored balances
  webhookData.balances = currentBalances;

  return results;
}

async function handleNewTrade(
  this: IPollFunctions,
  webhookData: Record<string, any>,
): Promise<any[]> {
  const symbol = formatSymbol(this.getNodeParameter('symbol') as string);
  const marketType = this.getNodeParameter('marketType') as string;

  let endpoint: string;
  const query: Record<string, any> = { symbol, limit: '50' };

  if (marketType === 'spot') {
    endpoint = ENDPOINTS.MARKET_TRADES;
  } else {
    const productType = this.getNodeParameter('productType') as string;
    endpoint = ENDPOINTS.FUTURES_MARKET_TRADES;
    query.productType = productType;
  }

  const trades = await bitgetPublicApiRequest.call(this, 'GET', endpoint, query);

  if (!Array.isArray(trades) || trades.length === 0) {
    return [];
  }

  const lastTradeId = (webhookData.lastTradeId as string) || '';
  const results: any[] = [];

  for (const trade of trades) {
    const tradeId = trade.tradeId || trade.ts;
    if (!lastTradeId || tradeId > lastTradeId) {
      results.push({
        ...trade,
        symbol,
        marketType,
      });
    }
  }

  // Update last trade ID
  if (trades.length > 0) {
    const maxTradeId = trades.reduce(
      (max, trade) => {
        const id = trade.tradeId || trade.ts;
        return id > max ? id : max;
      },
      lastTradeId,
    );
    webhookData.lastTradeId = maxTradeId;
  }

  return results;
}

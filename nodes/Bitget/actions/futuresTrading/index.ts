/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const futuresTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
      },
    },
    options: [
      {
        name: 'Place Order',
        value: 'placeOrder',
        description: 'Place a new futures order',
        action: 'Place futures order',
      },
      {
        name: 'Batch Place Orders',
        value: 'batchPlaceOrders',
        description: 'Place multiple futures orders',
        action: 'Batch place futures orders',
      },
      {
        name: 'Modify Order',
        value: 'modifyOrder',
        description: 'Modify an existing order',
        action: 'Modify futures order',
      },
      {
        name: 'Cancel Order',
        value: 'cancelOrder',
        description: 'Cancel a specific order',
        action: 'Cancel futures order',
      },
      {
        name: 'Cancel All Orders',
        value: 'cancelAllOrders',
        description: 'Cancel all orders for a symbol',
        action: 'Cancel all futures orders',
      },
      {
        name: 'Get Open Orders',
        value: 'getOpenOrders',
        description: 'Get current open orders',
        action: 'Get open futures orders',
      },
      {
        name: 'Get Order History',
        value: 'getOrderHistory',
        description: 'Get historical orders',
        action: 'Get futures order history',
      },
      {
        name: 'Get Fills',
        value: 'getFills',
        description: 'Get trade fills',
        action: 'Get futures trade fills',
      },
      {
        name: 'Place Plan Order',
        value: 'placePlanOrder',
        description: 'Place a trigger/stop order',
        action: 'Place plan order',
      },
      {
        name: 'Cancel Plan Order',
        value: 'cancelPlanOrder',
        description: 'Cancel a trigger/stop order',
        action: 'Cancel plan order',
      },
      {
        name: 'Get Plan Orders',
        value: 'getPlanOrders',
        description: 'Get pending plan orders',
        action: 'Get plan orders',
      },
    ],
    default: 'placeOrder',
  },
];

export const futuresTradingFields: INodeProperties[] = [
  // Product Type field (common)
  {
    displayName: 'Product Type',
    name: 'productType',
    type: 'options',
    options: [
      { name: 'USDT Futures', value: 'USDT-FUTURES' },
      { name: 'USDC Futures', value: 'USDC-FUTURES' },
      { name: 'Coin Futures', value: 'COIN-FUTURES' },
    ],
    default: 'USDT-FUTURES',
    required: true,
    description: 'Futures product type',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
      },
    },
  },

  // Place Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin currency',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Side',
    name: 'side',
    type: 'options',
    options: [
      { name: 'Open Long', value: 'open_long' },
      { name: 'Open Short', value: 'open_short' },
      { name: 'Close Long', value: 'close_long' },
      { name: 'Close Short', value: 'close_short' },
    ],
    default: 'open_long',
    required: true,
    description: 'Order side',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Order Type',
    name: 'orderType',
    type: 'options',
    options: [
      { name: 'Limit', value: 'limit' },
      { name: 'Market', value: 'market' },
    ],
    default: 'limit',
    required: true,
    description: 'Order type',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Size',
    name: 'size',
    type: 'string',
    default: '',
    required: true,
    description: 'Contract quantity',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Price',
    name: 'price',
    type: 'string',
    default: '',
    required: true,
    description: 'Order price (required for limit orders)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
        orderType: ['limit'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placeOrder'],
      },
    },
    options: [
      {
        displayName: 'Time in Force',
        name: 'force',
        type: 'options',
        options: [
          { name: 'Good Till Cancel (GTC)', value: 'GTC' },
          { name: 'Immediate or Cancel (IOC)', value: 'IOC' },
          { name: 'Fill or Kill (FOK)', value: 'FOK' },
          { name: 'Post Only', value: 'post_only' },
        ],
        default: 'GTC',
      },
      {
        displayName: 'Client Order ID',
        name: 'clientOid',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Reduce Only',
        name: 'reduceOnly',
        type: 'boolean',
        default: false,
        description: 'Whether this is a reduce-only order',
      },
      {
        displayName: 'Take Profit Price',
        name: 'presetStopSurplusPrice',
        type: 'string',
        default: '',
        description: 'Preset take profit price',
      },
      {
        displayName: 'Stop Loss Price',
        name: 'presetStopLossPrice',
        type: 'string',
        default: '',
        description: 'Preset stop loss price',
      },
    ],
  },

  // Batch Place Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['batchPlaceOrders'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin currency',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['batchPlaceOrders'],
      },
    },
  },
  {
    displayName: 'Orders',
    name: 'orders',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      maxValue: 50,
    },
    default: {},
    description: 'Orders to place (maximum 50)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['batchPlaceOrders'],
      },
    },
    options: [
      {
        displayName: 'Order',
        name: 'order',
        values: [
          {
            displayName: 'Side',
            name: 'side',
            type: 'options',
            options: [
              { name: 'Open Long', value: 'open_long' },
              { name: 'Open Short', value: 'open_short' },
              { name: 'Close Long', value: 'close_long' },
              { name: 'Close Short', value: 'close_short' },
            ],
            default: 'open_long',
          },
          {
            displayName: 'Order Type',
            name: 'orderType',
            type: 'options',
            options: [
              { name: 'Limit', value: 'limit' },
              { name: 'Market', value: 'market' },
            ],
            default: 'limit',
          },
          {
            displayName: 'Size',
            name: 'size',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Price',
            name: 'price',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Client Order ID',
            name: 'clientOid',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
  },

  // Modify Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['modifyOrder'],
      },
    },
  },
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    default: '',
    description: 'Order ID to modify (provide this or Client Order ID)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['modifyOrder'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Client order ID to modify',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['modifyOrder'],
      },
    },
  },
  {
    displayName: 'New Price',
    name: 'newPrice',
    type: 'string',
    default: '',
    description: 'New order price',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['modifyOrder'],
      },
    },
  },
  {
    displayName: 'New Size',
    name: 'newSize',
    type: 'string',
    default: '',
    description: 'New order size',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['modifyOrder'],
      },
    },
  },

  // Cancel Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelOrder'],
      },
    },
  },
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    default: '',
    description: 'Order ID to cancel (provide this or Client Order ID)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelOrder'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Client order ID to cancel',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelOrder'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin currency',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelOrder'],
      },
    },
  },

  // Cancel All Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelAllOrders'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    description: 'Margin currency',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelAllOrders'],
      },
    },
  },

  // Get Open Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by contract symbol (optional)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getOpenOrders'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getOpenOrders'],
      },
    },
    options: [
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Client Order ID',
        name: 'clientOid',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 100,
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
      },
    ],
  },

  // Get Order History fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by contract symbol (optional)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getOrderHistory'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getOrderHistory'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 500,
        },
        default: 100,
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
      },
    ],
  },

  // Get Fills fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by contract symbol (optional)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getFills'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getFills'],
      },
    },
    options: [
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 500,
        },
        default: 100,
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
      },
    ],
  },

  // Place Plan Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin currency',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Side',
    name: 'side',
    type: 'options',
    options: [
      { name: 'Open Long', value: 'open_long' },
      { name: 'Open Short', value: 'open_short' },
      { name: 'Close Long', value: 'close_long' },
      { name: 'Close Short', value: 'close_short' },
    ],
    default: 'open_long',
    required: true,
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Trigger Price',
    name: 'triggerPrice',
    type: 'string',
    default: '',
    required: true,
    description: 'Price that triggers the order',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Trigger Type',
    name: 'triggerType',
    type: 'options',
    options: [
      { name: 'Fill Price', value: 'fill_price' },
      { name: 'Mark Price', value: 'mark_price' },
    ],
    default: 'mark_price',
    required: true,
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Order Type',
    name: 'orderType',
    type: 'options',
    options: [
      { name: 'Limit', value: 'limit' },
      { name: 'Market', value: 'market' },
    ],
    default: 'market',
    required: true,
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Size',
    name: 'size',
    type: 'string',
    default: '',
    required: true,
    description: 'Contract quantity',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },
  {
    displayName: 'Execute Price',
    name: 'executePrice',
    type: 'string',
    default: '',
    description: 'Execution price (required for limit orders)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
        orderType: ['limit'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['placePlanOrder'],
      },
    },
  },

  // Cancel Plan Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelPlanOrder'],
      },
    },
  },
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    default: '',
    description: 'Order ID to cancel (provide this or Client Order ID)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelPlanOrder'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelPlanOrder'],
      },
    },
  },
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['cancelPlanOrder'],
      },
    },
  },

  // Get Plan Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by contract symbol (optional)',
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getPlanOrders'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresTrading'],
        operation: ['getPlanOrders'],
      },
    },
    options: [
      {
        displayName: 'Plan Type',
        name: 'planType',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Normal Plan', value: 'normal_plan' },
          { name: 'Track Plan', value: 'track_plan' },
        ],
        default: '',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 100,
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
      },
    ],
  },
];

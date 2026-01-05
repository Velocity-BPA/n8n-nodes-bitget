/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const spotTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
      },
    },
    options: [
      {
        name: 'Place Order',
        value: 'placeOrder',
        description: 'Place a new spot order',
        action: 'Place spot order',
      },
      {
        name: 'Batch Place Orders',
        value: 'batchPlaceOrders',
        description: 'Place multiple spot orders at once (max 50)',
        action: 'Batch place spot orders',
      },
      {
        name: 'Cancel Order',
        value: 'cancelOrder',
        description: 'Cancel a specific order',
        action: 'Cancel spot order',
      },
      {
        name: 'Batch Cancel Orders',
        value: 'batchCancelOrders',
        description: 'Cancel multiple orders at once',
        action: 'Batch cancel spot orders',
      },
      {
        name: 'Get Open Orders',
        value: 'getOpenOrders',
        description: 'Get current open orders',
        action: 'Get open spot orders',
      },
      {
        name: 'Get Order History',
        value: 'getOrderHistory',
        description: 'Get historical orders',
        action: 'Get spot order history',
      },
      {
        name: 'Get Order Detail',
        value: 'getOrderDetail',
        description: 'Get details of a specific order',
        action: 'Get spot order detail',
      },
      {
        name: 'Get Fills',
        value: 'getFills',
        description: 'Get trade fills',
        action: 'Get spot trade fills',
      },
    ],
    default: 'placeOrder',
  },
];

export const spotTradingFields: INodeProperties[] = [
  // Place Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    placeholder: 'BTCUSDT',
    description: 'Trading pair symbol',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Side',
    name: 'side',
    type: 'options',
    options: [
      { name: 'Buy', value: 'buy' },
      { name: 'Sell', value: 'sell' },
    ],
    default: 'buy',
    required: true,
    description: 'Order side',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
        operation: ['placeOrder'],
        orderType: ['limit'],
      },
    },
  },
  {
    displayName: 'Size',
    name: 'size',
    type: 'string',
    default: '',
    required: true,
    description: 'Order quantity',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['placeOrder'],
      },
    },
  },
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
    description: 'Time in force policy',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['placeOrder'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Custom order ID for tracking (optional, auto-generated if empty)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['placeOrder'],
      },
    },
  },

  // Batch Place Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Trading pair symbol',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
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
              { name: 'Buy', value: 'buy' },
              { name: 'Sell', value: 'sell' },
            ],
            default: 'buy',
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
            displayName: 'Price',
            name: 'price',
            type: 'string',
            default: '',
            description: 'Order price (required for limit orders)',
          },
          {
            displayName: 'Size',
            name: 'size',
            type: 'string',
            default: '',
            description: 'Order quantity',
          },
          {
            displayName: 'Time in Force',
            name: 'force',
            type: 'options',
            options: [
              { name: 'Good Till Cancel (GTC)', value: 'GTC' },
              { name: 'Immediate or Cancel (IOC)', value: 'IOC' },
              { name: 'Fill or Kill (FOK)', value: 'FOK' },
            ],
            default: 'GTC',
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

  // Cancel Order fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Trading pair symbol',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
        operation: ['cancelOrder'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Client order ID to cancel (alternative to Order ID)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['cancelOrder'],
      },
    },
  },

  // Batch Cancel Orders fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Trading pair symbol',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['batchCancelOrders'],
      },
    },
  },
  {
    displayName: 'Order IDs',
    name: 'orderIds',
    type: 'string',
    default: '',
    placeholder: 'orderId1,orderId2,orderId3',
    description: 'Comma-separated list of order IDs to cancel',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['batchCancelOrders'],
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
    description: 'Filter by trading pair (optional)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
        operation: ['getOpenOrders'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'Start time for the query',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'End time for the query',
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
        description: 'Maximum number of records to return',
      },
      {
        displayName: 'Order Type',
        name: 'orderType',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Limit', value: 'limit' },
          { name: 'Market', value: 'market' },
        ],
        default: '',
        description: 'Filter by order type',
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
    description: 'Filter by trading pair (optional)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
        operation: ['getOrderHistory'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'Start time for the query',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'End time for the query',
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
        description: 'Maximum number of records to return',
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
        description: 'Pagination cursor',
      },
    ],
  },

  // Get Order Detail fields
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    default: '',
    description: 'Order ID to query (provide this or Client Order ID)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['getOrderDetail'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Client order ID to query (alternative to Order ID)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['getOrderDetail'],
      },
    },
  },

  // Get Fills fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by trading pair (optional)',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
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
        resource: ['spotTrading'],
        operation: ['getFills'],
      },
    },
    options: [
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        description: 'Filter by order ID',
      },
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'Start time for the query',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'End time for the query',
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
        description: 'Maximum number of records to return',
      },
      {
        displayName: 'ID Less Than',
        name: 'idLessThan',
        type: 'string',
        default: '',
        description: 'Pagination cursor',
      },
    ],
  },
];

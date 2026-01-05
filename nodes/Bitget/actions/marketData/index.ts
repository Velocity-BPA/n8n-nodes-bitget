/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const marketDataOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['marketData'],
      },
    },
    options: [
      {
        name: 'Get Tickers',
        value: 'getTickers',
        description: 'Get all market tickers',
        action: 'Get all tickers',
      },
      {
        name: 'Get Ticker',
        value: 'getTicker',
        description: 'Get single ticker by symbol',
        action: 'Get single ticker',
      },
      {
        name: 'Get Order Book',
        value: 'getOrderBook',
        description: 'Get market depth/order book',
        action: 'Get order book',
      },
      {
        name: 'Get Candles',
        value: 'getCandles',
        description: 'Get candlestick/OHLCV data',
        action: 'Get candles',
      },
      {
        name: 'Get Trades',
        value: 'getTrades',
        description: 'Get recent trades',
        action: 'Get recent trades',
      },
      {
        name: 'Get Symbols',
        value: 'getSymbols',
        description: 'Get trading pairs information',
        action: 'Get symbols',
      },
      {
        name: 'Get Server Time',
        value: 'getServerTime',
        description: 'Get Bitget server time',
        action: 'Get server time',
      },
    ],
    default: 'getTicker',
  },
];

export const marketDataFields: INodeProperties[] = [
  // Market Type (spot or futures)
  {
    displayName: 'Market Type',
    name: 'marketType',
    type: 'options',
    options: [
      { name: 'Spot', value: 'spot' },
      { name: 'Futures', value: 'futures' },
    ],
    default: 'spot',
    description: 'Select spot or futures market',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getTickers', 'getTicker', 'getOrderBook', 'getCandles', 'getTrades', 'getSymbols'],
      },
    },
  },

  // Product Type for Futures (shown only when futures is selected)
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
    description: 'Futures product type',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getTickers', 'getTicker', 'getOrderBook', 'getCandles', 'getTrades', 'getSymbols'],
        marketType: ['futures'],
      },
    },
  },

  // Get Ticker fields
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
        resource: ['marketData'],
        operation: ['getTicker'],
      },
    },
  },

  // Get Order Book fields
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
        resource: ['marketData'],
        operation: ['getOrderBook'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'options',
    options: [
      { name: '5 Levels', value: '5' },
      { name: '15 Levels', value: '15' },
      { name: '50 Levels', value: '50' },
      { name: '100 Levels', value: '100' },
    ],
    default: '50',
    description: 'Number of order book levels',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getOrderBook'],
      },
    },
  },
  {
    displayName: 'Merge Precision',
    name: 'precision',
    type: 'string',
    default: '',
    placeholder: '0.01',
    description: 'Price precision for merging (optional)',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getOrderBook'],
      },
    },
  },

  // Get Candles fields
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
        resource: ['marketData'],
        operation: ['getCandles'],
      },
    },
  },
  {
    displayName: 'Granularity',
    name: 'granularity',
    type: 'options',
    options: [
      { name: '1 Minute', value: '1m' },
      { name: '5 Minutes', value: '5m' },
      { name: '15 Minutes', value: '15m' },
      { name: '30 Minutes', value: '30m' },
      { name: '1 Hour', value: '1H' },
      { name: '4 Hours', value: '4H' },
      { name: '6 Hours', value: '6H' },
      { name: '12 Hours', value: '12H' },
      { name: '1 Day', value: '1D' },
      { name: '1 Week', value: '1W' },
      { name: '1 Month', value: '1M' },
    ],
    default: '1H',
    description: 'Candle interval/timeframe',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getCandles'],
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
        resource: ['marketData'],
        operation: ['getCandles'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'Start time for candle data',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'End time for candle data',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 1000,
        },
        default: 100,
        description: 'Maximum number of candles to return',
      },
    ],
  },

  // Get Trades fields
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
        resource: ['marketData'],
        operation: ['getTrades'],
      },
    },
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
    description: 'Maximum number of trades to return',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getTrades'],
      },
    },
  },

  // Get Symbols fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by specific symbol (optional, leave empty for all)',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getSymbols'],
      },
    },
  },
];

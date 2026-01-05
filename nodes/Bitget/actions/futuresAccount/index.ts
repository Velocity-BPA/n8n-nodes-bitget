/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const futuresAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
      },
    },
    options: [
      {
        name: 'Get Account',
        value: 'getAccount',
        description: 'Get futures account information',
        action: 'Get futures account',
      },
      {
        name: 'Get Positions',
        value: 'getPositions',
        description: 'Get all open positions',
        action: 'Get all futures positions',
      },
      {
        name: 'Get Single Position',
        value: 'getSinglePosition',
        description: 'Get a specific position',
        action: 'Get single futures position',
      },
      {
        name: 'Set Leverage',
        value: 'setLeverage',
        description: 'Adjust leverage for a symbol',
        action: 'Set leverage',
      },
      {
        name: 'Set Margin Mode',
        value: 'setMarginMode',
        description: 'Set cross or isolated margin mode',
        action: 'Set margin mode',
      },
      {
        name: 'Get Bills',
        value: 'getBills',
        description: 'Get futures account bills',
        action: 'Get futures account bills',
      },
    ],
    default: 'getAccount',
  },
];

export const futuresAccountFields: INodeProperties[] = [
  // Product Type field (common for most operations)
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
        resource: ['futuresAccount'],
        operation: ['getAccount', 'getPositions', 'getSinglePosition', 'setLeverage', 'setMarginMode', 'getBills'],
      },
    },
  },

  // Get Account fields
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin currency (e.g., USDT, USDC, BTC)',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['getAccount'],
      },
    },
  },

  // Get Positions fields
  {
    displayName: 'Margin Coin',
    name: 'marginCoin',
    type: 'string',
    default: '',
    placeholder: 'USDT (optional)',
    description: 'Filter by margin currency (leave empty for all)',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['getPositions'],
      },
    },
  },

  // Get Single Position fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    placeholder: 'BTCUSDT',
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['getSinglePosition'],
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
        resource: ['futuresAccount'],
        operation: ['getSinglePosition'],
      },
    },
  },

  // Set Leverage fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['setLeverage'],
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
        resource: ['futuresAccount'],
        operation: ['setLeverage'],
      },
    },
  },
  {
    displayName: 'Leverage',
    name: 'leverage',
    type: 'number',
    typeOptions: {
      minValue: 1,
      maxValue: 125,
    },
    default: 10,
    required: true,
    description: 'Leverage multiplier (1-125, varies by pair)',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['setLeverage'],
      },
    },
  },
  {
    displayName: 'Hold Side',
    name: 'holdSide',
    type: 'options',
    options: [
      { name: 'Long', value: 'long' },
      { name: 'Short', value: 'short' },
    ],
    default: 'long',
    description: 'Position side for leverage (in hedge mode)',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['setLeverage'],
      },
    },
  },

  // Set Margin Mode fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['setMarginMode'],
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
        resource: ['futuresAccount'],
        operation: ['setMarginMode'],
      },
    },
  },
  {
    displayName: 'Margin Mode',
    name: 'marginMode',
    type: 'options',
    options: [
      { name: 'Crossed (Cross Margin)', value: 'crossed' },
      { name: 'Isolated', value: 'isolated' },
    ],
    default: 'crossed',
    required: true,
    description: 'Margin mode to set',
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['setMarginMode'],
      },
    },
  },

  // Get Bills fields
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['futuresAccount'],
        operation: ['getBills'],
      },
    },
    options: [
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: '',
        description: 'Filter by contract symbol',
      },
      {
        displayName: 'Margin Coin',
        name: 'marginCoin',
        type: 'string',
        default: '',
        description: 'Filter by margin currency',
      },
      {
        displayName: 'Business Type',
        name: 'businessType',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Open Long', value: 'open_long' },
          { name: 'Open Short', value: 'open_short' },
          { name: 'Close Long', value: 'close_long' },
          { name: 'Close Short', value: 'close_short' },
          { name: 'Trans In', value: 'trans_in' },
          { name: 'Trans Out', value: 'trans_out' },
          { name: 'Funding Fee', value: 'funding_fee' },
          { name: 'Liquidation', value: 'burst_long_loss_query' },
        ],
        default: '',
        description: 'Filter by business type',
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

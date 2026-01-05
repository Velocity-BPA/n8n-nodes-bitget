/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const spotAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['spotAccount'],
      },
    },
    options: [
      {
        name: 'Get Balance',
        value: 'getBalance',
        description: 'Get spot account balance for all or specific coins',
        action: 'Get spot account balance',
      },
      {
        name: 'Get Bills',
        value: 'getBills',
        description: 'Get account bills and transaction history',
        action: 'Get account bills',
      },
      {
        name: 'Transfer',
        value: 'transfer',
        description: 'Transfer assets between accounts',
        action: 'Transfer assets between accounts',
      },
      {
        name: 'Get Transfer History',
        value: 'getTransferHistory',
        description: 'Get transfer records between accounts',
        action: 'Get transfer history',
      },
    ],
    default: 'getBalance',
  },
];

export const spotAccountFields: INodeProperties[] = [
  // Get Balance fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'BTC, ETH, USDT',
    description: 'Currency symbol (leave empty for all coins)',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['getBalance'],
      },
    },
  },

  // Get Bills fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'BTC',
    description: 'Filter by currency symbol',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['getBills'],
      },
    },
  },
  {
    displayName: 'Group Type',
    name: 'groupType',
    type: 'options',
    options: [
      { name: 'All', value: '' },
      { name: 'Deposit', value: 'deposit' },
      { name: 'Withdraw', value: 'withdraw' },
      { name: 'Transaction', value: 'transaction' },
      { name: 'Transfer', value: 'transfer' },
      { name: 'Other', value: 'other' },
    ],
    default: '',
    description: 'Filter by group type',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['getBills'],
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
        resource: ['spotAccount'],
        operation: ['getBills'],
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
        description: 'Pagination cursor - ID less than this value',
      },
    ],
  },

  // Transfer fields
  {
    displayName: 'From Account',
    name: 'fromType',
    type: 'options',
    options: [
      { name: 'Spot', value: 'spot' },
      { name: 'Futures (USDT)', value: 'mix_usdt' },
      { name: 'Futures (USDC)', value: 'mix_usdc' },
      { name: 'Futures (Coin)', value: 'mix_coin' },
    ],
    default: 'spot',
    required: true,
    description: 'Source account type',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['transfer'],
      },
    },
  },
  {
    displayName: 'To Account',
    name: 'toType',
    type: 'options',
    options: [
      { name: 'Spot', value: 'spot' },
      { name: 'Futures (USDT)', value: 'mix_usdt' },
      { name: 'Futures (USDC)', value: 'mix_usdc' },
      { name: 'Futures (Coin)', value: 'mix_coin' },
    ],
    default: 'mix_usdt',
    required: true,
    description: 'Destination account type',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['transfer'],
      },
    },
  },
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Currency to transfer',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['transfer'],
      },
    },
  },
  {
    displayName: 'Amount',
    name: 'size',
    type: 'string',
    default: '',
    required: true,
    description: 'Amount to transfer',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['transfer'],
      },
    },
  },
  {
    displayName: 'Client Order ID',
    name: 'clientOid',
    type: 'string',
    default: '',
    description: 'Custom order ID for tracking (optional)',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['transfer'],
      },
    },
  },

  // Get Transfer History fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'USDT',
    description: 'Filter by currency symbol',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['getTransferHistory'],
      },
    },
  },
  {
    displayName: 'From Account',
    name: 'fromType',
    type: 'options',
    options: [
      { name: 'All', value: '' },
      { name: 'Spot', value: 'spot' },
      { name: 'Futures (USDT)', value: 'mix_usdt' },
      { name: 'Futures (USDC)', value: 'mix_usdc' },
      { name: 'Futures (Coin)', value: 'mix_coin' },
    ],
    default: '',
    description: 'Filter by source account type',
    displayOptions: {
      show: {
        resource: ['spotAccount'],
        operation: ['getTransferHistory'],
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
        resource: ['spotAccount'],
        operation: ['getTransferHistory'],
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
        displayName: 'Client Order ID',
        name: 'clientOid',
        type: 'string',
        default: '',
        description: 'Filter by client order ID',
      },
    ],
  },
];

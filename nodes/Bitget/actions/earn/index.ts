/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const earnOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['earn'],
      },
    },
    options: [
      {
        name: 'Get Products',
        value: 'getProducts',
        description: 'List available earn products',
        action: 'Get earn products',
      },
      {
        name: 'Subscribe',
        value: 'subscribe',
        description: 'Subscribe to an earn product',
        action: 'Subscribe to earn product',
      },
      {
        name: 'Redeem',
        value: 'redeem',
        description: 'Redeem from an earn product',
        action: 'Redeem from earn product',
      },
      {
        name: 'Get Subscriptions',
        value: 'getSubscriptions',
        description: 'Get active subscriptions/assets',
        action: 'Get active subscriptions',
      },
      {
        name: 'Get History',
        value: 'getHistory',
        description: 'Get subscription history',
        action: 'Get subscription history',
      },
    ],
    default: 'getProducts',
  },
];

export const earnFields: INodeProperties[] = [
  // Get Products fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'USDT',
    description: 'Filter by currency (optional)',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getProducts'],
      },
    },
  },
  {
    displayName: 'Period Type',
    name: 'periodType',
    type: 'options',
    options: [
      { name: 'All', value: '' },
      { name: 'Flexible', value: 'flexible' },
      { name: 'Fixed', value: 'fixed' },
    ],
    default: '',
    description: 'Filter by period type',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getProducts'],
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
        resource: ['earn'],
        operation: ['getProducts'],
      },
    },
    options: [
      {
        displayName: 'Page Number',
        name: 'pageNo',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 1,
      },
      {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
      },
    ],
  },

  // Subscribe fields
  {
    displayName: 'Product ID',
    name: 'productId',
    type: 'string',
    default: '',
    required: true,
    description: 'Earn product ID to subscribe to',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['subscribe'],
      },
    },
  },
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Currency to subscribe with',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['subscribe'],
      },
    },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    default: '',
    required: true,
    description: 'Amount to subscribe',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['subscribe'],
      },
    },
  },

  // Redeem fields
  {
    displayName: 'Product ID',
    name: 'productId',
    type: 'string',
    default: '',
    required: true,
    description: 'Earn product ID to redeem from',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['redeem'],
      },
    },
  },
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Currency to redeem',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['redeem'],
      },
    },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    default: '',
    required: true,
    description: 'Amount to redeem',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['redeem'],
      },
    },
  },

  // Get Subscriptions fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'USDT',
    description: 'Filter by currency (optional)',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getSubscriptions'],
      },
    },
  },
  {
    displayName: 'Period Type',
    name: 'periodType',
    type: 'options',
    options: [
      { name: 'All', value: '' },
      { name: 'Flexible', value: 'flexible' },
      { name: 'Fixed', value: 'fixed' },
    ],
    default: '',
    description: 'Filter by period type',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getSubscriptions'],
      },
    },
  },

  // Get History fields
  {
    displayName: 'Coin',
    name: 'coin',
    type: 'string',
    default: '',
    placeholder: 'USDT',
    description: 'Filter by currency (optional)',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getHistory'],
      },
    },
  },
  {
    displayName: 'Operation Type',
    name: 'operationType',
    type: 'options',
    options: [
      { name: 'All', value: '' },
      { name: 'Subscribe', value: 'subscribe' },
      { name: 'Redeem', value: 'redeem' },
      { name: 'Interest', value: 'interest' },
    ],
    default: '',
    description: 'Filter by operation type',
    displayOptions: {
      show: {
        resource: ['earn'],
        operation: ['getHistory'],
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
        resource: ['earn'],
        operation: ['getHistory'],
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
        displayName: 'Page Number',
        name: 'pageNo',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 1,
      },
      {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
      },
    ],
  },
];

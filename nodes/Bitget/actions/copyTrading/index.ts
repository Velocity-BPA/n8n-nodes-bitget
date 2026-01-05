/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const copyTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['copyTrading'],
      },
    },
    options: [
      {
        name: 'Get Traders',
        value: 'getTraders',
        description: 'List elite traders available for copy trading',
        action: 'Get traders',
      },
      {
        name: 'Get Trader Positions',
        value: 'getTraderPositions',
        description: "Get a trader's current positions",
        action: 'Get trader positions',
      },
      {
        name: 'Follow Trader',
        value: 'followTrader',
        description: 'Start following a trader',
        action: 'Follow trader',
      },
      {
        name: 'Unfollow Trader',
        value: 'unfollowTrader',
        description: 'Stop following a trader',
        action: 'Unfollow trader',
      },
      {
        name: 'Get Follow Settings',
        value: 'getFollowSettings',
        description: 'Get copy trading settings for followed traders',
        action: 'Get follow settings',
      },
      {
        name: 'Update Follow Settings',
        value: 'updateFollowSettings',
        description: 'Update copy ratio and other settings',
        action: 'Update follow settings',
      },
      {
        name: 'Get Follower History',
        value: 'getFollowerHistory',
        description: 'Get copy trade history',
        action: 'Get follower history',
      },
      {
        name: 'Close Follower Position',
        value: 'closeFollowerPosition',
        description: 'Close a copied position',
        action: 'Close follower position',
      },
    ],
    default: 'getTraders',
  },
];

export const copyTradingFields: INodeProperties[] = [
  // Product Type (common for copy trading)
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
        resource: ['copyTrading'],
      },
    },
  },

  // Get Traders fields
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['getTraders'],
      },
    },
    options: [
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'options',
        options: [
          { name: 'Total PNL', value: 'totalPnl' },
          { name: 'Win Rate', value: 'winRate' },
          { name: 'Followers', value: 'followers' },
          { name: 'ROI', value: 'roi' },
        ],
        default: 'totalPnl',
        description: 'Sort traders by metric',
      },
      {
        displayName: 'Min ROI',
        name: 'minRoi',
        type: 'string',
        default: '',
        description: 'Minimum ROI filter (e.g., 0.1 for 10%)',
      },
      {
        displayName: 'Min Win Rate',
        name: 'minWinRate',
        type: 'string',
        default: '',
        description: 'Minimum win rate filter (e.g., 0.5 for 50%)',
      },
      {
        displayName: 'Page Number',
        name: 'pageNo',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 1,
        description: 'Page number for pagination',
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
        description: 'Number of traders per page',
      },
    ],
  },

  // Get Trader Positions fields
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    required: true,
    description: 'Unique ID of the trader',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['getTraderPositions'],
      },
    },
  },
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: '',
    placeholder: 'BTCUSDT',
    description: 'Filter by contract symbol (optional)',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['getTraderPositions'],
      },
    },
  },

  // Follow Trader fields
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    required: true,
    description: 'Unique ID of the trader to follow',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['followTrader'],
      },
    },
  },
  {
    displayName: 'Copy Trading Coin',
    name: 'copyTradeCoin',
    type: 'string',
    default: 'USDT',
    required: true,
    description: 'Margin coin for copy trading',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['followTrader'],
      },
    },
  },
  {
    displayName: 'Copy Mode',
    name: 'copyMode',
    type: 'options',
    options: [
      { name: 'Fixed Amount', value: 'fixedAmount' },
      { name: 'Ratio', value: 'ratio' },
    ],
    default: 'fixedAmount',
    required: true,
    description: 'Copy trading mode',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['followTrader'],
      },
    },
  },
  {
    displayName: 'Fixed Amount',
    name: 'fixedAmount',
    type: 'string',
    default: '',
    required: true,
    description: 'Fixed amount per trade',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['followTrader'],
        copyMode: ['fixedAmount'],
      },
    },
  },
  {
    displayName: 'Copy Ratio',
    name: 'copyRatio',
    type: 'string',
    default: '',
    required: true,
    description: 'Copy ratio (0.01-1.0, e.g., 0.5 for 50%)',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['followTrader'],
        copyMode: ['ratio'],
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
        resource: ['copyTrading'],
        operation: ['followTrader'],
      },
    },
    options: [
      {
        displayName: 'Max Follow Amount',
        name: 'maxFollowAmount',
        type: 'string',
        default: '',
        description: 'Maximum total follow amount',
      },
      {
        displayName: 'Total Limit',
        name: 'totalLimit',
        type: 'string',
        default: '',
        description: 'Total position limit',
      },
      {
        displayName: 'Stop Loss Ratio',
        name: 'stopLossRatio',
        type: 'string',
        default: '',
        description: 'Stop loss percentage (e.g., 0.1 for 10%)',
      },
      {
        displayName: 'Take Profit Ratio',
        name: 'takeProfitRatio',
        type: 'string',
        default: '',
        description: 'Take profit percentage (e.g., 0.2 for 20%)',
      },
    ],
  },

  // Unfollow Trader fields
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    required: true,
    description: 'Unique ID of the trader to unfollow',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['unfollowTrader'],
      },
    },
  },

  // Get Follow Settings fields
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    description: 'Filter by specific trader ID (optional)',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['getFollowSettings'],
      },
    },
  },

  // Update Follow Settings fields
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    required: true,
    description: 'Trader ID to update settings for',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['updateFollowSettings'],
      },
    },
  },
  {
    displayName: 'Settings to Update',
    name: 'settings',
    type: 'collection',
    placeholder: 'Add Setting',
    default: {},
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['updateFollowSettings'],
      },
    },
    options: [
      {
        displayName: 'Fixed Amount',
        name: 'fixedAmount',
        type: 'string',
        default: '',
        description: 'New fixed amount per trade',
      },
      {
        displayName: 'Copy Ratio',
        name: 'copyRatio',
        type: 'string',
        default: '',
        description: 'New copy ratio (0.01-1.0)',
      },
      {
        displayName: 'Max Follow Amount',
        name: 'maxFollowAmount',
        type: 'string',
        default: '',
        description: 'New maximum follow amount',
      },
      {
        displayName: 'Total Limit',
        name: 'totalLimit',
        type: 'string',
        default: '',
        description: 'New total position limit',
      },
      {
        displayName: 'Stop Loss Ratio',
        name: 'stopLossRatio',
        type: 'string',
        default: '',
        description: 'New stop loss percentage',
      },
      {
        displayName: 'Take Profit Ratio',
        name: 'takeProfitRatio',
        type: 'string',
        default: '',
        description: 'New take profit percentage',
      },
    ],
  },

  // Get Follower History fields
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['getFollowerHistory'],
      },
    },
    options: [
      {
        displayName: 'Trader ID',
        name: 'traderId',
        type: 'string',
        default: '',
        description: 'Filter by trader ID',
      },
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: '',
        description: 'Filter by contract symbol',
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

  // Close Follower Position fields
  {
    displayName: 'Symbol',
    name: 'symbol',
    type: 'string',
    default: 'BTCUSDT',
    required: true,
    description: 'Contract symbol',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['closeFollowerPosition'],
      },
    },
  },
  {
    displayName: 'Trader ID',
    name: 'traderId',
    type: 'string',
    default: '',
    required: true,
    description: 'Trader ID of the copied position',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['closeFollowerPosition'],
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
    required: true,
    description: 'Position side to close',
    displayOptions: {
      show: {
        resource: ['copyTrading'],
        operation: ['closeFollowerPosition'],
      },
    },
  },
];

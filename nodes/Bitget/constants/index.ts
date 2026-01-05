/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// API Configuration
export const BITGET_API_BASE_URL = 'https://api.bitget.com';

// API Endpoints
export const ENDPOINTS = {
  // Spot Account
  SPOT_ACCOUNT_ASSETS: '/api/v2/spot/account/assets',
  SPOT_ACCOUNT_BILLS: '/api/v2/spot/account/bills',
  SPOT_WALLET_TRANSFER: '/api/v2/spot/wallet/transfer',
  SPOT_WALLET_TRANSFER_RECORDS: '/api/v2/spot/wallet/transfer-records',

  // Spot Trading
  SPOT_TRADE_PLACE_ORDER: '/api/v2/spot/trade/place-order',
  SPOT_TRADE_BATCH_ORDERS: '/api/v2/spot/trade/batch-orders',
  SPOT_TRADE_CANCEL_ORDER: '/api/v2/spot/trade/cancel-order',
  SPOT_TRADE_BATCH_CANCEL: '/api/v2/spot/trade/batch-cancel-order',
  SPOT_TRADE_OPEN_ORDERS: '/api/v2/spot/trade/unfilled-orders',
  SPOT_TRADE_HISTORY_ORDERS: '/api/v2/spot/trade/history-orders',
  SPOT_TRADE_ORDER_INFO: '/api/v2/spot/trade/orderInfo',
  SPOT_TRADE_FILLS: '/api/v2/spot/trade/fills',

  // Futures Account
  FUTURES_ACCOUNT: '/api/v2/mix/account/account',
  FUTURES_ACCOUNTS: '/api/v2/mix/account/accounts',
  FUTURES_POSITIONS: '/api/v2/mix/position/all-position',
  FUTURES_SINGLE_POSITION: '/api/v2/mix/position/single-position',
  FUTURES_SET_LEVERAGE: '/api/v2/mix/account/set-leverage',
  FUTURES_SET_MARGIN_MODE: '/api/v2/mix/account/set-margin-mode',
  FUTURES_BILLS: '/api/v2/mix/account/bill',

  // Futures Trading
  FUTURES_PLACE_ORDER: '/api/v2/mix/order/place-order',
  FUTURES_BATCH_ORDERS: '/api/v2/mix/order/batch-place-order',
  FUTURES_MODIFY_ORDER: '/api/v2/mix/order/modify-order',
  FUTURES_CANCEL_ORDER: '/api/v2/mix/order/cancel-order',
  FUTURES_CANCEL_ALL_ORDERS: '/api/v2/mix/order/cancel-all-orders',
  FUTURES_OPEN_ORDERS: '/api/v2/mix/order/orders-pending',
  FUTURES_HISTORY_ORDERS: '/api/v2/mix/order/orders-history',
  FUTURES_FILLS: '/api/v2/mix/order/fills',
  FUTURES_PLACE_PLAN_ORDER: '/api/v2/mix/order/place-plan-order',
  FUTURES_CANCEL_PLAN_ORDER: '/api/v2/mix/order/cancel-plan-order',
  FUTURES_PLAN_ORDERS: '/api/v2/mix/order/orders-plan-pending',

  // Copy Trading
  COPY_TRADERS: '/api/v2/copy/mix-trader/trader-list',
  COPY_TRADER_POSITIONS: '/api/v2/copy/mix-trader/query-current-orders',
  COPY_FOLLOW_TRADER: '/api/v2/copy/mix-follower/set-follow',
  COPY_UNFOLLOW_TRADER: '/api/v2/copy/mix-follower/cancel-follow',
  COPY_FOLLOW_SETTINGS: '/api/v2/copy/mix-follower/query-settings',
  COPY_UPDATE_SETTINGS: '/api/v2/copy/mix-follower/update-settings',
  COPY_FOLLOWER_HISTORY: '/api/v2/copy/mix-follower/query-history-orders',
  COPY_CLOSE_POSITION: '/api/v2/copy/mix-follower/close-positions',

  // Market Data
  MARKET_TICKERS: '/api/v2/spot/market/tickers',
  MARKET_TICKER: '/api/v2/spot/market/ticker',
  MARKET_ORDERBOOK: '/api/v2/spot/market/orderbook',
  MARKET_CANDLES: '/api/v2/spot/market/candles',
  MARKET_TRADES: '/api/v2/spot/market/fills',
  MARKET_SYMBOLS: '/api/v2/spot/public/symbols',
  MARKET_SERVER_TIME: '/api/v2/public/time',

  // Futures Market Data
  FUTURES_MARKET_TICKERS: '/api/v2/mix/market/tickers',
  FUTURES_MARKET_TICKER: '/api/v2/mix/market/ticker',
  FUTURES_MARKET_ORDERBOOK: '/api/v2/mix/market/depth',
  FUTURES_MARKET_CANDLES: '/api/v2/mix/market/candles',
  FUTURES_MARKET_TRADES: '/api/v2/mix/market/fills',
  FUTURES_MARKET_SYMBOLS: '/api/v2/mix/market/contracts',

  // Earn
  EARN_PRODUCTS: '/api/v2/earn/savings/product',
  EARN_SUBSCRIBE: '/api/v2/earn/savings/subscribe',
  EARN_REDEEM: '/api/v2/earn/savings/redeem',
  EARN_SUBSCRIPTIONS: '/api/v2/earn/savings/assets',
  EARN_HISTORY: '/api/v2/earn/savings/records',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key. Please check your credentials.',
  INVALID_SIGNATURE: 'Invalid signature. Please check your secret key.',
  INVALID_TIMESTAMP: 'Invalid timestamp. Please check your system time.',
  API_KEY_EXPIRED: 'API key has expired. Please generate a new one.',
  PERMISSION_DENIED: 'Permission denied. Check your API key permissions.',
  RATE_LIMITED: 'Rate limit exceeded. Please wait before retrying.',
  IP_NOT_WHITELISTED: 'IP not whitelisted. Add your IP to the API key settings.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this operation.',
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_ALREADY_CANCELLED: 'Order has already been cancelled.',
  POSITION_NOT_FOUND: 'Position not found.',
  LEVERAGE_EXCEEDS_LIMIT: 'Leverage exceeds the maximum allowed for this pair.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
} as const;

// Error Code Mapping
export const ERROR_CODE_MAP: Record<string, string> = {
  '00000': 'Success',
  '40001': ERROR_MESSAGES.INVALID_API_KEY,
  '40002': ERROR_MESSAGES.INVALID_SIGNATURE,
  '40003': ERROR_MESSAGES.INVALID_TIMESTAMP,
  '40004': ERROR_MESSAGES.API_KEY_EXPIRED,
  '40005': ERROR_MESSAGES.PERMISSION_DENIED,
  '40006': ERROR_MESSAGES.RATE_LIMITED,
  '40007': ERROR_MESSAGES.IP_NOT_WHITELISTED,
  '43001': ERROR_MESSAGES.INSUFFICIENT_BALANCE,
  '43002': ERROR_MESSAGES.ORDER_NOT_FOUND,
  '43003': ERROR_MESSAGES.ORDER_ALREADY_CANCELLED,
  '45001': ERROR_MESSAGES.POSITION_NOT_FOUND,
  '45002': ERROR_MESSAGES.LEVERAGE_EXCEEDS_LIMIT,
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 100,
  MAX_BATCH_ORDERS: 50,
  MIN_LEVERAGE: 1,
  MAX_LEVERAGE: 125,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// Rate Limits (requests per second)
export const RATE_LIMITS = {
  DEFAULT: 10,
  ORDERS: 10,
  MARKET_DATA: 20,
  ACCOUNT: 10,
} as const;

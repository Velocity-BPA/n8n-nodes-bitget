/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// API Response Types
export interface BitgetApiResponse<T = any> {
  code: string;
  msg: string;
  requestTime: number;
  data: T;
}

// Credential Types
export interface BitgetCredentials {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  environment: 'production' | 'demo';
}

// Resource Types
export type BitgetResource =
  | 'spotAccount'
  | 'spotTrading'
  | 'futuresAccount'
  | 'futuresTrading'
  | 'copyTrading'
  | 'marketData'
  | 'earn';

// Spot Account Types
export interface SpotBalance {
  coin: string;
  available: string;
  frozen: string;
  locked: string;
  limitAvailable: string;
  uTime: string;
}

export interface SpotBill {
  cTime: string;
  coin: string;
  groupType: string;
  businessType: string;
  size: string;
  balance: string;
  fees: string;
  billId: string;
}

export interface TransferRecord {
  coin: string;
  status: string;
  toType: string;
  toSymbol: string;
  fromType: string;
  fromSymbol: string;
  size: string;
  ts: string;
  clientOid: string;
  transferId: string;
}

// Spot Trading Types
export interface SpotOrder {
  orderId: string;
  clientOid: string;
  symbol: string;
  orderType: string;
  side: string;
  priceAvg: string;
  size: string;
  amount: string;
  status: string;
  baseVolume: string;
  quoteVolume: string;
  enterPointSource: string;
  feeDetail: SpotFeeDetail;
  cTime: string;
  uTime: string;
}

export interface SpotFeeDetail {
  feeCoin: string;
  totalFee: string;
}

export interface SpotFill {
  userId: string;
  symbol: string;
  orderId: string;
  tradeId: string;
  orderType: string;
  side: string;
  priceAvg: string;
  size: string;
  amount: string;
  feeDetail: SpotFeeDetail;
  tradeScope: string;
  cTime: string;
  uTime: string;
}

// Futures Account Types
export interface FuturesAccount {
  marginCoin: string;
  locked: string;
  available: string;
  crossedMaxAvailable: string;
  isolatedMaxAvailable: string;
  maxTransferOut: string;
  accountEquity: string;
  usdtEquity: string;
  btcEquity: string;
  crossedRiskRate: string;
  crossedMarginLeverage: string;
  isolatedLongLever: string;
  isolatedShortLever: string;
  marginMode: string;
  posMode: string;
  unrealizedPL: string;
  bonus: string;
  crossedUnrealizedPL: string;
  isolatedUnrealizedPL: string;
}

export interface FuturesPosition {
  marginCoin: string;
  symbol: string;
  holdSide: string;
  openDelegateSize: string;
  marginSize: string;
  available: string;
  locked: string;
  total: string;
  leverage: string;
  achievedProfits: string;
  openPriceAvg: string;
  marginMode: string;
  posMode: string;
  unrealizedPL: string;
  liquidationPrice: string;
  keepMarginRate: string;
  markPrice: string;
  breakEvenPrice: string;
  totalFee: string;
  deductedFee: string;
  cTime: string;
  uTime: string;
}

export interface FuturesBill {
  billId: string;
  symbol: string;
  amount: string;
  fee: string;
  feeByCoupon: string;
  businessType: string;
  coin: string;
  cTime: string;
}

// Futures Trading Types
export interface FuturesOrder {
  orderId: string;
  clientOid: string;
  symbol: string;
  size: string;
  executeSize: string;
  marginCoin: string;
  orderType: string;
  side: string;
  posSide: string;
  tradeSide: string;
  force: string;
  price: string;
  executePrice: string;
  triggerPrice: string;
  status: string;
  marginMode: string;
  leverage: string;
  reduceOnly: boolean;
  enterPointSource: string;
  cTime: string;
  uTime: string;
}

export interface FuturesFill {
  tradeId: string;
  symbol: string;
  orderId: string;
  price: string;
  sizeQty: string;
  fee: string;
  side: string;
  fillAmount: string;
  profit: string;
  enterPointSource: string;
  tradeSide: string;
  posMode: string;
  cTime: string;
  uTime: string;
}

export interface PlanOrder {
  orderId: string;
  clientOid: string;
  symbol: string;
  marginCoin: string;
  size: string;
  executeSize: string;
  executePrice: string;
  triggerPrice: string;
  triggerType: string;
  planType: string;
  side: string;
  tradeSide: string;
  orderType: string;
  status: string;
  enterPointSource: string;
  cTime: string;
  uTime: string;
}

// Copy Trading Types
export interface Trader {
visibleId: string;
  visibleNickname: string;
  traderSince: string;
  totalFollowers: number;
  currentFollowers: number;
  maxFollowers: number;
  totalPnl: string;
  totalPnlRate: string;
  winRate: string;
  avgProfitRate: string;
  avgLossRate: string;
  tradeCount: number;
  followerTotalPnl: string;
  copyTradeCount: number;
}

export interface TraderPosition {
  symbol: string;
  holdSide: string;
  openDelegateSize: string;
  marginSize: string;
  available: string;
  locked: string;
  total: string;
  leverage: string;
  achievedProfits: string;
  openPriceAvg: string;
  marginMode: string;
  unrealizedPL: string;
  liquidationPrice: string;
  keepMarginRate: string;
  cTime: string;
}

export interface FollowSettings {
  traderId: string;
  productType: string;
  copyTradeCoin: string;
  fixedAmount: string;
  copyRatio: string;
  maxFollowAmount: string;
  totalLimit: string;
  status: string;
}

export interface FollowerHistory {
  orderId: string;
  symbol: string;
  traderId: string;
  traderNickname: string;
  side: string;
  openPrice: string;
  closePrice: string;
  size: string;
  profit: string;
  openTime: string;
  closeTime: string;
}

// Market Data Types
export interface Ticker {
  symbol: string;
  high24h: string;
  open: string;
  low24h: string;
  lastPr: string;
  quoteVolume: string;
  baseVolume: string;
  usdtVolume: string;
  bidPr: string;
  askPr: string;
  bidSz: string;
  askSz: string;
  openUtc: string;
  ts: string;
  changeUtc24h: string;
  change24h: string;
}

export interface OrderBook {
  asks: [string, string][];
  bids: [string, string][];
  ts: string;
}

export interface Candle {
  ts: string;
  open: string;
  high: string;
  low: string;
  close: string;
  baseVol: string;
  quoteVol: string;
  usdtVol: string;
}

export interface Trade {
  symbol: string;
  tradeId: string;
  side: string;
  fillPrice: string;
  fillQuantity: string;
  fillTime: string;
}

export interface Symbol {
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
  minTradeAmount: string;
  maxTradeAmount: string;
  takerFeeRate: string;
  makerFeeRate: string;
  pricePrecision: string;
  quantityPrecision: string;
  quotePrecision: string;
  status: string;
  minTradeUSDT: string;
  buyLimitPriceRatio: string;
  sellLimitPriceRatio: string;
}

// Earn Types
export interface EarnProduct {
  productId: string;
  coin: string;
  periodType: string;
  duration: string;
  annualRate: string;
  minAmount: string;
  maxAmount: string;
  status: string;
  startTime: string;
  endTime: string;
  totalCapacity: string;
  usedCapacity: string;
}

export interface EarnSubscription {
  subscriptionId: string;
  productId: string;
  coin: string;
  amount: string;
  periodType: string;
  annualRate: string;
  startTime: string;
  endTime: string;
  status: string;
  expectedInterest: string;
  settledInterest: string;
}

export interface EarnHistory {
  orderId: string;
  productId: string;
  coin: string;
  amount: string;
  interestAmount: string;
  periodType: string;
  operationType: string;
  cTime: string;
}

// Enums
export enum ProductType {
  USDT_FUTURES = 'USDT-FUTURES',
  USDC_FUTURES = 'USDC-FUTURES',
  COIN_FUTURES = 'COIN-FUTURES',
}

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell',
}

export enum FuturesSide {
  OPEN_LONG = 'open_long',
  OPEN_SHORT = 'open_short',
  CLOSE_LONG = 'close_long',
  CLOSE_SHORT = 'close_short',
}

export enum OrderType {
  LIMIT = 'limit',
  MARKET = 'market',
}

export enum TimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
  POST_ONLY = 'post_only',
}

export enum MarginMode {
  CROSSED = 'crossed',
  ISOLATED = 'isolated',
}

export enum HoldSide {
  LONG = 'long',
  SHORT = 'short',
}

export enum Granularity {
  '1m' = '1m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '1H' = '1H',
  '4H' = '4H',
  '1D' = '1D',
  '1W' = '1W',
}

export enum PeriodType {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
}

export enum AccountType {
  SPOT = 'spot',
  MIX_USDT = 'mix_usdt',
  MIX_USDC = 'mix_usdc',
  MIX_COIN = 'mix_coin',
}

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  removeEmptyProperties,
  toTimestamp,
  formatTimestamp,
  parseTimestamp,
  generateClientOrderId,
  validateSymbol,
  formatSymbol,
  sleep,
  buildQueryString,
  formatNumber,
  calculatePercentageChange,
  validateLeverage,
} from '../../nodes/Bitget/utils';

describe('Utilities', () => {
  describe('removeEmptyProperties', () => {
    it('should remove undefined values', () => {
      const obj = { a: 1, b: undefined, c: 'hello' };
      const result = removeEmptyProperties(obj);
      expect(result).toEqual({ a: 1, c: 'hello' });
    });

    it('should remove empty strings', () => {
      const obj = { a: 'test', b: '', c: 42 };
      const result = removeEmptyProperties(obj);
      expect(result).toEqual({ a: 'test', c: 42 });
    });

    it('should remove null values', () => {
      const obj = { a: 1, b: null, c: 'hello' };
      const result = removeEmptyProperties(obj);
      expect(result).toEqual({ a: 1, c: 'hello' });
    });

    it('should keep zero values', () => {
      const obj = { a: 0, b: 'test' };
      const result = removeEmptyProperties(obj);
      expect(result).toEqual({ a: 0, b: 'test' });
    });

    it('should keep false values', () => {
      const obj = { a: false, b: true };
      const result = removeEmptyProperties(obj);
      expect(result).toEqual({ a: false, b: true });
    });
  });

  describe('toTimestamp', () => {
    it('should return undefined for undefined input', () => {
      expect(toTimestamp(undefined)).toBeUndefined();
    });

    it('should convert date string to timestamp', () => {
      const result = toTimestamp('2024-01-01T00:00:00Z');
      expect(result).toBe('1704067200000');
    });

    it('should convert number to string', () => {
      const result = toTimestamp(1704067200000);
      expect(result).toBe('1704067200000');
    });

    it('should pass through numeric string', () => {
      const result = toTimestamp('1704067200000');
      expect(result).toBe('1704067200000');
    });
  });

  describe('formatTimestamp', () => {
    it('should convert Date to timestamp string', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const result = formatTimestamp(date);
      expect(result).toBe('1704067200000');
    });

    it('should convert date string to timestamp string', () => {
      const result = formatTimestamp('2024-01-01T00:00:00Z');
      expect(result).toBe('1704067200000');
    });

    it('should convert number to string', () => {
      const result = formatTimestamp(1704067200000);
      expect(result).toBe('1704067200000');
    });
  });

  describe('parseTimestamp', () => {
    it('should parse string timestamp to Date', () => {
      const result = parseTimestamp('1704067200000');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(1704067200000);
    });

    it('should parse number timestamp to Date', () => {
      const result = parseTimestamp(1704067200000);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(1704067200000);
    });
  });

  describe('generateClientOrderId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateClientOrderId();
      const id2 = generateClientOrderId();
      expect(id1).not.toBe(id2);
    });

    it('should use default prefix', () => {
      const id = generateClientOrderId();
      expect(id.startsWith('n8n_')).toBe(true);
    });

    it('should use custom prefix', () => {
      const id = generateClientOrderId('custom');
      expect(id.startsWith('custom_')).toBe(true);
    });

    it('should generate reasonably sized IDs', () => {
      const id = generateClientOrderId();
      expect(id.length).toBeLessThan(50);
      expect(id.length).toBeGreaterThan(10);
    });
  });

  describe('validateSymbol', () => {
    it('should validate uppercase symbols', () => {
      expect(validateSymbol('BTCUSDT')).toBe(true);
      expect(validateSymbol('ETHUSDT')).toBe(true);
    });

    it('should reject lowercase symbols', () => {
      expect(validateSymbol('btcusdt')).toBe(false);
    });

    it('should reject symbols with special characters', () => {
      expect(validateSymbol('BTC-USDT')).toBe(false);
      expect(validateSymbol('BTC/USDT')).toBe(false);
      expect(validateSymbol('BTC_USDT')).toBe(false);
    });

    it('should allow numbers in symbols', () => {
      expect(validateSymbol('1INCHUSDT')).toBe(true);
    });
  });

  describe('formatSymbol', () => {
    it('should uppercase symbol', () => {
      expect(formatSymbol('btcusdt')).toBe('BTCUSDT');
    });

    it('should remove special characters', () => {
      expect(formatSymbol('BTC-USDT')).toBe('BTCUSDT');
      expect(formatSymbol('BTC/USDT')).toBe('BTCUSDT');
      expect(formatSymbol('BTC_USDT')).toBe('BTCUSDT');
    });

    it('should handle already formatted symbols', () => {
      expect(formatSymbol('BTCUSDT')).toBe('BTCUSDT');
    });
  });

  describe('sleep', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some tolerance
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const params = { a: '1', b: '2' };
      const result = buildQueryString(params);
      expect(result).toBe('a=1&b=2');
    });

    it('should remove empty values', () => {
      const params = { a: '1', b: '', c: '3' };
      const result = buildQueryString(params);
      expect(result).toBe('a=1&c=3');
    });

    it('should handle arrays', () => {
      const params = { symbol: ['BTC', 'ETH'] };
      const result = buildQueryString(params);
      expect(result).toBe('symbol=BTC&symbol=ETH');
    });

    it('should handle empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format string number', () => {
      expect(formatNumber('0.00010000')).toBe('0.0001');
    });

    it('should format with specified decimals', () => {
      expect(formatNumber(1.234567, 4)).toBe('1.2346');
    });

    it('should remove trailing zeros', () => {
      expect(formatNumber('100.00000000')).toBe('100');
    });

    it('should handle integer values', () => {
      expect(formatNumber(100, 8)).toBe('100');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive change', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
    });

    it('should calculate negative change', () => {
      expect(calculatePercentageChange(100, 50)).toBe(-50);
    });

    it('should handle zero old value', () => {
      expect(calculatePercentageChange(0, 100)).toBe(0);
    });

    it('should handle no change', () => {
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });
  });

  describe('validateLeverage', () => {
    it('should validate leverage within range', () => {
      expect(validateLeverage(10)).toBe(true);
      expect(validateLeverage(1)).toBe(true);
      expect(validateLeverage(125)).toBe(true);
    });

    it('should reject leverage below minimum', () => {
      expect(validateLeverage(0)).toBe(false);
      expect(validateLeverage(-1)).toBe(false);
    });

    it('should reject leverage above maximum', () => {
      expect(validateLeverage(126)).toBe(false);
      expect(validateLeverage(200)).toBe(false);
    });

    it('should reject non-integer leverage', () => {
      expect(validateLeverage(10.5)).toBe(false);
    });

    it('should respect custom max leverage', () => {
      expect(validateLeverage(50, 50)).toBe(true);
      expect(validateLeverage(51, 50)).toBe(false);
    });
  });
});

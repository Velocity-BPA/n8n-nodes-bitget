/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { generateSignature } from '../../nodes/Bitget/transport';

describe('Transport Layer', () => {
  describe('generateSignature', () => {
    it('should generate correct HMAC-SHA256 signature', () => {
      const timestamp = '1609459200000';
      const method = 'GET';
      const requestPath = '/api/v2/spot/account/assets';
      const body = '';
      const secretKey = 'test-secret-key';

      const signature = generateSignature(timestamp, method, requestPath, body, secretKey);

      // Verify signature is base64 encoded
      expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/);
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should generate different signatures for different methods', () => {
      const timestamp = '1609459200000';
      const requestPath = '/api/v2/spot/account/assets';
      const body = '';
      const secretKey = 'test-secret-key';

      const getSignature = generateSignature(timestamp, 'GET', requestPath, body, secretKey);
      const postSignature = generateSignature(timestamp, 'POST', requestPath, body, secretKey);

      expect(getSignature).not.toBe(postSignature);
    });

    it('should generate different signatures for different bodies', () => {
      const timestamp = '1609459200000';
      const method = 'POST';
      const requestPath = '/api/v2/spot/trade/place-order';
      const secretKey = 'test-secret-key';

      const emptyBody = generateSignature(timestamp, method, requestPath, '', secretKey);
      const withBody = generateSignature(timestamp, method, requestPath, '{"symbol":"BTCUSDT"}', secretKey);

      expect(emptyBody).not.toBe(withBody);
    });

    it('should handle uppercase method conversion', () => {
      const timestamp = '1609459200000';
      const requestPath = '/api/v2/spot/account/assets';
      const body = '';
      const secretKey = 'test-secret-key';

      const lowerSignature = generateSignature(timestamp, 'get', requestPath, body, secretKey);
      const upperSignature = generateSignature(timestamp, 'GET', requestPath, body, secretKey);

      expect(lowerSignature).toBe(upperSignature);
    });

    it('should include query parameters in signature', () => {
      const timestamp = '1609459200000';
      const method = 'GET';
      const secretKey = 'test-secret-key';
      const body = '';

      const withoutQuery = generateSignature(timestamp, method, '/api/v2/spot/account/assets', body, secretKey);
      const withQuery = generateSignature(timestamp, method, '/api/v2/spot/account/assets?coin=BTC', body, secretKey);

      expect(withoutQuery).not.toBe(withQuery);
    });
  });
});

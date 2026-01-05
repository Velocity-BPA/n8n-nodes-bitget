/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Bitget node
 * These tests verify the node structure and configuration
 */

import { Bitget } from '../../nodes/Bitget/Bitget.node';
import { BitgetTrigger } from '../../nodes/Bitget/BitgetTrigger.node';

describe('Bitget Node', () => {
  let bitgetNode: Bitget;

  beforeEach(() => {
    bitgetNode = new Bitget();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(bitgetNode.description.displayName).toBe('Bitget');
    });

    it('should have correct name', () => {
      expect(bitgetNode.description.name).toBe('bitget');
    });

    it('should have icon defined', () => {
      expect(bitgetNode.description.icon).toBe('file:bitget.svg');
    });

    it('should have version 1', () => {
      expect(bitgetNode.description.version).toBe(1);
    });

    it('should require bitgetApi credentials', () => {
      const credentials = bitgetNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials![0].name).toBe('bitgetApi');
      expect(credentials![0].required).toBe(true);
    });
  });

  describe('Resources', () => {
    it('should have all 7 resources', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty!.options).toHaveLength(7);
    });

    it('should include spotAccount resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const spotAccount = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'spotAccount'
      );
      expect(spotAccount).toBeDefined();
    });

    it('should include spotTrading resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const spotTrading = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'spotTrading'
      );
      expect(spotTrading).toBeDefined();
    });

    it('should include futuresAccount resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const futuresAccount = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'futuresAccount'
      );
      expect(futuresAccount).toBeDefined();
    });

    it('should include futuresTrading resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const futuresTrading = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'futuresTrading'
      );
      expect(futuresTrading).toBeDefined();
    });

    it('should include copyTrading resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const copyTrading = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'copyTrading'
      );
      expect(copyTrading).toBeDefined();
    });

    it('should include marketData resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const marketData = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'marketData'
      );
      expect(marketData).toBeDefined();
    });

    it('should include earn resource', () => {
      const resourceProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const earn = (resourceProperty!.options as any[]).find(
        (o) => o.value === 'earn'
      );
      expect(earn).toBeDefined();
    });
  });

  describe('Operations', () => {
    it('should have spotTrading operations', () => {
      const operationProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'operation' && 
              p.displayOptions?.show?.resource?.includes('spotTrading')
      );
      expect(operationProperty).toBeDefined();
      expect((operationProperty!.options as any[]).length).toBeGreaterThan(0);
    });

    it('should have futuresTrading operations', () => {
      const operationProperty = bitgetNode.description.properties.find(
        (p) => p.name === 'operation' && 
              p.displayOptions?.show?.resource?.includes('futuresTrading')
      );
      expect(operationProperty).toBeDefined();
      expect((operationProperty!.options as any[]).length).toBeGreaterThan(0);
    });
  });
});

describe('BitgetTrigger Node', () => {
  let triggerNode: BitgetTrigger;

  beforeEach(() => {
    triggerNode = new BitgetTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('Bitget Trigger');
    });

    it('should have correct name', () => {
      expect(triggerNode.description.name).toBe('bitgetTrigger');
    });

    it('should be a polling trigger', () => {
      expect(triggerNode.description.polling).toBe(true);
    });

    it('should have trigger group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have no inputs', () => {
      expect(triggerNode.description.inputs).toHaveLength(0);
    });
  });

  describe('Events', () => {
    it('should have event property', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      expect(eventProperty).toBeDefined();
    });

    it('should have priceAlert event', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const priceAlert = (eventProperty!.options as any[]).find(
        (o) => o.value === 'priceAlert'
      );
      expect(priceAlert).toBeDefined();
    });

    it('should have orderFilled event', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const orderFilled = (eventProperty!.options as any[]).find(
        (o) => o.value === 'orderFilled'
      );
      expect(orderFilled).toBeDefined();
    });

    it('should have positionChange event', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const positionChange = (eventProperty!.options as any[]).find(
        (o) => o.value === 'positionChange'
      );
      expect(positionChange).toBeDefined();
    });

    it('should have balanceChange event', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const balanceChange = (eventProperty!.options as any[]).find(
        (o) => o.value === 'balanceChange'
      );
      expect(balanceChange).toBeDefined();
    });

    it('should have newTrade event', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const newTrade = (eventProperty!.options as any[]).find(
        (o) => o.value === 'newTrade'
      );
      expect(newTrade).toBeDefined();
    });
  });
});

describe('Constants', () => {
  it('should export API base URL', () => {
    const { BITGET_API_BASE_URL } = require('../../nodes/Bitget/constants');
    expect(BITGET_API_BASE_URL).toBe('https://api.bitget.com');
  });

  it('should export endpoints', () => {
    const { ENDPOINTS } = require('../../nodes/Bitget/constants');
    expect(ENDPOINTS).toBeDefined();
    expect(ENDPOINTS.SPOT_TRADE_PLACE_ORDER).toBeDefined();
    expect(ENDPOINTS.FUTURES_PLACE_ORDER).toBeDefined();
  });

  it('should export error codes', () => {
    const { ERROR_CODE_MAP } = require('../../nodes/Bitget/constants');
    expect(ERROR_CODE_MAP).toBeDefined();
    expect(ERROR_CODE_MAP['00000']).toBe('Success');
  });

  it('should export defaults', () => {
    const { DEFAULTS } = require('../../nodes/Bitget/constants');
    expect(DEFAULTS).toBeDefined();
    expect(DEFAULTS.MAX_BATCH_ORDERS).toBe(50);
    expect(DEFAULTS.MAX_LEVERAGE).toBe(125);
  });
});

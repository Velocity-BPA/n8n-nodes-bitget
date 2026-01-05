/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Jest test setup

// Increase timeout for async operations
jest.setTimeout(30000);

// Mock console methods if needed
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  // Suppress specific warnings if needed
  if (args[0]?.includes?.('[Velocity BPA Licensing Notice]')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Global test utilities
global.testUtils = {
  mockCredentials: {
    apiKey: 'test-api-key',
    secretKey: 'test-secret-key',
    passphrase: 'test-passphrase',
    environment: 'demo',
  },
};

// Extend Jest matchers if needed
declare global {
  var testUtils: {
    mockCredentials: {
      apiKey: string;
      secretKey: string;
      passphrase: string;
      environment: string;
    };
  };
}

export {};

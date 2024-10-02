// jest.setup.js

// Mock chrome APIs
global.chrome = {
    identity: {
      getAuthToken: jest.fn(),
      removeCachedAuthToken: jest.fn(),
    },
    runtime: {
      lastError: null,
    },
  };
  
  // Mock fetch API
  global.fetch = jest.fn();
  
  // Polyfill TextEncoder and TextDecoder
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  
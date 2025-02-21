// Increase timeout for all tests
jest.setTimeout(10000);

// Global console mock to reduce noise during tests
global.console = {
  ...console,
  // Uncomment to disable specific console methods during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Clean up after all tests
afterAll(() => {
  jest.clearAllMocks();
});

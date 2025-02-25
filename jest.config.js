module.exports = {
  // Preset for using TypeScript
  preset: 'ts-jest',
  
  // Run tests in a Node environment
  testEnvironment: 'node',
  
  // Test file configuration
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/examples/**/*.test.ts'
  ],
  
  // Test setup file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Code coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Timeout setting (extended for Solana transactions)
  testTimeout: 30000,
  
  // Transform settings
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // Mocking specific modules
  moduleNameMapper: {
    '@solana/web3.js': '<rootDir>/node_modules/@solana/web3.js',
    '@metaplex-foundation/js': '<rootDir>/node_modules/@metaplex-foundation/js'
  }
};

/** @type {import('jest').Config} */
module.exports = {
  // Basic configuration for TypeScript support
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Extended timeout setting for Solana transactions
  testTimeout: 45000,

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/src/**/*.test.ts',
    '**/examples/**/*.test.ts'
  ],

  // Module path mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@examples/(.*)$': '<rootDir>/docs/examples/$1',
    '^@config/(.*)$': '<rootDir>/config/$1'
  },

  // Excluded test paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Code coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/fixtures/'
  ],

  // Global settings
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },

  // Transformation settings
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },

  // Supported module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Test environment setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Mocking configuration for Solana and Metaplex modules
  moduleNameMapper: {
    '@solana/web3.js': '<rootDir>/node_modules/@solana/web3.js',
    '@metaplex-foundation/js': '<rootDir>/node_modules/@metaplex-foundation/js'
  }
};

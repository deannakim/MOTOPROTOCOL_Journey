# Basic Examples for MOTO PROTOCOL

This directory contains basic examples for interacting with MOTO PROTOCOL tokens on Solana.

## Examples Overview

### 1. Token Balance Checker (check-balance.ts)
The `check-balance.ts` example demonstrates how to connect to Solana devnet, query MPT token balances, and handle various edge cases and errors.

Key Learning Points:
- Solana Web3.js connection handling
- SPL Token account structure
- Error handling best practices

Real-world Applications:
- Wallet integration
- Balance monitoring systems
- Transaction verification

### 2. Token Transfer Example (transfer-tokens.ts)
The `transfer-tokens.ts` example shows how to create token transfer instructions, build and send transactions, and confirm transaction success.

Key Learning Points:
- Transaction building process
- Account permission handling
- Transaction confirmation flow

Real-world Applications:
- Payment systems
- Token distribution
- Automated transfers

### 3. Token Information (token-info.ts)
The `token-info.ts` example covers fetching token metadata, reading supply information, and checking token authorities.

Key Learning Points:
- Token mint structure
- Metadata handling
- Authority verification

Real-world Applications:
- Token dashboards
- Supply monitoring
- Admin interfaces

## Getting Started
1. Install dependencies: `npm install @solana/web3.js @solana/spl-token`
2. Configure Solana CLI: `solana config set --url devnet`
3. Run examples: `ts-node check-balance.ts`

## Testing
Run tests using: `npm test`

## Next Steps
- Check advanced examples in `../advanced/`
- Review tutorials in `../tutorials/`
- Explore integration guides in `../../technical/`

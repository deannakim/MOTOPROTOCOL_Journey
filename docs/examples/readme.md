# Basic Examples for MOTO PROTOCOL

This directory contains basic examples for interacting with MOTO PROTOCOL (MTP) tokens on Solana.

## Project Overview

MOTO PROTOCOL is an SPL token project designed to demonstrate token creation, metadata management, and DEX listing processes on Solana. These examples serve as both educational resources and DevRel portfolio materials.

## Examples Overview

### 1. Token Information (token-info.ts)
The `token-info.ts` example demonstrates how to fetch comprehensive token data directly from the blockchain, including metadata, supply, and authority information.

**Key Features:**
- On-chain metadata retrieval using Metaplex standards
- Supply and decimal formatting
- Authority status verification
- Color-coded console output for better readability

**Real-world Applications:**
- Token dashboards
- Supply monitoring
- Verification tools for DEX listings

### 2. Token Transfer Example (transfer-tokens.ts)
The `transfer-tokens.ts` example shows how to securely transfer SPL tokens between wallets with proper validation and error handling.

**Key Features:**
- Interactive and command-line modes
- Pre-transfer balance verification
- SOL balance check for transaction fees
- Confirmation prompts for security
- Detailed transaction feedback

**Real-world Applications:**
- Payment systems
- Token distribution platforms
- Wallet integrations

### 3. Token Balance Checker (check-balance.ts)
The `check-balance.ts` example covers querying token balances across multiple accounts with robust error handling.

**Key Features:**
- Multi-account balance checking
- Proper decimal handling
- Comprehensive error messages
- Network flexibility (Devnet/Mainnet)

**Real-world Applications:**
- Portfolio trackers
- Balance monitoring systems
- Transaction verification

## Getting Started

1. **Prerequisites:**
   - Node.js v16+ installed
   - Solana CLI configured (`solana config set --url https://api.devnet.solana.com`)
   - Wallet with SOL for transaction fees

2. **Installation:**
   ```bash
   npm install @solana/web3.js @solana/spl-token @metaplex-foundation/mpl-token-metadata dotenv chalk prompt-sync
   ```

3. **Running Examples:**
   ```bash
   # Check token information
   ts-node token-info.ts GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRKPeQsNx6h
   
   # Transfer tokens
   ts-node transfer-tokens.ts 10 RECIPIENT_ADDRESS
   
   # Check balance
   ts-node check-balance.ts WALLET_ADDRESS
   ```

## Development Journey

These examples were developed as part of a broader learning journey documented in the `/docs/journey/` directory. Key insights include:

- **Environment Setup Challenges:** Overcoming Solana toolchain configuration issues (see `../../docs/journey/environment-setup.md`)
- **Debugging Process:** Real-world troubleshooting of RPC connection and transaction errors (see `../../docs/journey/debugging-notes.md`)
- **Non-Developer Perspective:** Approaching blockchain development from a DevRel viewpoint (see `../../docs/journey/lessons-learned.md`)

## Troubleshooting

Common issues and solutions:

- **RPC Connection Errors:** Try switching between different RPC endpoints using the `.env` file
- **Insufficient SOL:** Get free SOL from https://solfaucet.com for Devnet testing
- **Token Account Not Found:** The recipient may not have an associated token account yet; our examples handle this automatically

For more detailed troubleshooting, see `../../docs/guides/troubleshooting.md`.

## Related Resources

- **Technical Documentation:** Find architecture details in `../../technical/architecture.md`
- **API References:** Explore API documentation in `../../technical/api-reference.md`
- **Development Logs:** Review the process log at `../../technical/process-log.md`

## Advanced Usage

These basic examples are complemented by more advanced implementations:

- **Batch Processing:** See `../advanced/batch-process.ts` for handling multiple transactions

## Project Structure

The MOTO PROTOCOL project is organized as follows:

```
├── examples/
│   ├── advanced/                  # Advanced implementation examples
│   │   └── batch-process.ts       # Batch processing example
│   └── basic/                     # Basic examples (current directory)
│       ├── check-balance.ts       # Token balance checker
│       ├── token-info.ts          # Token information retriever
│       └── transfer-tokens.ts     # Token transfer utility
│
├── docs/
│   ├── journey/                   # DevRel experience highlights
│   ├── guides/                    # User-friendly guides
│   └── resources/                 # Reference materials
│
└── technical/                     # Technical documentation
```

For a complete overview of the project, refer to the main [README.md](../../README.md) file.

# MOTO PROTOCOL Architecture
*Last Updated: March 4, 2025*

## Core Components

### 1. Token Layer
Manages fundamental token operations.

**Key Components**:
- Token creation (`mint-test-tokens.ts`)
- Supply management
- Transfer operations
- Stores name, symbol, URI on-chain

### 2. Metadata Layer
Handles token metadata management.

**Key Components**:
- Metadata creation and updates
- URI management
- Metaplex integration

### 3. Interaction Layer
Provides user interfaces for token operations.

**Key Components**:
- Balance checking (`check-balance.ts`, 2.2)
- Token info (`token-info.ts`, 2.3)
- Batch processing (`transfer-tokens.ts`, 2.7)

**Implementation**:
- TypeScript scripts executed via `npm run`
- Includes error handling with `chalk` (2.4)

## Technical Stack

### Core Technologies
- **Blockchain**: Solana
- **Token Standard**: SPL Token
- **Metadata Standard**: Metaplex Token Metadata
- **Language**: TypeScript
- **Runtime**: Node.js 16.20.0 (1.1)

### Dependencies
```json
{
  "dependencies": {
    "@metaplex-foundation/js": "^0.20.1",
    "@solana/spl-token": "^0.4.12",
    "@solana/web3.js": "^1.98.0",
    "chalk": "^4.1.2",
    "dotenv": "^16.0.0"
  }
}
```

- `@metaplex-foundation/js`: Metadata and token operations (2.10)
- `@solana/spl-token`: SPL token management
- `@solana/web3.js`: Solana blockchain interaction
- `chalk`: CLI output styling (2.4)
- `dotenv`: Environment config (3.3)

### Development Environment
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*", "docs/**/*"],
  "exclude": ["node_modules"]
}
```

## Token Metadata Structure
Minimal structure from `mint-test-tokens.ts` (3.1):
```json
{
  "name": "MOTO Journey Test Token",
  "symbol": "MJTEST",
  "uri": "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json"
}
```

## Data Flow

### Token Creation and Metadata Update

};

async function mintWithMetadata() {
  try {
    console.log(chalk.cyan("Creating token with metadata..."));
    const connection = new Connection(CONFIG.RPC_URL, "confirmed");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(CONFIG.WALLET_FILE, "utf8"))));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    // 1. Create Mint
    const { mint } = await metaplex.tokens().createMint({
      decimals: 9,
      mintAuthority: wallet.publicKey
    });

    // 2. Mint Initial Supply
    await metaplex.tokens().mint({
      mintAddress: mint.address,
      amount: { basisPoints: BigInt(1000000 * 10 ** 9), currency: { decimals: 9, symbol: TOKEN_METADATA.symbol, namespace: "spl-token" } },
      toOwner: wallet.publicKey
    });

    // 3. Create Metadata
    const { nft } = await metaplex.nfts().create({
      uri: TOKEN_METADATA.uri,
      name: TOKEN_METADATA.name,
      symbol: TOKEN_METADATA.symbol,
      sellerFeeBasisPoints: 0,
      mint: mint.address,
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet.publicKey
    });

    console.log(chalk.green("✓ Token and metadata created!"));
    console.log(`Mint Address: ${chalk.yellow(mint.address.toBase58())}`);
    console.log(`Metadata: ${JSON.stringify(nft.metadata, null, 2)}`);
  } catch (error) {
    console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
  }
}

mintWithMetadata();

Update config/config.ts:
typescript

import * as dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  RPC_URL: process.env.RPC_URL || "https://rpc.ankr.com/solana_devnet",
  WALLET_FILE: process.env.WALLET_FILE || "./docs/examples/basic/my_wallet.json",
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || ""
};

6. Build and Run
bash

ts-node src/mint-with-metadata.ts

Note: Output includes the mint address—update config.ts manually or automate it (see debugging-notes.md).
7. Verify Metadata
Run: npm run example:info to check on-chain metadata.
Troubleshooting Guide
Common Issues
Node Version Conflicts:
Fix: nvm use 16.20.0

Network Errors (fetch failed):
Fix: Use https://rpc.ankr.com/solana_devnet in .env.

Metadata Errors (NotEnoughBytesError):
Fix: Ensure token is minted with metadata above.

Build Failures:
Fix: Validate tsconfig.json paths and file locations.

Best Practices
Version Management:
Use Node.js 16.20.0, PNPM 7.x.

Error Handling:
Add try-catch and clear logs (e.g., chalk).

Automation:
Script config.ts updates post-minting.

Security:
Store keys in .env, test on Devnet first.

Resources
Solana SPL Token Docs

Metaplex JS SDK

Solana Web3.js

Next Steps
Host metadata JSON online.

Update metadata dynamically.

Test on Mainnet.

Note: See ../journey/debugging-notes.md for detailed fixes and my journey optimizing this process.



  name: "MOTO Journey Test Token",
  symbol: "MJTEST",
  uri: "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json",
};

async function createTokenWithMetadata() {
  try {
    console.log(chalk.cyan("Creating SPL token..."));
    const connection = new Connection(CONFIG.RPC_URL, "confirmed");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(CONFIG.WALLET_FILE, "utf8"))));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    const { mint } = await metaplex.tokens().createMint({
      decimals: CONFIG.TOKEN_DECIMALS,
      mintAuthority: wallet.publicKey,
    });

    await metaplex.tokens().mint({
      mintAddress: mint.address,
      amount: { basisPoints: BigInt(CONFIG.MINT_AMOUNT * 10 ** CONFIG.TOKEN_DECIMALS), currency: { decimals: CONFIG.TOKEN_DECIMALS, symbol: TOKEN_METADATA.symbol, namespace: "spl-token" } },
      toOwner: wallet.publicKey,
    });

    await metaplex.nfts().create({
      uri: TOKEN_METADATA.uri,
      name: TOKEN_METADATA.name,
      symbol: TOKEN_METADATA.symbol,
      sellerFeeBasisPoints: 0,
      mint: mint.address,
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    });

    console.log(chalk.green("✓ Token created!"));
    console.log(`Mint Address: ${chalk.yellow(mint.address.toBase58())}`);
  } catch (error) {
    console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
  }
}

createTokenWithMetadata();

Run:
bash

ts-node src/mint-test-tokens.ts

3. Verify Token
bash

npm run example:info  # Check metadata
npm run example:balance  # Verify balance

Troubleshooting
Common Issues
Node Version Conflicts:
Fix: nvm use 16.20.0

Build Errors:
Fix: Check tsconfig.json paths, reinstall dependencies (pnpm install).

Solana Issues:
Network Errors (fetch failed): Switch to https://rpc.ankr.com/solana_devnet.

Insufficient Balance: Airdrop SOL.

Metadata Errors (NotEnoughBytesError): Ensure token includes metadata.

Best Practices
Environment Management:
Use Node 16.20.0, PNPM 7.x.

Centralize configs in config.ts.

Security:
Backup my_wallet.json, test on Devnet.

Development Flow:
Automate TOKEN_ADDRESS updates (see debugging-notes.md).

Document mint addresses in README.

Next Steps
Add metadata (covered above).

Configure advanced properties (e.g., freeze authority).

Deploy to Mainnet.

Integrate with liquidity pools.

Resources
Solana CLI Tools

SPL Token Program

Metaplex Documentation

Note: Refer to ../journey/debugging-notes.md for detailed fixes—e.g., cutting batch times from 644s to 25s!


아니 영어로 써 ..(
  name: "MOTO Journey Test Token",
  symbol: "MJTEST",
  uri: "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json",
};

async function createTokenWithMetadata() {
  try {
    console.log(chalk.cyan("Creating SPL token..."));
    const connection = new Connection(CONFIG.RPC_URL, "confirmed");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(CONFIG.WALLET_FILE, "utf8"))));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    const { mint } = await metaplex.tokens().createMint({
      decimals: CONFIG.TOKEN_DECIMALS,
      mintAuthority: wallet.publicKey,
    });

    await metaplex.tokens().mint({
      mintAddress: mint.address,
      amount: { basisPoints: BigInt(CONFIG.MINT_AMOUNT * 10 ** CONFIG.TOKEN_DECIMALS), currency: { decimals: CONFIG.TOKEN_DECIMALS, symbol: TOKEN_METADATA.symbol, namespace: "spl-token" } },
      toOwner: wallet.publicKey,
    });

    await metaplex.nfts().create({
      uri: TOKEN_METADATA.uri,
      name: TOKEN_METADATA.name,
      symbol: TOKEN_METADATA.symbol,
      sellerFeeBasisPoints: 0,
      mint: mint.address,
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    });

    console.log(chalk.green("✓ Token created!"));
    console.log(`Mint Address: ${chalk.yellow(mint.address.toBase58())}`);
  } catch (error) {
    console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
  }
}

createTokenWithMetadata();

Run:
bash

ts-node src/mint-test-tokens.ts

3. Verify Token
bash

npm run example:info  # Check metadata
npm run example:balance  # Verify balance

Troubleshooting
Common Issues
Node Version Conflicts:
Fix: nvm use 16.20.0

Build Errors:
Fix: Check tsconfig.json paths, reinstall dependencies (pnpm install).

Solana Issues:
Network Errors (fetch failed): Switch to https://rpc.ankr.com/solana_devnet.

Insufficient Balance: Airdrop SOL.

Metadata Errors (NotEnoughBytesError): Ensure token includes metadata.

Best Practices
Environment Management:
Use Node 16.20.0, PNPM 7.x.

Centralize configs in config.ts.

Security:
Backup my_wallet.json, test on Devnet.

Development Flow:
Automate TOKEN_ADDRESS updates (see debugging-notes.md).

Document mint addresses in README.

Next Steps
Add metadata (covered above).

Configure advanced properties (e.g., freeze authority).

Deploy to Mainnet.

Integrate with liquidity pools.

Resources
Solana CLI Tools

SPL Token Program

Metaplex Documentation

Note: Refer to ../journey/debugging-notes.md for detailed fixes—e.g., cutting batch times from 644s to 25s!

) md파일로 만들어

api-reference.md
markdown

# MOTO PROTOCOL API Reference
*Last Updated: March 4, 2025*

This reference details the MOTO PROTOCOL SDK functions for Solana blockchain interaction, refined through my debugging journey (see `../journey/debugging-notes.md`). It’s a practical guide for developers and a showcase of DevRel/Technical Writing skills.

---

## Table of Contents
1. [Token Management](#token-management)
   - [mintTestTokens](#minttesttokens)
   - [transferTokens](#transfertokens)
2. [Metadata Management](#metadata-management)
   - [fetchMetadata](#fetchmetadata)
3. [Account Management](#account-management)
   - [checkBalance](#checkbalance)

---

## Token Management
### mintTestTokens
Creates a test SPL token with metadata on Solana Devnet.

**Execution**:
```bash
npm run mint:test-tokens

Implementation: src/mint-test-tokens.ts
Uses config.ts for wallet (docs/examples/basic/my_wallet.json) and RPC settings.

Creates a mint, issues initial supply, and adds metadata via Metaplex.

Returns: Logs token details:
mintAddress: Mint public key.

Metadata: Name, symbol, URI.

Example:
javascript

// Run via script
console.log("Run `npm run mint:test-tokens` to create a token.");
// Output: Mint Address: <MINT_ADDRESS>

transferTokens
Transfers tokens between accounts non-interactively.
Execution:
bash

npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>

Implementation: src/transfer-tokens.ts
Takes command-line args for token address, amount, and recipient.

Uses wallet from config.ts.

Returns: Transaction signature.
Example:
javascript

// Run via script
console.log("Run `npm run example:transfer -- <TOKEN> 10 <RECIPIENT>`");
// Output: Transfer complete: <SIGNATURE>

Metadata Management
fetchMetadata
Retrieves token metadata with fallback handling.
Execution:
bash

npm run example:info

Implementation: src/token-info.ts
Fetches metadata using Metaplex’s fetchMetadata.

Falls back to defaults (e.g., name: "Unknown") if unavailable.

Returns: Logs metadata (name, symbol, URI).
Example:
javascript

// Run via script
console.log("Run `npm run example:info` to check metadata.");
// Output: Name: MOTO Journey Test Token, Symbol: MJTEST

Account Management
checkBalance
Displays wallet balance for SOL and tokens.
Execution:
bash

npm run example:balance

Implementation: src/check-balance.ts
Uses config.ts wallet to query balances via @solana/web3.js.

Returns: Logs balance (e.g., "1 SOL, 0 MTP").
Example:
javascript

// Run via script
console.log("Run `npm run example:balance` to check balance.");
// Output: Wallet balance: 1 SOL, MTP: 0

Error Handling
Functions include robust error handling from debugging insights:
fetch failed: Network issues (2.9). Switch RPC to https://rpc.ankr.com/solana_devnet.

NotEnoughBytesError: Missing metadata (2.3). Ensure token is minted with metadata.

TS2345: API mismatches (2.10). Use keypairIdentity with Metaplex.

Insufficient Funds: Check balance before transfers (2.6).

Example:
javascript

try {
  // Run any script
  console.log("Running `npm run example:transfer`...");
} catch (error) {
  if (error.message.includes("fetch failed")) {
    console.error("Network error: Switch RPC in config.ts");
  } else if (error.message.includes("NotEnoughBytesError")) {
    console.error("Metadata missing: Mint with metadata");
  } else {
    console.error(`Error: ${error.message}`);
  }
}

Conclusion
This API reflects the MOTO PROTOCOL’s streamlined token operations, optimized through debugging (e.g., batch runtime cut from 644s to 25s, 2.7). Check the examples/ directory for full scripts and ../journey/debugging-notes.md for the journey behind these functions.
Note: Suggest enhancements via the MOTO PROTOCOL team!

 md파일로 만들어줘

이것도 하나의 md 파일로 만들어줘. architecture.md
markdown

# MOTO PROTOCOL Architecture
*Last Updated: March 4, 2025*

## Overview
MOTO PROTOCOL is an SPL token project on Solana, demonstrating token creation and metadata management. This document outlines its technical architecture, refined through debugging (see `../journey/debugging-notes.md`).

---

## System Architecture
The architecture uses a layered approach:

┌───────────────────────────────┐
│     Client Applications       │
└───────────────┬───────────────┘
                │
┌───────────────┼───────────────┐
│      MOTO PROTOCOL            │
│ ┌───────────┐ ┌─────────────┐ ┌────────────┐
│ │Token Layer│ │Interaction  │ │Metadata    │
│ │           │◄┤Layer        ├►│Layer       │
│ └───────────┘ └─────────────┘ └────────────┘
└───────────────┬───────────────┘
                │


┌───────────────────────────────┐
│ Client Applications │
└───────────────┬───────────────┘
│
┌───────────────┼───────────────┐
│ MOTO PROTOCOL │
│ ┌───────────┐ ┌─────────────┐ │
│ │Token Layer│ │Interaction │ │
│ │ ◄┼─┤Layer │ │
│ └───────────┘ └──────┬──────┘ │
│ ┌───────────┐ │ │
│ │Metadata │ │ │
│ │Layer ◄┼────────┘ │
│ └───────────┘ │
└───────────────┬───────────────┘
│
┌───────────────┼───────────────┐
│ Solana Blockchain │
└───────────────────────────────┘

- Stores name, symbol, URI on-chain.

### 3. Interaction Layer
Provides user interfaces for token operations.

**Key Components**:
- Balance checking (`check-balance.ts`, 2.2).
- Token info (`token-info.ts`, 2.3).
- Batch processing (`transfer-tokens.ts`, 2.7).

**Implementation**:
- TypeScript scripts executed via `npm run`.
- Includes error handling with `chalk` (2.4).

---

## Technical Stack
### Core Technologies
- **Blockchain**: Solana
- **Token Standard**: SPL Token
- **Metadata Standard**: Metaplex Token Metadata
- **Language**: TypeScript
- **Runtime**: Node.js 16.20.0 (1.1)

### Dependencies
```json
{
  "dependencies": {
    "@metaplex-foundation/js": "^0.20.1",
    "@solana/spl-token": "^0.4.12",
    "@solana/web3.js": "^1.98.0",
    "chalk": "^4.1.2",
    "dotenv": "^16.0.0"
  }
}

@metaplex-foundation/js: Metadata and token operations (2.10).

@solana/spl-token: SPL token management.

@solana/web3.js: Solana blockchain interaction.

chalk: CLI output styling (2.4).

dotenv: Environment config (3.3).

Development Environment
json

{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*", "docs/**/*"],
  "exclude": ["node_modules"]
}

Token Metadata Structure
Minimal structure from mint-test-tokens.ts (3.1):
json

{
  "name": "MOTO Journey Test Token",
  "symbol": "MJTEST",
  "uri": "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json"
}

Follows Metaplex standards, extendable with additional fields.
Data Flow
Token Creation and Metadata Update

┌──────────┐  ┌──────────────┐  ┌─────────────────┐
│ Create   │  │ Generate    │  │ Update Metadata │
│ Token    ├──►│ ATA         ├──►│ with Metaplex   │
└──────────┘  └──────────────┘  └─────────────────┘

Create SPL token (createMint, 3.1).

Implicitly handle ATAs (mint, 3.1).

Add metadata (nfts().create, 3.1).

Token Transfer Process

┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐
│ Check    │  │ Validate     │  │ Execute      │  │ Confirm  │
│ Balance  ├──►│ Parameters   ├──►│ Transfer     ├──►│ Result   │
└──────────┘  └──────────────┘  └──────────────┘  └──────────┘

Verify balance (check-balance.ts, 2.2).

Use command-line args (transfer-tokens.ts, 2.7).

Execute and log transfer (2.4).

Security Considerations
Error Handling: Detailed logs with chalk (2.4), retries for network issues (3.2).

Key Management: Wallet at docs/examples/basic/my_wallet.json (2.5), .env usage (3.3).

Validation: Pre-transfer checks (2.6).

Scalability and Future Enhancements
Automation: config.ts updates (2.8, 3.3).

Batch Efficiency: 644s to 25s (2.7).

Extendable for future features per Next Steps (5. Next Steps).

Implementation Examples
Token Creation
bash

npm run mint:test-tokens

See src/mint-test-tokens.ts (3.1).
Token Transfer
bash

npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT>

See src/transfer-tokens.ts (2.7).
Conclusion
MOTO PROTOCOL leverages Solana’s SPL and Metaplex standards for an efficient token system, optimized through debugging (e.g., 96% faster batch processing, 2.7). Its modular design supports future growth, ensuring compatibility with Solana’s ecosystem.


┌──────────┐ ┌──────────────┐ ┌─────────────────┐
│ Create │ │ Generate │ │ Update Metadata │
│ Token ├──►│ ATA ├──►│ with Metaplex │
└──────────┘ └──────────────┘ └─────────────────┘

1. Create SPL token (createMint, 3.1)
2. Implicitly handle ATAs (mint, 3.1)
3. Add metadata (nfts().create, 3.1)

### Token Transfer Process
┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐
│ Check │ │ Validate │ │ Execute │ │ Confirm │
│ Balance ├──►│ Parameters ├──►│ Transfer ├──►│ Result │
└──────────┘ └──────────────┘ └──────────────┘ └──────────┘

1. Verify balance (check-balance.ts, 2.2)
2. Use command-line args (transfer-tokens.ts, 2.7)
3. Execute and log transfer (2.4)

## Security Considerations
- **Error Handling**: Detailed logs with chalk (2.4), retries for network issues (3.2)
- **Key Management**: Wallet at docs/examples/basic/my_wallet.json (2.5), .env usage (3.3)
- **Validation**: Pre-transfer checks (2.6)

## Scalability and Future Enhancements
- **Automation**: config.ts updates (2.8, 3.3)
- **Batch Efficiency**: 644s to 25s (2.7)
- **Extendable** for future features per Next Steps

## Implementation Examples

### Token Creation
```bash
npm run mint:test-tokens
```
See `src/mint-test-tokens.ts` (3.1)

### Token Transfer
```bash
npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT>
```
See `src/transfer-tokens.ts` (2.7)

## Conclusion
MOTO PROTOCOL leverages Solana's SPL and Metaplex standards for an efficient token system, optimized through debugging (e.g., 96% faster batch processing, 2.7). Its modular design supports future growth, ensuring compatibility with Solana's ecosystem.

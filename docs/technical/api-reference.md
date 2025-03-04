# MOTO PROTOCOL API Reference
*Last Updated: March 4, 2025*

This reference details the MOTO PROTOCOL SDK functions for interacting with the Solana blockchain. It has been refined through an extensive debugging journey (see `../journey/debugging-notes.md`) and serves as a practical guide for developers.

## Table of Contents
1. [Token Management](#token-management)
   - [mintTestTokens](#minttesttokens)
   - [transferTokens](#transfertokens)
2. [Metadata Management](#metadata-management)
   - [fetchMetadata](#fetchmetadata)
3. [Account Management](#account-management)
   - [checkBalance](#checkbalance)
4. [Error Handling](#error-handling)

## Token Management

### mintTestTokens
**Description:**  
Creates a test SPL token on Solana Devnet with metadata attached via the Metaplex API.

**Execution:**
```bash
npm run mint:test-tokens
```

**Implementation:**
- Located in `src/mint-test-tokens.ts`
- Uses wallet file from config.ts
- Creates mint, issues initial supply, and attaches metadata

**Example:**
```javascript
// Run via script
console.log("Run `npm run mint:test-tokens` to create a token.");
// Expected Output: Mint Address: <MINT_ADDRESS>
```

### transferTokens
**Description:**  
Transfers tokens between accounts in a non-interactive manner.

**Execution:**
```bash
npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>
```

**Implementation:**
- Found in `src/transfer-tokens.ts`
- Uses wallet from config.ts
- Takes command-line arguments

## Metadata Management

### fetchMetadata
**Description:**  
Retrieves token metadata with fallback handling.

**Execution:**
```bash
npm run example:info
```

**Implementation:**
- Located in `src/token-info.ts`
- Fetches metadata with fallback values
- Logs name, symbol, and URI

## Account Management

### checkBalance
**Description:**  
Displays wallet balance for SOL and tokens.

**Execution:**
```bash
npm run example:balance
```

**Implementation:**
- Found in `src/check-balance.ts`
- Uses config.ts wallet details
- Queries balances via @solana/web3.js

## Error Handling
Each function includes robust error handling:

### Network Errors
```javascript
try {
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
```

Common error types:
- Network Errors: Switch RPC URL to https://rpc.ankr.com/solana_devnet
- Metadata Issues: NotEnoughBytesError indicates missing metadata
- API Mismatches: TS2345 requires keypairIdentity with Metaplex
- Insufficient Funds: Balance checks before transfers

## Conclusion
MOTO PROTOCOL leverages Solana's SPL Token and Metaplex Token Metadata standards for a secure and efficient token ecosystem. Future enhancements will include a dedicated guide once metadata integration is fully stabilized.

# MOTO PROTOCOL API Reference
*Last Updated: March 4, 2025*

This reference details the MOTO PROTOCOL SDK functions for Solana blockchain interaction, refined through my debugging journey (see `../journey/debugging-notes.md`). It's a practical guide for developers and a showcase of DevRel/Technical Writing skills.

## Table of Contents
1. [Token Management](#token-management)
   - [mintTestTokens](#minttesttokens)
   - [transferTokens](#transfertokens)
2. [Metadata Management](#metadata-management)
   - [fetchMetadata](#fetchmetadata)
3. [Account Management](#account-management)
   - [checkBalance](#checkbalance)

## Token Management

### mintTestTokens
Creates a test SPL token with metadata on Solana Devnet.

**Execution**:
```bash
npm run mint:test-tokens
```

**Implementation**: `src/mint-test-tokens.ts`
- Uses config.ts for wallet (`docs/examples/basic/my_wallet.json`) and RPC settings
- Creates a mint, issues initial supply, and adds metadata via Metaplex
- Returns: Logs token details:
  - mintAddress: Mint public key
  - Metadata: Name, symbol, URI

**Example**:
```javascript
// Run via script
console.log("Run `npm run mint:test-tokens` to create a token.");
// Output: Mint Address: <MINT_ADDRESS>
```

### transferTokens
Transfers tokens between accounts non-interactively.

**Execution**:
```bash
npm run example:transfer -- <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>
```

**Implementation**: `src/transfer-tokens.ts`
- Takes command-line args for token address, amount, and recipient
- Uses wallet from config.ts
- Returns: Transaction signature

**Example**:
```javascript
// Run via script
console.log("Run `npm run example:transfer -- <TOKEN> 10 <RECIPIENT>`");
// Output: Transfer complete: <SIGNATURE>
```

## Metadata Management

### fetchMetadata
Retrieves token metadata with fallback handling.

**Execution**:
```bash
npm run example:info
```

**Implementation**: `src/token-info.ts`
- Fetches metadata using Metaplex's fetchMetadata
- Falls back to defaults (e.g., name: "Unknown") if unavailable
- Returns: Logs metadata (name, symbol, URI)

**Example**:
```javascript
// Run via script
console.log("Run `npm run example:info` to check metadata.");
// Output: Name: MOTO Journey Test Token, Symbol: MJTEST
```

## Account Management

### checkBalance
Displays wallet balance for SOL and tokens.

**Execution**:
```bash
npm run example:balance
```

**Implementation**: `src/check-balance.ts`
- Uses config.ts wallet to query balances via @solana/web3.js
- Returns: Logs balance (e.g., "1 SOL, 0 MTP")

**Example**:
```javascript
// Run via script
console.log("Run `npm run example:balance` to check balance.");
// Output: Wallet balance: 1 SOL, MTP: 0
```

## Error Handling
Functions include robust error handling from debugging insights:

- `fetch failed`: Network issues (2.9). Switch RPC to https://rpc.ankr.com/solana_devnet
- `NotEnoughBytesError`: Missing metadata (2.3). Ensure token is minted with metadata
- `TS2345`: API mismatches (2.10). Use keypairIdentity with Metaplex
- `Insufficient Funds`: Check balance before transfers (2.6)

**Example**:
```javascript
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
```

## Conclusion
This API reflects the MOTO PROTOCOL's streamlined token operations, optimized through debugging (e.g., batch runtime cut from 644s to 25s, 2.7). Check the `examples/` directory for full scripts and `../journey/debugging-notes.md` for the journey behind these functions.

*Note: Suggest enhancements via the MOTO PROTOCOL team!*

# Metadata Setup Guide

This guide explains how to set up metadata for your SPL Token on the Solana blockchain using the Metaplex JS SDK and related tools.

## Prerequisites
- **Node.js** (LTS version 16 or 18 recommended)
- **pnpm** or **npm** (for installing dependencies)
- **Solana CLI** (to manage Solana config and keypairs)
- A cloned repository of the [Metaplex JS SDK](https://github.com/metaplex-foundation/js) or your project containing it

## Overview
When creating an SPL token on Solana, you may want to associate NFT-style metadata with it, such as a name, symbol, and URI. This metadata is managed by the Metaplex Token Metadata Program. If the metadata account does not exist, attempts to read or update the token's metadata will fail.

Key steps:
1. **Create** or **mint** an SPL token (e.g., using `spl-token create-token`)
2. **Initialize** a metadata account for that token via Metaplex
3. **Update** the metadata if needed (name, symbol, URI, etc.)
4. **Verify** the metadata on-chain

## Step 1: Install Dependencies
Make sure you have the correct Node.js version (16 or 18). If you need to switch versions on Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows).

```bash
# Check your Node version
node -v

# (Optional) Switch to Node 18 if you're on Node 16 and using a pnpm version requiring 18+
nvm install 18.14.0
nvm use 18.14.0

# In your project folder
pnpm install
```

> Note: If your current pnpm requires Node.js v18.12 or higher, you may either upgrade Node.js or install an older pnpm (e.g., pnpm@7) for Node 16 compatibility.

## Step 2: Build or Prepare the Metaplex JS SDK
If you cloned the Metaplex JS monorepo:
```bash
pnpm run build
```
This compiles all packages, including the NFT metadata utilities.

## Step 3: Create a Metadata Account
Use the Metaplex JS SDK to create a metadata account for your SPL token. Below is an example script (`create-spl-metadata.js`), which:
- Connects to Solana with your wallet
- Takes a mint address (SPL Token)
- Creates a metadata account with a name, symbol, and URI

```javascript
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import fs from "fs";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const secretKey = JSON.parse(fs.readFileSync("path_to_your_keypair.json"));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

// The SPL Token's mint address
const mintAddress = new PublicKey("YOUR_SPL_TOKEN_MINT_ADDRESS");

async function createMetadata() {
  const { nft } = await metaplex.nfts().create({
    mintAddress,
    name: "My Token",
    symbol: "MYT",
    uri: "https://example.com/metadata.json",
    sellerFeeBasisPoints: 0, // if it's not an NFT with royalties
    updateAuthority: wallet,
  });
  console.log("Metadata created:", nft);
}

createMetadata().catch(console.error);
```

Run it:
```bash
node create-spl-metadata.js
```

## Step 4: Update Metadata (Optional)
If you need to update the metadata after creation, use a similar script but call `metaplex.nfts().update()` instead:

```javascript
await metaplex.nfts().update({
  nftOrSft: existingNftObject,
  name: "Updated Name",
  uri: "https://new-url.json",
});
```

## Step 5: Verify Metadata
You can verify the metadata account exists by checking the Token Metadata Program on Solana Explorer or using `metaplex.nfts().findByMint({ mintAddress })`.

## Troubleshooting
- **Mint account not found**: Ensure you're passing the correct mint address and you have minted the SPL token
- **Metadata account not found**: The metadata account doesn't exist yet. Run the creation script above
- **TypeError: Cannot read properties of undefined (reading 'equals')**: Usually means the mint address is invalid or not recognized by the SDK. Double-check your addresses
- **Node or pnpm version issues**: If you see errors about "Requires at least Node.js v18.12," upgrade your Node or downgrade pnpm to a version compatible with Node 16

## References
- [Solana SPL Token Docs](https://spl.solana.com/token)
- [Metaplex JS SDK GitHub](https://github.com/metaplex-foundation/js)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows)

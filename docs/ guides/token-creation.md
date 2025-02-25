# Token Creation Guide

This guide walks you through creating a Solana SPL token using the required development environment and Solana CLI tools. You will learn how to configure your environment, generate keypairs, and create a new SPL token on the Solana network.

## 1. Overview
In this guide, we will:
- Verify the environment setup (Node.js, pnpm, Solana CLI)
- Generate or load a Solana keypair
- Create a new SPL token using the spl-token CLI
- Optionally mint tokens and view balances

> Note: Before proceeding, ensure you have completed the Setup Guide or followed the instructions in the main README to configure Node.js (LTS), pnpm, and the Solana CLI.

## 2. Prerequisites

### Node.js (LTS)
- Recommended: Node 18.x (or Node 16.x if using an older pnpm version)
- You can manage Node versions using nvm on Windows

### pnpm
- Make sure pnpm is installed and compatible with your Node version
- For Node 18+, pnpm 9.x or higher is typically supported
- For Node 16, you may need to install an older pnpm (e.g., pnpm@7)

### Solana CLI
- Download and install the Solana CLI from the official docs
- Verify with:
```bash
solana --version
solana config get
```

### Keypair
- You can generate a new keypair using `solana-keygen new` or locate your existing keypair (e.g., `~/.config/solana/id.json` on Linux/macOS or `C:\Users\<username>\.config\solana\id.json` on Windows)

## 3. Environment Verification

### Check Node & pnpm
```bash
node -v
pnpm -v
```
If you encounter a version mismatch (e.g., your pnpm requires Node 18+), switch Node versions via nvm or install a compatible pnpm version.

### Check Solana CLI
```bash
solana --version
solana config get
```
Confirm you are on the correct RPC URL (devnet, testnet, or mainnet) and have a valid keypair path.

### Clone the Repository (Optional)
If you need the Metaplex JS codebase or this project's monorepo structure:
```bash
git clone https://github.com/<your-org>/moto-protocol.git
cd moto-protocol
pnpm install
pnpm run build
```
This step may vary depending on your actual repository structure.

## 4. Creating a New SPL Token

### 4.1 Generate or Load a Keypair
If you don't already have a Solana keypair, generate one:
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```
> Tip: Use a secure passphrase and back up your keypair file.

### 4.2 Create the SPL Token
With the Solana CLI installed, you can create a new token using the spl-token command:
```bash
spl-token create-token
```
This command outputs a token mint address, which identifies your newly created token on the Solana network.

Example output:
```makefile
Creating token ...
Token: <YourMintAddressHere>
```

### 4.3 Create a Token Account (Optional)
If you want to hold or receive tokens in your wallet, create an associated token account:
```bash
spl-token create-account <YourMintAddressHere>
```
This associates the new token with your current Solana wallet.

Example output:
```makefile
Creating account ...
Account: <YourTokenAccountAddressHere>
```

### 4.4 Mint Tokens (Optional)
To mint tokens to your newly created account:
```bash
spl-token mint <YourMintAddressHere> 1000 <YourTokenAccountAddressHere>
```
This example mints 1,000 tokens to the specified token account.
You can mint more (or fewer) tokens as needed.

### 4.5 Check Balances
Use the spl-token CLI to verify token balances:
```bash
spl-token balance <YourMintAddressHere>
spl-token accounts
```
- `balance` shows how many tokens exist in a specific account
- `accounts` lists all SPL token accounts owned by your wallet

## 5. Example Workflow
1. Generate a keypair
```bash
solana-keygen new
```

2. Create a token
```bash
spl-token create-token
```

3. Create an associated account
```bash
spl-token create-account <MintAddress>
```

4. Mint tokens
```bash
spl-token mint <MintAddress> 1000 <TokenAccountAddress>
```

5. Check balances
```bash
spl-token accounts
spl-token balance <MintAddress>
```

## 6. Common Issues & Troubleshooting

### Node.js version or pnpm mismatch
- Switch Node versions with `nvm use <version>` or install a pnpm version compatible with Node 16 or 18

### Resource in use error when deleting folders
- Close all terminals or file explorer windows that may be locking the folder
- Use an elevated PowerShell (Administrator mode) if necessary

### Cannot find metaplex/js/packages/cli
- Make sure you cloned the correct repository if you need the Metaplex CLI
- If you only need the JS SDK, clone metaplex-foundation/js

For more detailed troubleshooting, see [Troubleshooting](../troubleshooting.md) or refer to the gtp-process logs for step-by-step environment fixes.

## 7. Next Steps
Once your SPL token is created, you can:
- Set up metadata using the [Metadata Setup Guide](./metadata-setup.md)
- List the token on a DEX (e.g., Raydium) using the [DEX Listing Guide](./dex-listing.md)
- Explore advanced features like Marketing Automation or on-chain programs integrated with your token

Congratulations! You have successfully created a Solana SPL token. If you encounter any issues, please consult the [Troubleshooting](../troubleshooting.md) page or the project's [FAQ](../faq.md).

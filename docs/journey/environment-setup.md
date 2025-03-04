# Environment Setup Guide – MOTO PROTOCOL SPL Token Project
*Last Updated: March 4, 2025*

This guide helps you set up the development environment for the MOTO PROTOCOL SPL Token Project on Solana Devnet. Built from my own debugging journey (see `debugging-notes.md`), it's designed to get you started quickly—whether you're new to Solana or a seasoned developer—while avoiding the pitfalls I encountered.

---

## Prerequisites
Here's what you need, refined through trial and error:

- **Node.js**: v16.20.0 (v22.x breaks Metaplex compatibility).
  - Install with `nvm`:
    ```bash
    nvm install 16.20.0
    nvm use 16.20.0
    node -v  # Should show 16.20.0
    ```
- **TypeScript**: For running `.ts` scripts.
  - Install globally: `npm install -g ts-node`
- **PNPM**: v7.x (matches Node 16; v9.x needs Node 18+).
  - Install: `npm install -g pnpm@7`
  - Verify: `pnpm -v`
- **Solana CLI**: For wallet and Devnet tasks.
  - Install:
    ```bash
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    solana --version
    ```
- **Stable Internet**: Essential for RPC calls (unstable connections caused `fetch failed` errors).

---

## Setup Steps
Follow these steps to build a working environment:

### 1. Clone the Repository
Get the project:
```bash
git clone https://github.com/yourusername/MOTOPROTOCOL_Journey.git
cd MOTOPROTOCOL_Journey
```

### 2. Install Dependencies
Add the core libraries:
```bash
pnpm install @solana/web3.js @solana/spl-token @metaplex-foundation/mpl-token-metadata @metaplex-foundation/js dotenv chalk
```

**Fix**: If you see "Unsupported URL Type 'workspace:*'", reinstall PNPM 7.x with Node 16.

### 3. Configure TypeScript
Set up tsconfig.json in the root:
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["src/**/*", "docs/**/*"],
  "exclude": ["node_modules"]
}
```

Move .ts files to src/ if not already:
```bash
mkdir src
mv *.ts src/
```
**Why?** Prevents "No inputs were found" errors.

### 4. Set Up Solana Wallet
Create and fund a test wallet:
```bash
solana-keygen new --outfile docs/examples/basic/my_wallet.json
solana airdrop 2 $(solana-keygen pubkey docs/examples/basic/my_wallet.json) --url https://rpc.ankr.com/solana_devnet
```

**Tip**: Keep ~0.5 SOL for fees (learned from transfer failures).

### 5. Configure Environment
Edit config/config.ts:
```typescript
export const CONFIG = {
  RPC_URL: process.env.RPC_URL || "https://rpc.ankr.com/solana_devnet",
  WALLET_FILE: process.env.WALLET_FILE || "./docs/examples/basic/my_wallet.json",
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || "",
  TOKEN_DECIMALS: 9,
  MINT_AMOUNT: 1000000
};
```

Optional .env for flexibility:
```bash
echo "RPC_URL=https://rpc.ankr.com/solana_devnet" >> .env
echo "WALLET_FILE=./docs/examples/basic/my_wallet.json" >> .env
```

### 6. Mint a Test Token
Test your setup by minting a token:
```bash
npm run mint:test-tokens
```

This auto-updates TOKEN_ADDRESS in config.ts—no manual edits needed!

Verify: `npm run example:info`

### 7. Build and Run
Compile and test:
```bash
pnpm run build
npm run example:balance
```

**Fix**: If builds fail, check dist/ paths or delete conflicting .js files.

## Real-World Tips from Debugging
These lessons saved me hours:

1. **Network Stability**: Use https://rpc.ankr.com/solana_devnet over the default RPC if fetch failed occurs. Add retries:
```typescript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); } catch (e) {
      console.log(`Retry ${i + 1}/${maxRetries}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}
```

2. **Metaplex Setup**: Use keypairIdentity for wallet auth, not direct Keypair passing (fixed TS2345 errors).

3. **Automation**: Auto-updating config.ts cut setup time by 96% (644s to 25s for batch processes).

## FAQ & Troubleshooting


**Q1**: "TypeScript errors about missing names or top-level await?"

**A1**: Set tsconfig.json "target" to "es2020" and add import/export statements.


**Q2**: "Unsupported URL Type 'workspace:*'?"

**A2**: Match PNPM 7.x with Node 16, or PNPM 9.x with Node 18.


**Q3**: "fetch failed or network errors?"

**A3**: Switch to https://rpc.ankr.com/solana_devnet in config.ts.


**Q4**: "No inputs were found in config file?"

**A4**: Ensure .ts files are in src/ and tsconfig.json includes "src/**/*".


**Q5**: "Insufficient balance" errors?

**A5**: Check token balance (npm run example:balance) and request SOL.


**Q6**: "Metadata not found (NotEnoughBytesError)?"

**A6**: Mint with npm run mint:test-tokens or use a token with metadata.

## Conclusion
This setup aligns Node.js, PNPM, TypeScript, and Solana Devnet for the MOTO PROTOCOL project. By centralizing configs, automating updates, and dodging version mismatches, you'll avoid the headaches I faced—like 644-second batch runs! For deeper insights, check debugging-notes.md.

Happy coding! Questions? Reach out to the MOTO PROTOCOL team.

## Resources
- [Node.js Official Site](https://nodejs.org/)
- [PNPM Documentation](https://pnpm.io/documentation)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Solana Docs](https://docs.solana.com/)
- [Metaplex Docs](https://docs.metaplex.com/)

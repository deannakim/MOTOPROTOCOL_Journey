# Troubleshooting Guide - MOTO PROTOCOL SPL Token Project
*Last Updated: March 4, 2025*

This guide addresses common issues during the MOTO PROTOCOL SPL Token Project setup and development, with solutions drawn from my debugging journey (see `../journey/debugging-notes.md`). It's here to save you time and frustration.

---

## Environment Setup Issues

### Node.js Version Conflicts
**Problem**:
- Incompatible Node.js version (e.g., v22.x breaks Metaplex).
- PNPM version mismatches.
- Build failures due to version issues.

**Solution**:
```bash
# Check current version
node -v

# Install and use compatible version
nvm install 16.20.0
nvm use 16.20.0

# Install ts-node for .ts scripts
npm install -g ts-node
```

## Project Structure Issues

### Problem:
- Incorrect file organization (e.g., .ts files in root).
- Missing directories (src/, dist/).
- TypeScript compilation errors.

### Solution:
```bash
# Set up proper structure
mkdir -p src dist docs/examples/basic
mv *.ts src/
touch docs/examples/basic/my_wallet.json
```

## Build Process Issues

### Build Errors
**Problem**:
- Incomplete tsconfig.json.
- Dependency conflicts.
- Compilation failures.

**Solution**:
Verify tsconfig.json:
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

Install dependencies:
```bash
pnpm install @solana/web3.js @solana/spl-token @metaplex-foundation/js dotenv chalk
pnpm run build
```

### Successful Build
Confirm with: `ls dist/` (Unix) or `dir dist\` (Windows).

## Common Issues & Solutions

### 1. PNPM Installation Issues
**Problem**:
"Error: This version of pnpm requires at least Node.js v18.12".

**Solution**:
```bash
# Use compatible PNPM with Node 16
npm uninstall -g pnpm
npm install -g pnpm@7
pnpm -v  # Should show 7.x
```

### 2. TypeScript Compilation Errors
**Problem**:
- "Cannot find module" or "No inputs were found".
- TS2345: Keypair/Metaplex type mismatches.

**Solution**:
- Check tsconfig.json includes "src/**/*".
- Update Metaplex calls:
```typescript
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));
```

### 3. Solana CLI & Runtime Issues
**Problem**:
- fetch failed network errors.
- Insufficient balance for transactions.
- NotEnoughBytesError in token info.

**Solution**:
```bash
# Check config and network
solana config get
solana balance --url https://rpc.ankr.com/solana_devnet

# Airdrop SOL
solana airdrop 2 --url https://rpc.ankr.com/solana_devnet

# Mint with metadata to avoid metadata errors
npm run mint:test-tokens
```

## Best Practices

### Environment Verification:
- Always use Node 16.20.0, PNPM 7.x.
- Test on Devnet before Mainnet.

### Project Setup:
- Centralize configs in config.ts or .env.
- Use Git for version control.

### Error Handling:
- Log errors with chalk for clarity.
- Automate retries for network issues:
```typescript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); } catch (e) { await new Promise(r => setTimeout(r, 2000)); }
  }
}
```

## Quick Reference

### Environment Checks
```bash
node -v        # Should be 16.20.0
pnpm -v        # Should be 7.x
solana --version
```

### Build Process
```bash
rm -rf node_modules
pnpm install
pnpm run build
```

### Common Commands
```bash
# Mint token with metadata
npm run mint:test-tokens

# Check balance
npm run example:balance

# View token info
npm run example:info
```

## Additional Resources
- Environment Setup Guide (../guides/environment-setup.md)
- Debugging Notes (../journey/debugging-notes.md)
- Lessons Learned (../journey/lessons-learned.md)

## Getting Help
If issues persist:
- Check GitHub Issues.
- Review debugging-notes.md.
- Submit a bug report with logs and steps.

*Note: This guide evolves with user feedback and new findings—share your challenges to improve it!*

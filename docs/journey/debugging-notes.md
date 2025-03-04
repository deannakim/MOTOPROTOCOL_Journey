# Debugging Notes – MOTO PROTOCOL SPL Token Project
*Last Updated: March 4, 2025*

This document chronicles the debugging journey for the MOTO PROTOCOL SPL Token Project on Solana, from initial environment setup to advanced token management. It serves as a personal record, a guide for other developers, and a portfolio piece demonstrating DevRel and Technical Writing skills.

## Table of Contents
1. [Project Setup Challenges](#project-setup-challenges)  
   - 1.1 [Node Version Conflicts (2025-02-25)](#node-version-conflicts)  
   - 1.2 [Package Manager Issues (2025-02-25)](#package-manager-issues)  
   - 1.3 [PNPM Installation Errors (2025-02-25)](#pnpm-installation-errors)  
   - 1.4 [Build Process Errors (2025-02-25)](#build-process-errors)  
   - 1.5 [File Structure Issues (2025-02-25)](#file-structure-issues)  
   - 1.6 [Distribution Folder Issues (2025-02-25)](#distribution-folder-issues)  
   - 1.7 [JSON Parse Error in package.json (2025-02-26)](#json-parse-error)  
2. [SPL Token Development & Automation](#spl-token-development--automation)  
   - 2.1 [TypeScript Compilation Errors in check-balance.ts (2025-02-26)](#typescript-compilation-errors)  
   - 2.2 [Successful Balance Check Implementation (2025-02-26)](#successful-balance-check)  
   - 2.3 [Token Info Display Issue in token-info.ts (2024-02-26)](#token-info-display-issue)  
   - 2.4 [Transfer Example Code Update (2024-02-26)](#transfer-example-update)  
   - 2.5 [Wallet File Path Issue (2024-02-26)](#wallet-file-path-issue)  
   - 2.6 [Token Transfer Test Failed (2024-02-26)](#token-transfer-test-failed)  
   - 2.7 [Batch Process Test Plan & Debugging (2024-02-26 to 2025-02-27)](#batch-process-debugging)  
   - 2.8 [Config.ts Update & Token Address Management (2025-02-27)](#config-ts-update)  
   - 2.9 [Network Errors & RPC Issues (2025-03-04)](#network-errors)  
   - 2.10 [Metaplex API Compatibility Challenges (2025-03-04)](#metaplex-api-compatibility)  
3. [Key Learnings & Best Practices](#key-learnings--best-practices)  
4. [Common Issues & Solutions](#common-issues--solutions)  
5. [Next Steps](#next-steps)

---

## Project Setup Challenges
Initial hurdles in setting up the development environment for the MOTO PROTOCOL project.

### Node Version Conflicts (2025-02-25)
**Issue**: Build failed due to Node.js version incompatibility (v22.13.1).  
**Solution**: Switched to v16.20.0 using `nvm`.  
**Key Learnings**: Check project’s recommended Node.js version; use `nvm` for version control.  

### Package Manager Issues (2025-02-25)
**Issue**: PNPM version conflicts caused build failures.  
**Solution**: Installed PNPM 7.x compatible with Node.js 16.  
**Key Learnings**: Match package manager versions with Node.js.  

### PNPM Installation Errors (2025-02-25)
**Issue**: Workspace protocol and dependency resolution errors.  
**Solution**: Fixed workspace config and dependency conflicts.  
**Key Learnings**: Understand PNPM workspace protocols.  

### Build Process Errors (2025-02-25)
**Issue**: Configuration errors halted builds.  
**Solution**: Corrected TypeScript config and build scripts.  
**Key Learnings**: Validate build configurations early.  

### File Structure Issues (2025-02-25)
**Issue**: TypeScript compilation failed due to file organization.  
**Solution**: Reorganized into `src/` and `dist/`, updated `tsconfig.json`.  
**Key Learnings**: Maintain clear directory structure.  

### Distribution Folder Issues (2025-02-25)
**Issue**: Build couldn’t generate `dist/` correctly.  
**Solution**: Fixed output paths in config.  
**Key Learnings**: Ensure consistent path references.  

### JSON Parse Error in package.json (2025-02-26)
**Issue**: `npm ERR! code EJSONPARSE` due to missing commas in `scripts`.  
**Solution**: Validated and fixed JSON format using VS Code tools.  
**Key Learnings**: JSON requires strict formatting; use validators.  
**Screenshots**: /.github/images/setup/06-json-parse-error.png  

---

## SPL Token Development & Automation
Debugging challenges during SPL token creation, management, and automation on Solana Devnet.

### TypeScript Compilation Errors in check-balance.ts (2025-02-26)
**Issue**: PublicKey type mismatches, deprecated `getTokenAccounts`.  
**Solution**: Used `getAccounts`, added explicit types.  
**Key Learnings**: Strict TypeScript needs explicit typing; track API changes.  

### Successful Balance Check Implementation (2025-02-26)
**Progress**: Fixed errors, confirmed wallet balance (1 SOL, 0 MTP).  
**Result**: `npm run example:balance` succeeded.  
**Key Learnings**: Environment-specific tweaks (e.g., no shebang on Windows).  

### Token Info Display Issue in token-info.ts (2024-02-26)
**Issue**: `NotEnoughBytesError`, no metadata displayed.  
**Solution**: Updated to `fetchMetadata` with fallback values.  
**Key Learnings**: Prepare tokens with metadata for demos.  
**Screenshots**: /.github/images/setup/15-fixed-output.png  

### Transfer Example Code Update (2024-02-26)
**Issue**: Needed better error handling and API updates.  
**Solution**: Enhanced `try/catch`, used latest Metaplex APIs.  
**Key Learnings**: Robust validation improves reliability.  

### Wallet File Path Issue (2024-02-26)
**Issue**: Wrong path (`./my_wallet.json`) in `transfer-tokens.ts`.  
**Solution**: Updated to `docs/examples/basic/my_wallet.json`.  
**Key Learnings**: Use consistent paths, document in README.  

### Token Transfer Test Failed (2024-02-26)
**Issue**: Insufficient MTP tokens (0 balance).  
**Solution**: Minted test tokens via `npm run mint:test-tokens`.  
**Key Learnings**: Ensure test environment has resources.  

### Batch Process Test Plan & Debugging (2024-02-26 to 2025-02-27)
**Issue**: Interactive mode stalled batch process; reduced runtime from 644s to 25s.  
**Solution**: Made `transfer-tokens.ts` non-interactive, optimized tasks.  
**Key Learnings**: Automation needs command-line args; centralize configs.  

### Config.ts Update & Token Address Management (2025-02-27)
**Issue**: Old `TOKEN_ADDRESS` caused failures post-minting.  
**Solution**: Automated update in `mint-test-tokens.ts`.  
**Key Learnings**: Centralized config prevents errors.  

### Network Errors & RPC Issues (2025-03-04)
**Issue**: `fetch failed`, 403 errors from RPC.  
**Solution**: Switched to `https://rpc.ankr.com/solana_devnet`, added retries.  
**Key Learnings**: Monitor RPC stability, document alternatives.  

### Metaplex API Compatibility Challenges (2025-03-04)
**Issue**: TypeScript errors (e.g., `TS2345`) with Metaplex APIs.  
**Solution**: Used `keypairIdentity`, updated to `createMint` and `nfts().create`.  
**Key Learnings**: Regularly check API docs for changes.  

---

## Key Learnings & Best Practices
- **Documentation**: Detailed "Problem → Cause → Solution" records aid future debugging and community support.  
- **Configuration**: Centralize settings in `config.ts` or `.env` for consistency.  
- **Automation**: Use command-line args for non-interactive scripts.  
- **Error Handling**: Clear messages and logging speed up diagnosis.  
- **Version Control**: Match Node.js, PNPM, and library versions to project needs.  

## Common Issues & Solutions
- **PNPM Workspace**: "Unsupported URL Type 'workspace:*'" — Use PNPM 7.x with Node.js 16.  
- **TypeScript**: "No inputs found" — Verify `tsconfig.json` paths.  
- **Network**: `fetch failed` — Switch RPC, add retries.  
- **Metadata**: `NotEnoughBytesError` — Mint with metadata or use fallback.  

## Next Steps
- Automate environment checks.  
- Enhance metadata support with Metaplex.  
- Add comprehensive tests.  
- Keep documentation updated with new findings.

*Note*: This file evolves with the project. Contributions to improve it are welcome via the MOTO PROTOCOL team.

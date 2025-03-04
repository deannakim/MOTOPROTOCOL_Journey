# Lessons Learned – MOTO PROTOCOL SPL Token Project
*Last Updated: March 4, 2025*

This document captures key insights from developing the MOTO PROTOCOL SPL Token Project on Solana. These lessons, drawn from my debugging journey (see `docs/journey/debugging-notes.md`), are valuable for DevRel professionals, Technical Writers, and developers working with Solana and Metaplex. They reflect both foundational setup wisdom and advanced blockchain-specific takeaways.

---

## 1. Environment Management
### Focus: Node Version Management & Tool Compatibility
**What We Learned**:
- Start with LTS Node.js versions (16.x or 18.x)—v22.x broke Metaplex compatibility.
- Use `nvm` to switch versions seamlessly (e.g., `nvm use 16.20.0`).
- Match PNPM versions to Node.js (7.x for Node 16, 9.x for Node 18+).
- Document exact version requirements in README.

**Impact**:
- Cut setup time for new team members by avoiding version conflicts.
- Stabilized development environment, reducing initial build failures.

---

## 2. Package Manager Configuration
### Focus: PNPM Setup and Dependency Consistency
**What We Learned**:
- Install PNPM version-specifically (e.g., `npm install -g pnpm@7`) to dodge "workspace:*" errors.
- Document dependency relationships (e.g., `@metaplex-foundation/js` needs Node 16).
- Run `pnpm install` after version switches to ensure consistency.

**Impact**:
- Faster, conflict-free package installations.
- Consistent dependency management across team setups.

---

## 3. Installation Troubleshooting
### Focus: Resolving Common Setup Errors
**What We Learned**:
- Fix PNPM "Unsupported URL Type 'workspace:*'" by aligning Node.js and PNPM versions.
- Handle TypeScript errors (e.g., `TS2345`) by updating APIs like `keypairIdentity`.
- Log and share solutions for recurring issues (e.g., `fetch failed`).

**Impact**:
- Accelerated error resolution with clear logs.
- Improved onboarding docs with real fixes (e.g., RPC switches).

---

## 4. Build Process Management
### Focus: TypeScript and Build Stability
**What We Learned**:
- Validate `tsconfig.json` (e.g., `"target": "es2020"`, `"include": ["src/**/*"]`) early.
- Monitor build scripts (`pnpm run build`) for path or config issues.
- Automate token address updates in `config.ts` to avoid post-mint errors.

**Impact**:
- Reliable builds with fewer manual fixes.
- Reduced debugging time by 96% in batch processes (644s to 25s).

---

## 5. Project Structure Organization
### Focus: Directory and File Management
**What We Learned**:
- Keep `.ts` files in `src/` and outputs in `dist/` for TypeScript compatibility.
- Use consistent paths (e.g., `docs/examples/basic/my_wallet.json` for wallets).
- Follow Solana best practices (e.g., centralize configs in `config.ts`).

**Impact**:
- Cleaner code organization and easier maintenance.
- Smoother collaboration with standardized structure.

---

## 6. Solana Devnet Operations
### Focus: Token Development and Network Handling
**What We Learned**:
- Ensure wallets have ~0.5 SOL for fees before transfers or minting.
- Switch RPCs (e.g., `https://rpc.ankr.com/solana_devnet`) when `fetch failed` occurs.
- Add retry logic for network stability:
  ```typescript
  async function withRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try { return await fn(); } catch (e) { await new Promise(r => setTimeout(r, 2000)); }
    }
  }
  ```

**Impact**:
- Robust token operations with fewer network-related failures.
- Enhanced user experience with automated retries.

---

## 7. API Compatibility and Automation
### Focus: Metaplex Integration and Workflow Efficiency
**What We Learned**:
- Update Metaplex calls (e.g., createMint over createToken) per latest docs.
- Automate config.ts updates post-minting to eliminate manual steps.
- Test with metadata-enabled tokens to avoid NotEnoughBytesError.

**Impact**:
- Seamless SPL token creation with metadata.
- Streamlined workflows, cutting setup errors significantly.

---

## 8. Success Patterns
### Focus: Reproducible Results
**What We Learned**:
- Follow a systematic "Problem → Cause → Solution" approach.
- Document successful configs (e.g., `nvm use 16; pnpm install`).
- Share patterns like non-interactive scripts for batch tasks.

**Impact**:
- Reproducible builds and token operations.
- Faster team onboarding with proven steps.

---

## Key Takeaways

### Documentation is Critical:
- Write as you debug, with examples and screenshots.
- Keep it current—outdated docs waste time.

### Error Management:
- Log errors detailedly (e.g., `chalk.red("Error: " + error.message)`).
- Share fixes to prevent repeat struggles.

### Development Workflow:
- Centralize configs in config.ts or .env.
- Use consistent tools and versions across the board.

---

## Best Practices Established

### Setup and Configuration:
```bash
nvm use 16
npm install -g pnpm@7
pnpm install
```

### Error Prevention:
- Pre-check: Node.js version, PNPM version, tsconfig.json paths.
- Validate: Wallet SOL balance, RPC stability.

### Quality Assurance:
- Test: `npm run example:balance`, `npm run example:info`.
- Verify: Build output in dist/, token metadata.

---

## Future Improvements

### Automation:
- Script environment checks and full Metaplex metadata integration.
- Automate testing for network scenarios.

### Documentation:
- Add interactive guides or video walkthroughs.
- Expand error resolution guides with visuals.

### Community:
- Host setup workshops or Q&A calls.
- Build feedback loops for user-reported issues.

---

## Conclusion

These lessons transformed our process—from version mismatches to a 96% faster batch workflow (644s to 25s). They guide us toward:
- **Documentation Quality**: Clearer, example-rich guides, updated regularly.
- **Process Improvement**: Streamlined setup, automated workflows, fewer errors.
- **Community Support**: Better resources and engagement for Solana devs.

*Note: This evolves with new insights. Share your challenges with the MOTO PROTOCOL team to keep improving!*

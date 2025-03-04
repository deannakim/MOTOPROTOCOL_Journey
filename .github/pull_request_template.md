# Pull Request

## Description
Provide a concise summary of your changes and how they relate to the MOTO PROTOCOL SPL Token Project features (e.g., SPL Token Creation, Metadata Management, Automation) as outlined in the README. Include relevant issue numbers or links (e.g., `#123`).

## Change Type
Select one or more options that best describe your change:

- [ ] Bug Fix (non-breaking change that fixes an issue, e.g., TypeScript error in `check-balance.ts`)
- [ ] New Feature (non-breaking change that adds functionality, e.g., automated `config.ts` updates)
- [ ] Breaking Change (changes that may affect existing functionality, e.g., API version update)
- [ ] Documentation Update (e.g., revised debugging notes)

## Motivation and Context
Explain why this change is necessary and how it improves the project. Reference challenges from development, such as:
- Node.js version conflicts (e.g., switched to v16.20.0 for build stability)
- RPC instability (e.g., `fetch failed` errors requiring endpoint switches)
- Manual config updates (e.g., `TOKEN_ADDRESS` mismatches post-minting)

Link to relevant debugging notes (e.g., "Network Errors & RPC Issues" from 2025-03-04) if applicable.

## Process and Testing
Describe the steps you took to implement and verify your changes. Include details like:

- **Environment Adjustments:** (e.g., "Set Node.js to v16.20.0 with `nvm use 16.20.0` for PNPM 7.x compatibility")
- **Commands Executed:** (e.g., "Ran `npm install` and `npm run mint:test-tokens` to test token creation")
- **Troubleshooting Steps:** (e.g., "Switched RPC to `https://rpc.ankr.com/solana_devnet` after 403 errors, added retries per debugging notes")

**Testing:**
- [ ] I have run unit tests (using Jest, if implemented) and all tests pass
- [ ] I have manually verified the changes in a local Devnet environment (e.g., checked `npm run example:info` output)

*Note:* Unit tests are planned but not yet fully implemented (see "Next Steps" in debugging notes).

## Screenshots / Logs
Attach screenshots or log excerpts demonstrating your changes or the issue resolved. Examples:
- TypeScript error logs (e.g., `TS2345` from `mint-test-tokens.ts`)
- Successful script output (e.g., "Mint Address: <new_address>")
- RPC error messages (e.g., `fetch failed`)

```bash
# Example: "Wallet balance: 1 SOL, MTP: 0"
```

## Checklist
- [ ] My code adheres to the project's TypeScript strict typing and style guidelines
- [ ] I have conducted a thorough self-review of my code
- [ ] I have added comments for clarity (e.g., in complex TypeScript fixes)
- [ ] I have updated relevant documentation (e.g., debugging-notes.md, README) where applicable
- [ ] My changes do not generate new TypeScript warnings
- [ ] All dependent changes have been merged and published

## Additional Context
Provide extra information for reviewers, such as:
- Links to related issues or debugging notes (e.g., "See 'Metaplex API Compatibility Challenges' from 2025-03-04")
- Impact on scripts (e.g., transfer-tokens.ts now non-interactive)
- References to external docs (e.g., Metaplex Token Metadata Overview)

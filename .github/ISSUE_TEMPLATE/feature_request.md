---
name: Feature Request
about: Propose enhancements to improve the MOTO PROTOCOL SPL Token Project
title: '[FEATURE REQUEST] '
labels: enhancement
assignees: ''
---

## Is your feature request related to a problem?
Describe the issue or limitation you’re facing with the MOTO PROTOCOL SPL Token Project. For example:
- "Manual updates to `config.ts` TOKEN_ADDRESS after minting are error-prone."
- "Metadata errors (`NotEnoughBytesError`) lack clear diagnostics."
- "No automated tests for token operations."

## Describe the solution you'd like
Outline the feature or enhancement you’d like to see. Examples aligned with the project:
- **Automated Config Updates:** A script that updates `config.ts` TOKEN_ADDRESS post-minting.
- **Enhanced Metadata Tools:** A CLI tool to validate and preview metadata before deployment.
- **Test Suite:** Automated Jest tests for `check-balance.ts` and `transfer-tokens.ts`.
Explain how it works and its benefits (e.g., "Reduces manual errors, saves time").

## Describe alternatives you've considered
Detail other solutions you’ve explored and why they’re insufficient. Examples:
- "Manual `config.ts` edits work but are tedious and error-prone."
- "Using Mainnet for metadata testing was considered but too costly for Devnet focus."
- "Checked existing Metaplex CLI tools, but they lack TypeScript integration."

## Additional context
Provide supporting details to illustrate your request:
- **Affected Scripts:** [e.g., `mint-test-tokens.ts`]
- **External Resources:** [e.g., link to Metaplex docs]
- **Mockups/Screenshots:** [e.g., a sample CLI output]
- Any other info (e.g., "Inspired by Solana Cookbook automation examples").

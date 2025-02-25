---
name: Bug Report
about: Report an issue encountered during metadata update for the SPL token
title: "[BUG] Metadata Update Failure for SPL Token"
labels: bug
assignees: ""
---

## Bug Description
When attempting to update the metadata for the SPL token using the `update-metadata.js` script, the process fails because the metadata account is not found. Despite the token mint account existing, the script logs indicate that the metadata PDA is computed but the metadata account does not exist. This results in an error: "Mint account not found."

## Steps To Reproduce
1. **Mint Verification:** Confirm that the token mint exists by running:
   ```bash
   spl-token display GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRPeQsNx6h
   ```

2. **Run Metadata Update Script:** Execute the following command in PowerShell:
   ```bash
   node update-metadata.js GccSrdDCs28Up6W8BdqDUwpSbJUAg2LXPRPeQsNx6h "https://green-hidden-wallaby-86.mypinata.cloud/ipfs/bafkreieodzdtqeh4rjax2bfmtzhdjxv32q67qfv5yuizz3x3vovkqnr7y"
   ```

3. **Observe the Output:** The script computes the Metadata PDA but logs indicate:
   - "Metadata account exists: false"
   - "Error: Mint account not found"

4. **Check Environment:** Ensure that you are using the correct network (Devnet/Mainnet) and that the wallet has proper permissions.

## Expected Behavior
The metadata update script should successfully find the associated NFT metadata account (created via Metaplex's Metadata Program) and update it with the new URI. This update should allow token details such as name, symbol, and logo to be displayed correctly on DEXs and wallet interfaces.

## Actual Behavior
- The script computes the Metadata PDA, but no metadata account is found.
- It outputs "Metadata account exists: false" and throws an error "Mint account not found."
- Consequently, the metadata is not updated, and the token continues to display only its mint address instead of the intended metadata.

## Environment
- OS: Windows 10/11
- Node Version: 18.14.0 (after switching via nvm)
- pnpm Version: 9.15.5
- Metaplex JS SDK Version: (e.g., 0.20.1)
- Solana CLI Version: 2.1.5 (or later)
- RPC URL: https://api.devnet.solana.com (or mainnet-beta as applicable)

## Additional Context
- The error occurs during the metadata update process using the Metaplex SDK.
- The token is currently in the minting phase, and the NFT metadata account may not have been created prior to the update attempt.
- This issue prevents proper display of token metadata (name, symbol, logo) on platforms like Raydium and in wallets like Phantom.
- It is suggested that a metadata account be created for the token before attempting an update.

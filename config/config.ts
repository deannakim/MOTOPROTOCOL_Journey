// MOTOPROTOCOL_Journey/config/config.ts
export const CONFIG = {
  // Network
     RPC_URL: process.env.RPC_URL || "https://api.devnet.solana.com",  

  // Wallet
  WALLET_FILE: process.env.WALLET_FILE || "./test-wallet.json",

  // Token  
  // NOTE: Set this to your pre-minted token address.  
  // If the token address is invalid or not found on-chain, the scripts will error out.
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || "F3bDnaRnWWWK2ZMfpoVRMm4ZaNuAtgn7QDTczXNtJ85K",
  TOKEN_DECIMALS: 9,
  MINT_AMOUNT: 1000000,

  // Test settings
  CONTINUE_ON_ERROR: false,
  ENABLE_LOGGING: true
};

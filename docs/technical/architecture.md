# MOTO PROTOCOL Architecture
*Last Updated: March 4, 2025*

## Core Components

### 1. Token Layer
- Manages token creation, supply, and transfers
- Tokens store basic metadata (name, symbol, URI) on-chain

### 2. Metadata Layer
- Handles metadata creation, updates, and URI management via Metaplex
- Current metadata handling is documented in debugging notes and implemented in `mint-test-tokens.ts`

### 3. Interaction Layer
- Provides user interfaces for:
  - Checking balances (`check-balance.ts`)
  - Viewing token information (`token-info.ts`)
  - Batch processing transfers (`transfer-tokens.ts`)

## Implementation
- Built using TypeScript scripts executed via npm commands
- Utilizes error handling with Chalk
- Integrates environment configurations via dotenv

## Tech Stack

### Core Technologies
- **Blockchain:** Solana
- **Token Standard:** SPL Token
- **Metadata Standard:** Metaplex Token Metadata
- **Language:** TypeScript
- **Runtime:** Node.js 16.20.0

### Dependencies
```json
{
  "dependencies": {
    "@metaplex-foundation/js": "^0.20.1",
    "@solana/spl-token": "^0.4.12",
    "@solana/web3.js": "^1.98.0",
    "chalk": "^4.1.2",
    "dotenv": "^16.0.0"
  }
}
```

## Development Environment
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

## Token Metadata Structure
```json
{
  "name": "MOTO Journey Test Token",
  "symbol": "MJTEST",
  "uri": "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json"
}
```

## Data Flow

### Token Creation and Metadata Update

    ┌──────────┐    ┌──────────────┐    ┌─────────────────┐
    │  Create  │    │   Generate   │    │ Update Metadata │
    │  Token   ├───►│     ATA      ├───►│  with Metaplex  │
    └──────────┘    └──────────────┘    └─────────────────┘

### Token Transfer Process
    ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
    │  Check   │    │   Validate   │    │   Execute    │    │  Confirm │
    │ Balance  ├───►│  Parameters  ├───►│  Transfer    ├───►│  Result  │
    └──────────┘    └──────────────┘    └──────────────┘    └──────────┘


## Security Considerations
- **Error Handling:** Detailed logs with chalk, retries for network issues
- **Key Management:** Wallet at docs/examples/basic/my_wallet.json, .env usage
- **Validation:** Pre-transfer checks

## Future Enhancements
- **Automation:** config.ts updates
- **Batch Efficiency:** Optimized from 644s to 25s
- **Extendable** for future features

# MOTO PROTOCOL Architecture
*Last Updated: March 4, 2025*

## Core Components

### 1. Token Layer
Manages fundamental token operations.

**Key Components**:
- Token creation (`mint-test-tokens.ts`)
- Supply management
- Transfer operations
- Stores name, symbol, URI on-chain

### 2. Metadata Layer
Handles token metadata management.

**Key Components**:
- Metadata creation and updates
- URI management
- Metaplex integration

### 3. Interaction Layer
Provides user interfaces for token operations.

**Key Components**:
- Balance checking (`check-balance.ts`, 2.2)
- Token info (`token-info.ts`, 2.3)
- Batch processing (`transfer-tokens.ts`, 2.7)

**Implementation**:
- TypeScript scripts executed via `npm run`
- Includes error handling with `chalk` (2.4)

## Technical Stack

### Core Technologies
- **Blockchain**: Solana
- **Token Standard**: SPL Token
- **Metadata Standard**: Metaplex Token Metadata
- **Language**: TypeScript
- **Runtime**: Node.js 16.20.0 (1.1)

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

- `@metaplex-foundation/js`: Metadata and token operations (2.10)
- `@solana/spl-token`: SPL token management
- `@solana/web3.js`: Solana blockchain interaction
- `chalk`: CLI output styling (2.4)
- `dotenv`: Environment config (3.3)

### Development Environment
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
Minimal structure from `mint-test-tokens.ts` (3.1):
```json
{
  "name": "MOTO Journey Test Token",
  "symbol": "MJTEST",
  "uri": "https://raw.githubusercontent.com/yourusername/MOTOPROTOCOL_Journey/main/assets/token-metadata.json"
}
```

## Data Flow

### Token Creation and Metadata Update

┌──────────┐ ┌──────────────┐ ┌─────────────────┐
│ Create │ │ Generate │ │ Update Metadata │
│ Token ├───►│ ATA ├───►│ with Metaplex │
└──────────┘ └──────────────┘ └─────────────────┘

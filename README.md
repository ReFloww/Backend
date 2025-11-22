# ReFlow Backend

Backend service for the ReFlow P2P lending tokenization platform.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Viem (Mantle Network)
- **Indexing**: Ponder (Stub)

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database

## Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Environment Configuration**

    Copy `.env.example` to `.env` and update the `DATABASE_URL`.

    ```bash
    cp .env.example .env
    ```

3.  **Database Setup**

    Run migrations to create the database schema.

    ```bash
    npx prisma migrate dev --name init
    ```

    Generate the Prisma client.

    ```bash
    npx prisma generate
    ```

4.  **Running the Application**

    ```bash
    # Development
    npm run start:dev

    # Production Build
    npm run build
    npm run start:prod
    ```

## API Endpoints

### Market
- `POST /contracts` - Create a new contract
- `GET /contracts` - List all contracts
- `POST /products` - Create a new product (requires contractId)
- `GET /products` - List all products

### Product Detail
- `GET /product-detail/:id` - Get product details with contract info

### Stubs
- `GET /dashboard`
- `GET /portfolio`
- `GET /history`

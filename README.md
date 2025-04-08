
# FX Rate and Wallet Service

## Overview

This is a NestJS-based service that enables users to manage wallets, convert between currencies using real-time FX rates, fund their wallets, and trade currencies. Redis is used for caching FX rates, and Docker is configured to run Redis as a service.

---

## Setup Instructions

### Prerequisites
1. **Node.js** (v16 or above)
2. **Docker** (for running Redis)
3. **PostgreSQL** (for database management)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/OlamidotunIY/fx-trading-app.git
   cd fx-trading-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and update the configuration values:
   - **Database credentials**
   - **Email & Password**

4. Run Redis using Docker:
   ```bash
   docker-compose up -d
   ```

5. Start the application in development mode:
   ```bash
   npm run start:dev
   ```

6. Access the Swagger API documentation at:
   ```
   http://localhost:3000/api/docs
   ```

---

## Key Assumptions

1. Supported currencies are predefined and managed via the `SupportedCurrency` enum.
2. Redis is used for caching FX rates with a TTL of 1 hour to optimize API performance.
3. User authentication is required for wallet and transaction operations.
4. Rates are refreshed automatically every 10 minutes using a scheduled cron job.

---

## Endpoints

### Authentication
- **POST** `/auth/register`: Register a user and trigger OTP email.
- **POST** `/auth/verify`: Verify OTP and activate account.

### Wallet
- **GET** `/wallet`: Get user wallet balances by currency.
- **POST** `/wallet/fund`: Fund wallet in NGN or other currencies.
- **POST** `/wallet/convert`: Convert between currencies using real-time FX rates.
- **POST** `/wallet/trade`: Trade Naira with other currencies and vice versa.

### FX Rates
- **GET** `/fx/rates`: Retrieve current FX rates for supported currency pairs.

### Transactions
- **GET** `/transactions`: View transaction history.

---

## API Documentation

- Swagger is integrated into the project for API documentation.
- Visit `http://localhost:3000/api/docs` after starting the application to explore the API documentation.

---

## Summary of Architectural Decisions

1. **Modular Design**: The project is structured into distinct modules for scalability.
2. **Redis Integration**: Redis is utilized for caching FX rates to minimize external API calls.
3. **Scheduled Tasks**: Cron jobs are employed to refresh FX rates periodically.
4. **Entity-Relationship Management**: TypeORM is used to manage the database schema and relations.

---

## Testing

- Unit tests and integration tests are included for critical logic.
- To run the tests:
  ```bash
  npm run test
  ```

# FX Rate and Wallet Service

## Overview

The FX Rate and Wallet Service is a NestJS-based application that allows users to:

- Manage multiple wallets in different currencies.
- Convert currencies using real-time FX rates.
- Fund wallets and trade currencies seamlessly.

The service integrates **Redis** for caching FX rates and uses **Docker** to run Redis as a service.

---

## Setup Instructions

### Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v16 or above)
2. **Docker** (for running Redis)
3. **PostgreSQL** (for database management)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/OlamidotunIY/fx-trading-app.git
   cd fx-trading-app
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`.
   - Update the following configurations:
     - Database credentials
     - Email and password

4. Start Redis using Docker:
   ```bash
   docker-compose up -d
   ```

5. Start the application in development mode:
   ```bash
   npm run start:dev
   ```

6. Access the Swagger API documentation:
   - Navigate to `http://localhost:3000/api/docs`.

---

## Key Features and Assumptions

### FX Rates

- FX rates are fetched from an external API every 10 minutes.
- Rates are cached in Redis with a 1-hour expiration time to optimize API usage.
- Only supported currencies (e.g., NGN, USD, EUR) are available for transactions.

### Wallet Design

- Each user can create multiple wallets, one for each currency.
- Wallet balances are stored with a precision of up to 2 decimal places.
- Transactions are atomic, ensuring data consistency.

### Transaction Management

- Transactions are verified using unique IDs to prevent duplicates.
- Idempotency is maintained for retries and handling network failures.

### Scalability Considerations

- **Caching**: Redis reduces external API calls for FX rates.
- **Database Optimization**: Indexing and partitioning improve query performance.
- **Load Balancing**: Kubernetes and load balancers ensure high availability.
- **Microservices**: Separate modules for transactions, wallets, and FX rates.
- **Monitoring**: Prometheus and Grafana provide real-time monitoring and alerts.

---

## Testing

### Recommended Test Areas

1. **Wallet Balance**: Validate accurate addition and subtraction of funds.
2. **Currency Conversion**: Test the logic for rate calculations.
3. **Transaction Management**: Verify prevention of duplicates and handling retries.

### Running Tests

- To execute the test suite:
  ```bash
  npm run test
  ```

---

## Endpoints Overview

### Authentication

- **POST** `/auth/register` - Register a user and send an OTP email.
- **POST** `/auth/verify` - Verify the OTP and activate the account.

### Wallet Management

- **GET** `/wallet` - Retrieve wallet balances by currency.
- **POST** `/wallet/fund` - Fund wallets in NGN or other supported currencies.
- **POST** `/wallet/convert` - Convert funds between currencies.
- **POST** `/wallet/trade` - Trade Naira for other currencies and vice versa.

### FX Rates

- **GET** `/fx/rates` - Fetch the latest FX rates for supported currency pairs.

### Transactions

- **GET** `/transactions` - View the user's transaction history.

---

## Architectural Highlights

1. **Modular Design**: Organized modules for scalability and maintainability.
2. **Redis Integration**: Improves efficiency by caching FX rates.
3. **Cron Jobs**: Periodically refresh FX rates.
4. **TypeORM**: Manages database schemas and relationships.

---

## API Documentation

Swagger is integrated for comprehensive API documentation.

- Visit `http://localhost:3000/api/docs` to explore the endpoints and their details.


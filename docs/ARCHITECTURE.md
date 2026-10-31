# Architecture — Monthly Finance Tracker

## Overview
- `frontend/`: React + TypeScript SPA.
- `backend/`: Express REST API.
- MySQL: persistent relational storage.
- Sequelize: models, query layer, migrations.
- Nodemailer: email verification, password reset, optional notifications.
- Receipt storage: local private storage for development; use private object storage for production.

## Request flow
React page -> React Query hook -> Axios API client -> Express route -> authentication/validation middleware -> controller -> service -> Sequelize model -> MySQL.

Controllers should remain thin. Put financial calculations and multi-record operations in services. Scope every query to the authenticated user.

## Data rules
- Amounts stored as integer minor units or MySQL DECIMAL; never JS floating-point currency arithmetic.
- A transfer is not income or expense.
- Opening balances are separate from transaction flow.
- Analytics are aggregated on the server.
- Use database transactions for transfers and other multi-row operations.

## Authentication
Prefer secure HttpOnly cookie sessions with high-entropy random tokens stored hashed in the database, or a carefully designed JWT cookie approach. Use bcrypt/bcryptjs or Argon2 for passwords. Apply rate limits, safe cookies, CSRF/origin protections, and strict CORS.

## Environments
Use `.env.example` files with placeholders. Keep real `.env`, secrets, and uploaded receipts out of Git. Use Sequelize migrations for schema changes.

# API Contract — Initial Plan

Base path: `/api/v1`

## Response conventions
Success:
```json
{ "success": true, "data": {} }
```
Failure:
```json
{
  "success": false,
  "message": "A helpful message",
  "errors": []
}
```

Use consistent HTTP status codes. Never return stack traces or secret values.

## Authentication
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/logout`
- GET `/auth/me`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`
- POST `/auth/verify-email`

## Transactions
- GET/POST `/transactions`
- GET/PATCH/DELETE `/transactions/:id`
- GET `/transactions/export`
- POST `/transactions/import` (optional)

List filters: `from`, `to`, `type`, `categoryId`, `accountId`, `search`, `page`, `limit`, `sortBy`, `sortOrder`.

## Accounts and categories
- GET/POST `/accounts`
- GET/PATCH/DELETE `/accounts/:id`
- GET/POST `/categories`
- PATCH/DELETE `/categories/:id`

## Budgets, recurring transactions, and goals
- GET/POST `/budgets`
- PATCH/DELETE `/budgets/:id`
- GET/POST `/recurring-transactions`
- PATCH/DELETE `/recurring-transactions/:id`
- GET/POST `/goals`
- GET/PATCH/DELETE `/goals/:id`
- POST `/goals/:id/contributions`

## Analytics
- GET `/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`
- GET `/analytics/monthly-trend?months=12`
- GET `/analytics/category-breakdown?from=YYYY-MM-DD&to=YYYY-MM-DD`
- GET `/analytics/budget-performance?month=YYYY-MM`
- GET `/analytics/top-expenses?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Settings
- GET/PATCH `/settings/profile`
- GET/PATCH `/settings/preferences`
- POST `/account/export`
- DELETE `/account`

All dates, filters, pagination, sort fields, and payloads must be validated. The user identity must come from authentication middleware, never a client-supplied userId.

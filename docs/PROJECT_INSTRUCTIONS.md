# Monthly Finance Tracker — Project Instructions

## 1. Product goal
Build a secure, responsive personal finance application for tracking income, expenses, budgets, accounts, recurring transactions, savings goals, and monthly financial analytics.

The application is a personal record-keeping and planning tool, not a bank and not a financial-advice service.

## 2. Required stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- React Router DOM
- Axios
- TanStack React Query
- React Hook Form + Zod
- Recharts for analytics
- date-fns for date utilities
- lucide-react for icons
- Sonner for toast notifications
- TanStack Table for transaction tables (optional but recommended)
- clsx + tailwind-merge for class utilities
- shadcn/ui components where useful (optional)

### Backend
Use the supplied Node/Express stack:
- express, cors, cookie-parser, compression, dotenv, morgan
- express-validator
- mysql2 + sequelize
- date-fns
- multer for optional receipt uploads
- nodemailer for email notifications
- sequelize-cli for migrations and seeders
- nodemon for development

Recommended additions:
- helmet: HTTP security headers
- express-rate-limit: protect login and sensitive endpoints
- bcryptjs: password hashing (do not use the provided custom HMAC password helper for new passwords)
- jsonwebtoken OR opaque random session tokens stored hashed in the database. Prefer secure, HttpOnly cookie sessions for this app.
- express-session is optional if using its compatible persistent store; do not use the default in-memory store in production.
- zod is optional on backend; express-validator is already in the requested stack.
- pino or winston is optional; morgan is sufficient for a small app.
- csv-stringify or a carefully tested CSV utility for exports.
- sharp is optional if receipt images need image processing.

Install only dependencies that are actually used. Check package compatibility and current versions at implementation time.

## 3. Suggested project structure

finance-tracker/
  frontend/
    src/
      app/
        router.tsx
        queryClient.ts
      components/
        layout/
        common/
        charts/
        forms/
        transactions/
      features/
        auth/
        dashboard/
        transactions/
        categories/
        budgets/
        accounts/
        goals/
        recurring/
        reports/
        settings/
      hooks/
      lib/
        api.ts
        utils.ts
        formatters.ts
      pages/
      types/
      styles/
      main.tsx
  backend/
    src/
      app.js
      server.js
      config/
        database.js
        env.js
      controllers/
      middlewares/
      models/
      routes/
      services/
      validators/
      utils/
      jobs/
      uploads/              # never commit user uploads
    migrations/
    seeders/
    config/
      config.json           # use env variables; never commit real secrets
    tests/
  docs/
    ARCHITECTURE.md
    API.md
    DATABASE.md
    SECURITY.md

## 4. Core features

### Authentication and account
- Register, sign in, sign out, current-user endpoint.
- Email verification and password reset via Nodemailer.
- Secure session cookies: HttpOnly, Secure in production, SameSite appropriate to deployment.
- Rate-limit authentication routes.
- Never store passwords or session tokens in plaintext.
- Support account deletion and data export.
- If using cookie authentication, protect state-changing requests against CSRF using an appropriate strategy and strict CORS/origin checks.

### Dashboard
- Selected month and year, with previous/next month navigation.
- Total income, total expenses, net cash flow, savings rate.
- Month-over-month comparisons.
- Spending by category chart.
- Income vs expense chart by month.
- Recent transactions.
- Budget progress and approaching/over-budget alerts.
- Upcoming recurring transactions.
- Savings-goal progress.
- Clear empty states when no records exist.

### Transactions
- Income, expense, and transfer transaction types.
- Amount, date, category, account, payee/merchant, note, tags, payment method.
- Optional receipt attachment.
- Create, read, update, delete with confirmation and undo where feasible.
- Search, sorting, pagination, date/category/account/type filters.
- CSV export and import with validation and duplicate detection.
- Soft-delete only if the product needs recovery/audit history; otherwise use explicit deletion policy.
- Store money as integer minor units (e.g. paisa) or DECIMAL in MySQL; never use floating-point math for financial amounts.
- Store transaction date separately from timestamps and define timezone behavior.

### Categories and accounts
- Custom income and expense categories with colors/icons.
- Default categories supplied by seeders.
- Accounts/wallets: cash, bank, mobile wallet, card, other.
- Opening balance and current balance derived from opening balance plus posted transactions.
- Transfers between accounts must create a linked transfer pair or one transfer entity with source/destination accounts; never count transfers as income or expense.
- Do not allow a user to access another user's records.

### Budgets
- Monthly budgets by category and optional overall spending limit.
- Spent, remaining, percentage used.
- Alerts at configurable thresholds, e.g. 80%, 100%.
- Define whether a budget is based on transaction date and only posted expense transactions.
- Budget calculations must use server-side aggregation and consistent rules.

### Recurring transactions
- Daily, weekly, monthly, yearly/custom recurrence.
- Start date, optional end date, next occurrence, active/paused state.
- Generate occurrences idempotently; never create duplicates if a job retries.
- Allow review/confirmation before posting if desired.
- Use a scheduled job only when required; do not rely on the browser being open.

### Savings goals
- Name, target amount, current saved amount, target date, status.
- Progress indicator and contribution history.
- Clearly define how contributions relate to accounts and transfers so they are not double-counted as expenses.

### Analytics and reports
- Monthly income, expenses, net cash flow, savings rate.
- Daily or weekly trend within a month.
- Category breakdown and top categories.
- Month-over-month and year-over-year comparisons.
- Budget vs actual.
- Account balances and cash-flow summary.
- Largest transactions and recurring cost summary.
- Filters by period, account, category, transaction type.
- Download CSV; PDF report is optional.
- Accessible chart labels, tooltips, legends, and a useful tabular alternative.
- Avoid misleading charts: explain whether totals are posted transactions and how transfers/refunds are treated.

### Additional useful features
- Notes and tags.
- Quick-add transaction.
- Global search.
- Dark/light theme.
- Responsive mobile layout.
- Notification preferences.
- Data backup/export.
- Audit metadata (createdAt/updatedAt; consider audit log for sensitive edits).
- Optional multi-currency only if conversion rules, original currency, exchange rate, and reporting currency are explicitly designed. Start with one default currency (e.g. BDT) and store it in user settings.
- Optional recurring reminders, bill due dates, debt/loan tracking, and household sharing can be future phases rather than MVP.

## 5. Financial calculation rules
Document and test these definitions:
- Income total = sum of posted income transactions for the selected period.
- Expense total = sum of posted expense transactions for the selected period, with refunds handled by an explicit policy.
- Net cash flow = income - expenses.
- Savings rate = (income - expenses) / income * 100, when income > 0; otherwise display N/A.
- Transfers are excluded from income and expense totals.
- Opening balances are not transactions in monthly income/expense analytics.
- Use an explicit date range [start, end) in queries to avoid end-of-day bugs.
- Use server-side aggregation with parameterized/ORM queries.
- Do not calculate totals from only the currently visible page of transactions.

## 6. Suggested data model
Use Sequelize models and migrations. Add foreign keys, indexes, constraints, and timestamps.

User:
- id UUID or BIGINT primary key
- name, email (unique), passwordHash
- emailVerifiedAt, createdAt, updatedAt

Session (if using opaque sessions):
- id, userId, tokenHash, expiresAt, revokedAt, createdAt

Account:
- id, userId, name, type, currency, openingBalanceMinor, isArchived

Category:
- id, userId nullable for system defaults, name, type (income/expense), color, icon, isArchived

Transaction:
- id, userId, accountId, categoryId nullable where appropriate
- type (income/expense/transfer)
- amountMinor as BIGINT, currency
- transactionDate DATE
- description, payee, paymentMethod, notes
- transferGroupId nullable
- receiptPath nullable
- status (posted/draft) if drafts are supported
- createdAt, updatedAt

Budget:
- id, userId, categoryId nullable for overall budget
- month (YYYY-MM-01 DATE), limitMinor, alertThreshold
- unique user/category/month combination, accounting for nullable category design

RecurringTransaction:
- id, userId, accountId, categoryId, type, amountMinor
- frequency, interval, startDate, endDate, nextOccurrence, isActive
- lastGeneratedOccurrence or unique occurrence keys to ensure idempotency

SavingsGoal:
- id, userId, name, targetAmountMinor, currentAmountMinor or a contributions ledger
- targetDate, status

SavingsGoalContribution (recommended):
- id, goalId, userId, amountMinor, contributionDate, accountId nullable, note

PasswordResetToken / EmailVerificationToken:
- store token hashes, expiry, usedAt.

Receipt files should be stored outside publicly served source folders or in object storage; keep only a safe storage key/path in the database. Validate file signature/content, size, and authorization.

## 7. API design
Prefix all endpoints with /api/v1. Use consistent JSON responses and central error handling.

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET  /auth/me
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-email

Transactions:
- GET    /transactions
- POST   /transactions
- GET    /transactions/:id
- PATCH  /transactions/:id
- DELETE /transactions/:id
- GET    /transactions/export
- POST   /transactions/import (optional)

Categories:
- GET/POST /categories
- PATCH/DELETE /categories/:id

Accounts:
- GET/POST /accounts
- GET/PATCH/DELETE /accounts/:id

Budgets:
- GET/POST /budgets
- PATCH/DELETE /budgets/:id

Recurring:
- GET/POST /recurring-transactions
- PATCH/DELETE /recurring-transactions/:id

Goals:
- GET/POST /goals
- GET/PATCH/DELETE /goals/:id
- POST /goals/:id/contributions

Analytics:
- GET /analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /analytics/monthly-trend?months=12
- GET /analytics/category-breakdown?from=...&to=...
- GET /analytics/budget-performance?month=YYYY-MM
- GET /analytics/top-expenses?from=...&to=...

Settings:
- GET/PATCH /settings/profile
- GET/PATCH /settings/preferences
- POST /account/export
- DELETE /account

Use pagination for lists (page, limit), allowlisted sort fields, validated filters, and stable response contracts. Never accept userId from the request body as authorization; derive it from the authenticated identity.

## 8. Frontend requirements
- Use React Query for server state and cache invalidation.
- Use Axios through a single configured instance in src/lib/api.ts.
- Keep API types in a shared frontend types directory.
- Use React Hook Form + Zod for forms.
- Use Recharts for responsive charts.
- Use date-fns for date operations.
- Use React Router loaders/layouts or protected route components consistently.
- Build reusable loading, error, empty, and confirmation states.
- Do not duplicate derived totals across components; use analytics API responses.
- Set query keys by feature and filter parameters.
- Use query invalidation after mutations.
- Use error boundaries for page-level failures.
- Keep secrets out of frontend environment variables. VITE_ variables are public.
- For cookie sessions, configure Axios with `withCredentials: true`, set a safe base URL, and configure backend CORS/cookies accordingly.

## 9. Backend security and quality
- Use bcrypt/bcryptjs password hashing (argon2 is also good if supported and maintained).
- Do not use the sample helper's custom HMAC construction as password hashing. Do not use a fixed fallback secret.
- Never log passwords, cookies, session tokens, reset tokens, or financial details unnecessarily.
- Validate and normalize all inputs.
- Use Sequelize migrations; avoid `sequelize.sync({ alter: true })` in production.
- Use transactions for multi-record changes such as transfers and goal contributions.
- Use ownership-scoped queries for every user-owned record.
- Add Helmet, rate limits, strict CORS, safe cookie settings, and CSRF protections as appropriate.
- Centralize 404 and error handlers; do not send raw stack traces to clients.
- Validate upload size and content; MIME type alone is not trustworthy.
- Do not use original file names directly in storage paths.
- Use environment variables and `.env.example`; keep `.env` and real credentials out of Git.
- Avoid committing the provided example credentials from config.json.
- Use UTC timestamps and a documented user timezone policy.
- Add automated tests for financial calculations, authorization, and transfer handling.

## 10. Development phases
Phase 1 — Foundation:
- Repository, environment config, DB connection, migrations, error handling.
- Auth, sessions, account settings.
- Categories and accounts.
- Transactions CRUD and filters.

Phase 2 — Financial planning:
- Dashboard and analytics.
- Budgets and alerts.
- CSV export.

Phase 3 — Automation:
- Recurring transactions.
- Savings goals.
- Email notifications.
- Receipt uploads.

Phase 4 — Polish and reliability:
- CSV import, report downloads, accessibility, mobile UX.
- Automated tests, security review, performance indexes.
- Deployment, backups, monitoring, recovery test.

## 11. Definition of done
A feature is not complete until:
- Inputs are validated on the server.
- Authorization/ownership is enforced.
- Loading, empty, success, and error states exist.
- Tests cover important calculations and edge cases.
- The UI is responsive and accessible.
- Migrations and documentation are updated.
- No secrets or private uploads are committed.
- Relevant lint, type-check, test, and build commands pass.

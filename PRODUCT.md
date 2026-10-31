# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite (Tailwind CSS, TanStack Query, TanStack Table, Recharts, React Hook Form, Zod, Lucide icons, Sonner) with Node.js/Express + MySQL (Sequelize ORM) backend.

## Users

Individuals managing personal cash flow, monthly budgets, accounts (cash, bank accounts, mobile financial services/wallets), recurring bills, and savings goals, with primary defaults for Bangladeshi Taka (BDT) and extensible to user-configured currencies.

## Product Purpose

Provide a secure, responsive, high-integrity personal finance application for tracking income, expenses, budgets, accounts, recurring transactions, savings goals, and monthly financial analytics. It serves strictly as a personal record-keeping and planning tool, not a bank or financial-advice platform.

## Positioning

Strict financial accuracy and integrity: zero floating-point arithmetic (amounts stored as integer minor units e.g. paisa or MySQL DECIMAL), strict transfer-pair linking that never distorts income or expense totals, server-side data aggregations, and strict user-scoped multi-tenancy.

## Operating Context

- Environments: Responsive web application for mobile and desktop browser usage.
- Account types: Cash, bank accounts, mobile financial services (e.g. bKash, Nagad), credit/debit cards.
- Workflows: Quick daily logging of income/expenses/transfers, tracking category budget thresholds (80%, 100%), reviewing month-over-month cash flow and savings rate, scheduled recurring bills, and goal contributions.

## Capabilities and Constraints

- Capabilities:
  - Income, expense, and transfer transactions with date, category, account, payee, payment method, notes, tags, and receipt attachment.
  - Multi-account management with opening balances and posted transaction balance derivations.
  - Category-based monthly budgets with alert thresholds and server-aggregated spent/remaining calculations.
  - Recurring transaction scheduling (daily, weekly, monthly, yearly) with idempotent generation.
  - Savings goals with dedicated contribution tracking.
  - Monthly financial analytics: net cash flow, savings rate ((income - expenses) / income * 100), category breakdowns, and trend charts.
  - CSV export and import with validation.
  - Secure authentication (HttpOnly cookie sessions / JWT, bcrypt/Argon2 hashing, rate limiting, CSRF protections).
- Constraints:
  - Transfers are strictly excluded from income and expense calculations.
  - Opening balances are excluded from monthly income/expense flows.
  - All financial amounts calculated using integer minor units or DECIMAL, never JavaScript floating-point numbers.
  - Strict user-isolation: queries and records must be scoped to the authenticated user.
  - Default currency is BDT (Bangladeshi Taka).

## Brand Commitments

- Name: Hisab (Monthly Finance Tracker).
- Voice & Tone: Clear, disciplined, trustworthy, precise, and unobtrusive.

## Evidence on Hand

- Detailed specifications in `PROJECT_INSTRUCTIONS.md`.
- Architecture, API, and Security guides in `docs/ARCHITECTURE.md`, `docs/API.md`, and `docs/SECURITY.md`.
- CLI commands reference in `CLI_COMMANDS.bh`.
- No mock data or visual assets fabricated; initial seeding defined via Sequelize seeders.

## Product Principles

1. Financial Integrity Above All: Calculations must be exact, server-aggregated, and resistant to rounding or floating-point anomalies.
2. Clear Separation of Concepts: Transfers move money between accounts without altering net income or expense; opening balances establish baseline wealth without distorting period cash flow.
3. Rapid Daily Logging with Deep Monthly Clarity: Make adding a transaction painless in seconds, while providing rich, actionable monthly insights on budgets and savings rates.
4. Privacy and Security First: User financial records are private, user-scoped, and protected with secure session management and rate limiting.

## Accessibility & Inclusion

- Responsive layout supporting both desktop screens and mobile viewports.
- Accessible charts (Recharts) with descriptive labels, tooltips, legends, and tabular data alternatives.
- Clear error states, empty states, and toast notifications (Sonner).
- High-contrast, keyboard-navigable forms and tables.


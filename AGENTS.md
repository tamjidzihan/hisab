# AGENTS.md — Development Guidelines for Hisab

Welcome to the **Hisab (Monthly Finance Tracker)** project. This document serves as the persistent guide for AI agents and human contributors collaborating on this codebase.

---

## 1. Project Context & Design Guidance

- **Product Truth:** See [PRODUCT.md](PRODUCT.md) for users, purpose, positioning, financial calculation rules, and platform constraints.
- **Visual Authority:** See [DESIGN.md](DESIGN.md) for the "Draftsman's Ledger" design system (colors, typography, layout, depth, and Do's/Don'ts).
- **Core Skill:** Use **Impeccable** (`.agent/skills/impeccable/`) as the governing design and UX skill for all frontend development.

---

## 2. Core Design Direction: "The Draftsman's Ledger"

The application must feel like a premium, disciplined financial management instrument.

### Prioritize:
- **Financial Information Hierarchy:** Clean typography with prominent, readable monetary values.
- **The Tabular Numerals Invariant:** Every numeral representing money, percentages, dates, or rates must use `tabular-nums` (`font-variant-numeric: tabular-nums`).
- **Strict Semantic Color:**
  - Ground: Cool Drafting Canvas (`#f4f6f9`), Card Vellum (`#ffffff`), Steel Borders (`#d2d9e4`).
  - Text & Structure: Drafting Graphite (`#161d26`), Muted Blueprint Ink (`#64748b`).
  - State Semantics: Inflow Jade (`#059669`), Caliper Amber (`#d97706`), Limit Crimson (`#dc2626`), Transfer Cobalt (`#2563eb`).
- **Dimension Calipers:** Visual budget threshold notches (80% warning caliper, 100% hard limit caliper).
- **Tonal & Border Depth:** 1px drafting lines and tonal contrast instead of heavy, blurry drop shadows.
- **High-Density Usability:** Rapid daily logging and crisp desktop and mobile scanability.

### Avoid:
- Generic admin dashboard templates (purple/indigo SaaS boilerplate).
- Excessive nested card containers and heavy gradients.
- Overly rounded pill borders for major structural containers.
- Purely decorative animations or gamified elements.
- Floating-point calculations in client-side formatting.

---

## 3. Implementation Stages

Build incrementally and review each stage before proceeding:

1. **Stage 1: Application Shell & Navigation** (Header, responsive sidebar/nav rail, quick-entry trigger, theme tokens).
2. **Stage 2: Dashboard** (Month navigation, key summary metrics, cash flow, dimensioned budget calipers, recent transactions ledger).
3. **Stage 3: Transactions** (Ledger table, filters, sorting, search, transaction form with linked transfer pairs, receipt attachment).
4. **Stage 4: Accounts & Categories** (Account vault cards, opening balances, category icons/colors).
5. **Stage 5: Budgets** (Monthly category budgets, spending limits, caliper alerts).
6. **Stage 6: Analytics & Reports** (Recharts trend visualizations, category breakdown, month-over-month comparisons).
7. **Stage 7: Savings Goals** (Dedicated goal cards, contribution ledger, progress markers).
8. **Stage 8: Settings** (User profile, currency selection, notification thresholds, data export).

---

## 4. Impeccable Review Workflow

For each major page or feature:
1. `shape <page>`: Plan UX/UI before writing code.
2. **Implement:** Code adhering to [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md).
3. `critique <page>`: Heuristic UX review and visual scoring.
4. `audit <page>`: Accessibility, contrast, and layout quality checks.
5. `adapt <page>`: Responsive mobile/tablet verification.
6. `harden <page>`: Edge cases, zero-states, network errors, and long strings.
7. `polish <page>`: Final visual craft pass.

---

## 5. Technical Constraints

- **Stack:** React + TypeScript + Vite, Tailwind CSS, TanStack Query, React Router DOM, React Hook Form + Zod, Recharts, Lucide React, Sonner.
- **Monetary Integrity:** Always handle amounts in integer minor units (e.g. paisa/cents) or backend MySQL DECIMAL. Never perform floating-point arithmetic for balances or totals.
- **Zero Mock Drift:** Maintain real API client contracts (`/api/...`) scoped to the authenticated user.
- **Type Safety:** Maintain strict TypeScript with zero `any` shortcuts in financial models.
- **Verification:** Run type-checking (`tsc --noEmit`) and build checks (`npm run build`) before considering a stage complete.


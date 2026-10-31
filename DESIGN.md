---
name: Hisab
description: Disciplined personal finance tracking with draftsman-level structural integrity.
---

<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Hisab

## Overview

**Creative North Star: "The Draftsman's Ledger"**

Hisab approaches personal finance not as an abstract SaaS game or casual spending feed, but as intentional structural architecture. Every taka earned, spent, transferred, or saved is treated with drafting-table precision, dimensional accountability, and mathematical permanence. The visual atmosphere evokes the clarity of an architect's working drawing: calm, structured, high-density, and disciplined.

The material character is defined by cool drafting-linen grounds, technical graphite ink, crisp geometric borders, and measured amber milestones. Imagery is non-decorative; visual energy comes strictly from data relationships, alignment grids, and dimensional progress indicators. Motion is purposeful, mechanical, and instantaneous—transitions act like crisp drafting tools rather than playful bounces.

**Key Characteristics:**

- Structural precision: crisp tabular alignment, explicit border lines, and zero floating-point ambiguities.
- Functional color discipline: restrained palette where color carries strict operational meaning.
- High-efficiency density: compact layout designed for rapid daily logging and clear monthly scanning.
- Caliper thresholds: progress bars accented with dimension notches for budget limits and savings targets.

## Colors

The palette follows a committed architectural drafting strategy: cool linen neutrals anchored by graphite ink, with high-intent accents for positive cash flow, threshold warnings, and critical budget limits.

### Primary

- **Drafting Graphite** (`#161d26`): The primary structural color for text, headers, and major frame outlines.
- **Cool Drafting Ground** (`#f4f6f9`): The base canvas, tinted like blueprint vellum rather than harsh sterile white.

### Secondary

- **Caliper Amber** (`#d97706`): Used for warning thresholds (e.g. 80% budget consumption) and active target milestones.

### Neutral

- **Drafting Steel Border** (`#d2d9e4`): Technical hairline dividing rules and table borders.
- **Card Vellum** (`#ffffff`): Foreground container surface maintaining clear contrast against the cool ground.
- **Muted Blueprint Ink** (`#64748b`): Secondary labels, metadata, dates, and account badges.

### Semantic State Roles

- **Balance Inflow Jade** (`#059669`): Positive net flow, income transactions, and goal achievements.
- **Limit Crimson** (`#dc2626`): Over-budget alerts (100%+), critical spending warnings, and expense deductions.
- **Transfer Cobalt** (`#2563eb`): Neutral inter-account transfers and balance reallocations.

### Named Rules

**The Strict Semantic Color Rule.** Color is never applied purely for decoration. Every hue on screen must communicate direction (income vs. expense), state (safe vs. warning vs. over-budget), or system identity (transfer vs. cash flow).

## Typography

**Display Font:** Geometric Grotesk (e.g. Space Grotesk / Inter tight) [to be resolved during implementation]
**Body Font:** Precision Sans (e.g. Inter / Geist) [to be resolved during implementation]
**Label/Mono Font:** Tabular Monospace (e.g. JetBrains Mono / Geist Mono) [to be resolved during implementation]

**Character:** Technical, clean, and exact. All financial numbers and monetary figures strictly use tabular monospaced numerals (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during sorting, updates, and columnar inspection.

### Hierarchy

- **Display** (Bold, ~2rem / 32px, line-height 1.2): Primary financial summaries, net cash flow, and monthly balance totals.
- **Headline** (Semi-bold, ~1.25rem / 20px, line-height 1.3): Account section headers, budget categories, and modal titles.
- **Title** (Medium, ~1rem / 16px, line-height 1.4): Transaction merchant/payee labels and metric card headers.
- **Body** (Regular, ~0.875rem / 14px, line-height 1.5): Standard ledger records, notes, and general descriptions.
- **Label** (Medium/Mono, ~0.75rem / 12px, letter-spacing 0.05em): Table column headers, status tags, and timestamp metadata.

### Named Rules

**The Tabular Numerals Invariant.** Any numeral representing currency, account balance, percentage, or date must render with tabular figures. Fluid proportional figures are forbidden in financial readouts.

## Layout

The spatial model relies on a balanced multi-column grid that mirrors an architectural drawing sheet. On desktop viewports, the primary interface organizes into a stable three-zone structure: an account vault rail on the left, a primary monthly ledger and cash-flow core in the center, and budget caliper metrics on the right.

- **Grid & Rhythm:** Standard 8px spatial rhythm with compact 4px increments for dense tabular rows.
- **Container Strategy:** Structural panels with visible borders rather than floating drop-shadow islands.
- **Responsive Behavior:** Transitions cleanly from three columns on wide screens to a prioritized stacked single-column flow on mobile viewports, keeping the quick-entry action immediately reachable.

## Elevation & Depth

Depth is conveyed through tonal layering and structural rules rather than ambient drop shadows. Surfaces rest flat on the drafting canvas.

### Named Rules

**The Surface-Tonal Depth Rule.** Depth is created through surface tone contrast (`#f4f6f9` ground to `#ffffff` panels) and 1px drafting borders (`#d2d9e4`). Diffuse, blurry drop shadows are prohibited; subtle crisp offset shadows appear only on interactive popovers, dropdowns, and modals.

## Shapes

Forms are crisp, disciplined, and slightly structured:

- **Corner Radius:** Subtle rounding (4px to 6px) that softens container edges without losing geometric rigor. Pill shapes are reserved solely for status chips and active filter tags.
- **Border Treatment:** Consistent 1px solid borders (`#d2d9e4`) delineating table cells and container perimeters.

## Do's and Don'ts

### Do:

- **Do** align monetary figures to the right in all tables and ledgers, with currency signs and minor units aligned.
- **Do** visually separate transfers from income and expenses with distinctive transfer linking badges.
- **Do** display budget thresholds with physical caliper notches (e.g. tick marks at 80% and 100%).
- **Do** provide clear empty states with one-click creation triggers when an account or month has no posted transactions.

### Don't:

- **Don't** use decorative gradients, neon glows, or arbitrary accent colors unrelated to transaction type or budget state.
- **Don't** use floating-point numbers in formatting; preserve integer minor units through formatters.
- **Don't** obscure table columns on desktop; maintain high-density scanability.
- **Don't** allow celebratory or gamified animations; maintain a dignified, trustworthy tool demeanor.

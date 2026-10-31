---
name: Hisab
description: Disciplined personal finance tracking with draftsman-level structural integrity.
colors:
  graphite: "#161d26"
  canvas: "#f4f6f9"
  vellum: "#ffffff"
  border-steel: "#d2d9e4"
  blueprint: "#64748b"
  caliper-amber: "#d97706"
  inflow-jade: "#059669"
  limit-crimson: "#dc2626"
  transfer-cobalt: "#2563eb"
typography:
  display:
    fontFamily: "var(--font-sans)"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-sans)"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "var(--font-sans)"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "var(--font-sans)"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-mono)"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.vellum}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.blueprint}"
  button-secondary:
    backgroundColor: "{colors.vellum}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
---

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

**Display Font:** Inter / System UI
**Body Font:** Inter / System UI
**Label/Mono Font:** JetBrains Mono / Geist Mono / UI Monospace

**Character:** Technical, clean, and exact. All financial numbers and monetary figures strictly use tabular monospaced numerals (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during sorting, updates, and columnar inspection.

### Hierarchy
- **Display** (Bold, `2rem`, line-height `1.2`): Primary financial summaries, net cash flow, and monthly balance totals.
- **Headline** (Semi-bold, `1.25rem`, line-height `1.3`): Account section headers, budget categories, and modal titles.
- **Title** (Medium, `1rem`, line-height `1.4`): Transaction merchant/payee labels and metric card headers.
- **Body** (Regular, `0.875rem`, line-height `1.5`): Standard ledger records, notes, and general descriptions.
- **Label** (Medium/Mono, `0.75rem`, letter-spacing `0.05em`): Table column headers, status tags, and timestamp metadata.

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

## Components

### Buttons
- **Shape:** Subtle rounded corner (`rounded.sm`, 4px).
- **Primary:** Drafting Graphite background (`#161d26`), Vellum text (`#ffffff`), `px-4 py-2` padding, font-medium.
- **Hover / Focus:** Transitions to Muted Blueprint Ink (`#64748b`), focus ring with 2px steel offset.
- **Secondary / Ghost:** Card Vellum (`#ffffff`) background with 1px Drafting Steel Border (`#d2d9e4`), Graphite text.

### Chips & Badges
- **Style:** Compact height (22px), `rounded.pill`, uppercase tracking `0.05em`, tabular font.
- **Inflow Badge:** Jade background tint (`#ecfdf5`), Jade text (`#059669`), subtle border.
- **Expense Badge:** Neutral slate tint (`#f1f5f9`), Slate text (`#475569`).
- **Transfer Badge:** Cobalt tint (`#eff6ff`), Cobalt text (`#2563eb`).

### Cards & Containers
- **Corner Style:** Crisp 6px radius (`rounded.md`).
- **Background:** Card Vellum (`#ffffff`).
- **Border:** 1px solid Drafting Steel (`#d2d9e4`).
- **Shadow:** Flat (`none`) at rest; tonal elevation only.
- **Internal Padding:** `p-4` or `p-5`.

### Inputs & Fields
- **Style:** 1px border (`#d2d9e4`), background `#ffffff`, radius 4px (`rounded.sm`), text `#161d26`.
- **Focus:** Sharp 1px outline in Drafting Graphite (`#161d26`), zero blurry glow.
- **Error:** Limit Crimson border (`#dc2626`) with concise helper text below.

### Navigation
- **Style:** Disciplined sidebar rail and clean top navigation header.
- **Active State:** Drafting Graphite indicator line on border, subtle vellum tonal highlight.

### Signature Component: Dimension Caliper
- **Description:** A structural progress indicator featuring drafting tick-marks at 80% (Warning Caliper) and 100% (Hard Limit Caliper). Color shifts dynamically from Jade (<80%) to Amber (80-99%) to Crimson (>=100%).

## Do's and Don'ts

### Do:
- **Do** align monetary figures to the right in all tables and ledgers, with currency signs and minor units aligned.
- **Do** visually separate transfers from income and expenses with distinctive transfer linking badges.
- **Do** display budget thresholds with physical caliper notches (tick marks at 80% and 100%).
- **Do** provide clear empty states with one-click creation triggers when an account or month has no posted transactions.

### Don't:
- **Don't** use decorative gradients, neon glows, or arbitrary accent colors unrelated to transaction type or budget state.
- **Don't** use floating-point numbers in formatting; preserve integer minor units through formatters.
- **Don't** obscure table columns on desktop; maintain high-density scanability.
- **Don't** allow celebratory or gamified animations; maintain a dignified, trustworthy tool demeanor.

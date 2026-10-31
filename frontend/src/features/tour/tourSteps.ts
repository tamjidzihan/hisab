import type { TourStep, HowToTopic } from './types'

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-quick-log',
    title: 'Rapid Daily Logging',
    subtitle: 'Capture outflows, inflows, and internal transfers in seconds.',
    location: 'Top Navigation Header (Center-Right "Quick Log" Button)',
    route: '/',
    howTo: [
      'Click the "+ Quick Log" button at the top of any page.',
      'Select transaction type: Expense (Outflow), Income (Inflow), or Transfer.',
      'Enter the amount (automatically handled in integer paisa/minor units).',
      'Select the corresponding Account Vault and Expense Category, then click "Post to Ledger".',
    ],
    architectRule:
      'Transfers between your own vaults (e.g., Bank to bKash) are strictly linked pairs and never inflate your income or expense totals.',
    iconName: 'Plus',
  },
  {
    id: 'step-dashboard',
    title: 'Monthly Cash Flow & Periods',
    subtitle: 'Real-time overview of monthly inflows, burns, and net accumulation.',
    location: 'Main Dashboard (Top Month Navigator & Summary Row)',
    route: '/',
    howTo: [
      'Use the Month Navigator (< and > arrows) to browse past or future fiscal cycles.',
      'Inspect the Net Cash Flow card to verify whether your month is in surplus or deficit.',
      'Review the Cash Flow Trend chart to track your daily accumulation trajectory.',
    ],
    architectRule:
      'All balances and calculations are aggregated server-side to guarantee zero floating-point rounding errors.',
    iconName: 'LayoutDashboard',
  },
  {
    id: 'step-accounts',
    title: 'Account Vaults & Transfer Integrity',
    subtitle: 'Monitor liquid capital across Cash, Banks, and Mobile Wallets.',
    location: 'Sidebar Navigation → "Accounts & Vaults" (/accounts)',
    route: '/accounts',
    howTo: [
      'View individual vault balances (Cash Wallet, City Bank, bKash MFS, Nagad).',
      'Click "+ New Account Vault" to add accounts with initial opening balances.',
      'Click "Transfer Between Vaults" to shift money without disturbing period cash-flow metrics.',
    ],
    architectRule:
      'Opening balances establish your baseline net worth and are strictly separated from current monthly income.',
    iconName: 'Landmark',
  },
  {
    id: 'step-budgets',
    title: 'Dimension Calipers & Budget Discipline',
    subtitle: 'Physical threshold notches that prevent category overspending.',
    location: 'Sidebar Navigation → "Budgets & Calipers" (/budgets)',
    route: '/budgets',
    howTo: [
      'Set monthly maximum ceilings for categories like Groceries, Utilities, and Rent.',
      'Watch the physical caliper notches on progress bars: Amber at 80% and Crimson at 100%.',
      'Receive instant alerts when spending approaches or breaches your defined calipers.',
    ],
    architectRule:
      'Caliper thresholds give you advance warning before overspending occurs, keeping your monthly savings rate intact.',
    iconName: 'SlidersHorizontal',
  },
  {
    id: 'step-transactions',
    title: 'Audited Ledger & CSV Import/Export',
    subtitle: 'Searchable master ledger with full filtering and disaster recovery.',
    location: 'Sidebar Navigation → "Transactions" (/transactions)',
    route: '/transactions',
    howTo: [
      'Filter transactions by Vault, Category, Flow Type (Inflow/Outflow/Transfer), or Date Range.',
      'Search payees or descriptions in real-time with the tabular ledger search bar.',
      'Click "Import CSV" to upload bank or mobile wallet statements with automated schema mapping.',
      'Click "Export CSV" to download an audited copy of your ledger anytime.',
    ],
    architectRule:
      'Every record preserves integer minor units (paisa) and links reciprocal transfer IDs for total auditability.',
    iconName: 'Receipt',
  },
  {
    id: 'step-analytics',
    title: 'Financial Intelligence & Visual Reports',
    subtitle: 'Historical trends, category distribution, and budget variance.',
    location: 'Sidebar Navigation → "Analytics & Trends" (/analytics)',
    route: '/analytics',
    howTo: [
      'Switch between 6-Month, 12-Month, and Year-to-Date historical trajectory views.',
      'In "Expense Distribution by Category", use the toggle switch to swap between Donut view and the full tabular Share table.',
      'Examine the Budget vs. Actual Variance bars to evaluate category discipline over time.',
    ],
    architectRule:
      'Historical trends calculate your true savings rate: (Total Income - Total Expenses) / Total Income × 100.',
    iconName: 'BarChart3',
  },
  {
    id: 'step-settings',
    title: 'Vault Security & Data Sovereignty',
    subtitle: 'Currencies, notification thresholds, and full offline backups.',
    location: 'Sidebar Navigation → "Settings" (/settings) or Profile Menu',
    route: '/settings',
    howTo: [
      'Configure regional currency (default BDT ৳, USD $, EUR €, GBP £) and date format.',
      'Customize Caliper Alert thresholds (warning percentage, bill reminder lead days).',
      'Download full JSON disaster recovery archives under "Data Management & Backups".',
      'Inspect active workstation sessions and terminate remote connections on demand.',
    ],
    architectRule:
      'Your financial data is sovereign. Full JSON backups can be downloaded and stored offline with zero third-party lock-in.',
    iconName: 'Settings',
  },
]

export const HOW_TO_TOPICS: HowToTopic[] = [
  // Daily Logging
  {
    id: 'how-to-log',
    category: 'daily',
    question: 'How do I log a daily expense or income?',
    whereToFind: 'Top Header → "+ Quick Log" button or Transactions page',
    route: '/transactions',
    steps: [
      'Click the "+ Quick Log" button located at the top-right of your navigation bar.',
      'Select whether it is an Expense (Outflow) or Income (Inflow).',
      'Enter the amount (e.g. 350.00).',
      'Pick the Account Vault used (e.g., Cash Wallet or bKash) and the Category.',
      'Click "Post to Ledger". It immediately posts and updates all dashboard balances.',
    ],
    note: 'You can also log directly from the Transactions page using "+ New Transaction".',
  },
  {
    id: 'how-to-transfer',
    category: 'accounts',
    question: 'How do I transfer money between my accounts (e.g. Bank to bKash)?',
    whereToFind: 'Sidebar → Accounts & Vaults → "Transfer Between Vaults" button, or Quick Log',
    route: '/accounts',
    steps: [
      'Go to "Accounts & Vaults" from the sidebar.',
      'Click "Transfer Between Vaults" (or choose "Transfer" inside Quick Log).',
      'Select the Source Vault (e.g., City Bank) and the Destination Vault (e.g., bKash MFS).',
      'Enter the amount transferred and any optional fee/charge.',
      'Click "Execute Transfer". Two reciprocal linked records will be generated automatically.',
    ],
    note: 'Crucial rule: Transfers never count toward monthly expense or income totals!',
  },
  {
    id: 'how-to-create-budget',
    category: 'budgets',
    question: 'Where do I create or adjust monthly category budgets?',
    whereToFind: 'Sidebar → Budgets & Calipers → "+ Create Budget" button',
    route: '/budgets',
    steps: [
      'Navigate to "Budgets & Calipers" in the left sidebar navigation.',
      'Click "+ Create Budget" at the top right of the page.',
      'Select the expense category (e.g. Groceries & Dining) and enter your monthly limit in BDT.',
      'Click "Save Budget Limit".',
      'Your progress bar will immediately reflect current expenditures against the 80% and 100% caliper notches.',
    ],
    note: 'The caliper turns amber at 80% of your ceiling, and crimson if 100% is breached.',
  },
  {
    id: 'how-to-import-csv',
    category: 'transactions',
    question: 'How do I import my bank or bKash statement via CSV?',
    whereToFind: 'Sidebar → Transactions → "Import CSV" button',
    route: '/transactions',
    steps: [
      'Navigate to "Transactions" in the sidebar.',
      'Click "Import CSV" in the toolbar above the ledger table.',
      'Select your CSV statement from your computer, or download our sample CSV template.',
      'Review the parsed rows, date format, and account destination in the preview screen.',
      'Click "Confirm & Import to Ledger". All transactions will be verified in integer minor units.',
    ],
  },
  {
    id: 'how-to-export-data',
    category: 'transactions',
    question: 'Where can I export my financial data to CSV or JSON?',
    whereToFind: 'User Menu (Top-Right Avatar) → "Export Ledger (CSV)" or Settings → Data Management',
    route: '/settings',
    steps: [
      'For CSV: Click your user initials/avatar in the top header and click "Export Ledger (CSV)".',
      'For Complete System Backup: Go to "Settings" → "Data Management" tab.',
      'Click "Export Full JSON Archive". This downloads an encrypted snapshot of all transactions, accounts, budgets, and settings.',
    ],
    note: 'Full JSON backups can be used for offline cold storage or disaster recovery.',
  },
  {
    id: 'how-to-savings-goal',
    category: 'goals',
    question: 'Where do I set up and track my savings goals?',
    whereToFind: 'Sidebar → Savings Goals (/goals)',
    route: '/goals',
    steps: [
      'Navigate to "Savings Goals" in the sidebar.',
      'Click "+ New Savings Goal". Enter your goal title (e.g., Emergency Fund), target amount, and target deadline.',
      'To add savings to a goal: Click "Log Contribution" on any goal card.',
      'Select which account funded the contribution (e.g. Bank Account) and the contribution amount.',
    ],
  },
  {
    id: 'how-to-toggle-donut',
    category: 'analytics',
    question: 'How do I switch between the Donut Chart and Category Table?',
    whereToFind: 'Sidebar → Analytics & Trends → "Expense Distribution by Category" card',
    route: '/analytics',
    steps: [
      'Navigate to "Analytics & Trends" in the sidebar.',
      'Locate the "Expense Distribution by Category" card in the middle section.',
      'Look at the top-right corner of the card header: click "Donut" for the circular visual chart with side legend.',
      'Click "Table" to view the full tabular breakdown with exact minor unit spending and caliper share bars.',
    ],
  },
  {
    id: 'how-to-change-currency',
    category: 'settings',
    question: 'Where do I change my base currency or date format?',
    whereToFind: 'Sidebar → Settings → "Regional & Currency" tab',
    route: '/settings',
    steps: [
      'Navigate to "Settings" in the sidebar.',
      'Click the "Regional & Currency" tab.',
      'Select your preferred Base Currency (BDT ৳, USD $, EUR €, GBP £, INR ₹).',
      'Select your Date Format (e.g. DD MMM YYYY or YYYY-MM-DD).',
      'Click "Save Regional Configuration".',
    ],
  },
  {
    id: 'how-to-caliper-alerts',
    category: 'settings',
    question: 'How do I change the Caliper Alert thresholds (warning percentage)?',
    whereToFind: 'Sidebar → Settings → "Caliper Alerts" tab',
    route: '/settings',
    steps: [
      'Navigate to "Settings" in the sidebar.',
      'Click the "Caliper Alerts" tab.',
      'Adjust the Warning Threshold percentage (default 80%) and Hard Limit (default 100%).',
      'Set your Bill Reminder lead days (e.g. 3 days before due date).',
      'Click "Update Caliper Rules".',
    ],
  },
]


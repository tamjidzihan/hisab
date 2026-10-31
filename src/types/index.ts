export type TransactionType = 'income' | 'expense' | 'transfer'
export type AccountType = 'cash' | 'bank' | 'mobile_wallet' | 'card' | 'other'

export interface Transaction {
  id: string
  userId: string
  accountId: string
  accountName?: string
  categoryId: string | null
  categoryName?: string
  categoryColor?: string
  type: TransactionType
  amountMinor: number // Integer minor units (paisa)
  currency: string
  transactionDate: string // YYYY-MM-DD
  description: string
  payee?: string
  paymentMethod?: string
  transferGroupId?: string | null
  transferDestinationAccountId?: string | null
  transferDestinationAccountName?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  currency: string
  openingBalanceMinor: number
  currentBalanceMinor: number
  isArchived: boolean
  accountNumberMasked?: string
}

export interface Category {
  id: string
  userId: string | null // null for system defaults
  name: string
  type: 'income' | 'expense'
  color: string
  icon?: string
  isArchived: boolean
}

export interface Budget {
  id: string
  userId: string
  categoryId: string | null // null for overall monthly budget
  categoryName?: string
  categoryColor?: string
  month: string // YYYY-MM-01
  limitMinor: number
  spentMinor: number
  alertThreshold: number // e.g. 0.8 for 80%
}

export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmountMinor: number
  currentAmountMinor: number
  targetDate?: string
  status: 'active' | 'completed' | 'paused'
}

export interface RecurringTransaction {
  id: string
  userId: string
  name: string
  amountMinor: number
  type: TransactionType
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextOccurrence: string // YYYY-MM-DD
  isActive: boolean
}

export interface DashboardSummary {
  periodMonth: string // YYYY-MM
  totalIncomeMinor: number
  totalExpenseMinor: number
  netCashFlowMinor: number
  savingsRate: number | null
  previousMonthIncomeMinor: number
  previousMonthExpenseMinor: number
  accounts: Account[]
  budgets: Budget[]
  recentTransactions: Transaction[]
  upcomingRecurring: RecurringTransaction[]
  activeGoals: SavingsGoal[]
  monthlyCashFlowTrend: Array<{
    month: string // e.g. 'Jun', 'Jul', 'Aug'
    incomeMinor: number
    expenseMinor: number
  }>
  spendingByCategory: Array<{
    categoryName: string
    categoryColor: string
    spentMinor: number
    percentage: number
  }>
}


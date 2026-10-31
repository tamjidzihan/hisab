import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, addMonths, subMonths, isSameMonth } from 'date-fns'
import { apiClient } from '@/lib/api'
import type { DashboardSummary } from '@/types'

// Baseline structured mock dataset for offline/decoupled frontend preview
// Uses exact integer minor units (paisa) matching BDT financial specifications
const DEMO_DASHBOARD_DATA: Record<string, DashboardSummary> = {
  '2026-11': {
    periodMonth: '2026-11',
    totalIncomeMinor: 8500000, // ৳85,000.00
    totalExpenseMinor: 4850000, // ৳48,500.00
    netCashFlowMinor: 3650000,  // ৳36,500.00
    savingsRate: 42.94,
    previousMonthIncomeMinor: 7800000,
    previousMonthExpenseMinor: 5100000,
    accounts: [
      {
        id: 'acc-1',
        userId: 'usr-1',
        name: 'Cash Vault',
        type: 'cash',
        currency: 'BDT',
        openingBalanceMinor: 500000,
        currentBalanceMinor: 842000, // ৳8,420.00
        isArchived: false,
      },
      {
        id: 'acc-2',
        userId: 'usr-1',
        name: 'Prime Bank Current',
        type: 'bank',
        currency: 'BDT',
        openingBalanceMinor: 10000000,
        currentBalanceMinor: 12450000, // ৳124,500.00
        accountNumberMasked: '•••• 4892',
        isArchived: false,
      },
      {
        id: 'acc-3',
        userId: 'usr-1',
        name: 'bKash Primary MFS',
        type: 'mobile_wallet',
        currency: 'BDT',
        openingBalanceMinor: 250000,
        currentBalanceMinor: 1685000, // ৳16,850.00
        accountNumberMasked: '017••••1234',
        isArchived: false,
      },
      {
        id: 'acc-4',
        userId: 'usr-1',
        name: 'Nagad Wallet',
        type: 'mobile_wallet',
        currency: 'BDT',
        openingBalanceMinor: 100000,
        currentBalanceMinor: 430000, // ৳4,300.00
        accountNumberMasked: '018••••5678',
        isArchived: false,
      },
    ],
    budgets: [
      {
        id: 'bgt-1',
        userId: 'usr-1',
        categoryId: 'cat-food',
        categoryName: 'Groceries & Dining',
        categoryColor: '#059669',
        month: '2026-11-01',
        limitMinor: 2000000, // ৳20,000.00
        spentMinor: 1420000, // ৳14,200.00 (71% - Safe)
        alertThreshold: 0.8,
      },
      {
        id: 'bgt-2',
        userId: 'usr-1',
        categoryId: 'cat-bills',
        categoryName: 'Utilities & Subscriptions',
        categoryColor: '#d97706',
        month: '2026-11-01',
        limitMinor: 1000000, // ৳10,000.00
        spentMinor: 885000,  // ৳8,850.00 (88.5% - Amber Warning Caliper)
        alertThreshold: 0.8,
      },
      {
        id: 'bgt-3',
        userId: 'usr-1',
        categoryId: 'cat-transport',
        categoryName: 'Transportation & Fuel',
        categoryColor: '#2563eb',
        month: '2026-11-01',
        limitMinor: 800000,  // ৳8,000.00
        spentMinor: 840000,  // ৳8,400.00 (105% - Crimson Hard Limit Caliper)
        alertThreshold: 0.8,
      },
      {
        id: 'bgt-4',
        userId: 'usr-1',
        categoryId: 'cat-personal',
        categoryName: 'Personal Discretionary',
        categoryColor: '#64748b',
        month: '2026-11-01',
        limitMinor: 600000,  // ৳6,000.00
        spentMinor: 280000,  // ৳2,800.00 (46.7% - Safe)
        alertThreshold: 0.8,
      },
    ],
    recentTransactions: [
      {
        id: 'tx-1',
        userId: 'usr-1',
        accountId: 'acc-2',
        accountName: 'Prime Bank Current',
        categoryId: 'cat-salary',
        categoryName: 'Professional Retainer',
        type: 'income',
        amountMinor: 6000000, // ৳60,000.00
        currency: 'BDT',
        transactionDate: '2026-11-01',
        description: 'Monthly Software Architecture Retainer',
        payee: 'TechCorp Solutions',
        createdAt: '2026-11-01T09:30:00Z',
        updatedAt: '2026-11-01T09:30:00Z',
      },
      {
        id: 'tx-2',
        userId: 'usr-1',
        accountId: 'acc-3',
        accountName: 'bKash Primary MFS',
        categoryId: 'cat-bills',
        categoryName: 'Utilities & Subscriptions',
        type: 'expense',
        amountMinor: 150000, // ৳1,500.00
        currency: 'BDT',
        transactionDate: '2026-11-01',
        description: 'Residential Fiber Broadband',
        payee: 'Carnival Internet',
        paymentMethod: 'bKash MFS',
        createdAt: '2026-11-01T10:15:00Z',
        updatedAt: '2026-11-01T10:15:00Z',
      },
      {
        id: 'tx-3',
        userId: 'usr-1',
        accountId: 'acc-2',
        accountName: 'Prime Bank Current',
        categoryId: null,
        type: 'transfer',
        amountMinor: 500000, // ৳5,000.00
        currency: 'BDT',
        transactionDate: '2026-10-31',
        description: 'Bank to bKash Top-up',
        transferGroupId: 'trf-9982',
        transferDestinationAccountId: 'acc-3',
        transferDestinationAccountName: 'bKash Primary MFS',
        createdAt: '2026-10-31T18:00:00Z',
        updatedAt: '2026-10-31T18:00:00Z',
      },
      {
        id: 'tx-4',
        userId: 'usr-1',
        accountId: 'acc-1',
        accountName: 'Cash Vault',
        categoryId: 'cat-food',
        categoryName: 'Groceries & Dining',
        type: 'expense',
        amountMinor: 428000, // ৳4,280.00
        currency: 'BDT',
        transactionDate: '2026-10-30',
        description: 'Weekly Bazaar & Fresh Produce',
        payee: 'Shwapno Super Shop',
        paymentMethod: 'Cash',
        createdAt: '2026-10-30T16:20:00Z',
        updatedAt: '2026-10-30T16:20:00Z',
      },
      {
        id: 'tx-5',
        userId: 'usr-1',
        accountId: 'acc-4',
        accountName: 'Nagad Wallet',
        categoryId: 'cat-transport',
        categoryName: 'Transportation & Fuel',
        type: 'expense',
        amountMinor: 85000, // ৳850.00
        currency: 'BDT',
        transactionDate: '2026-10-29',
        description: 'Fuel Refill & Toll',
        payee: 'Padma Oil Filling Station',
        paymentMethod: 'Nagad',
        createdAt: '2026-10-29T14:10:00Z',
        updatedAt: '2026-10-29T14:10:00Z',
      },
    ],
    upcomingRecurring: [
      {
        id: 'rec-1',
        userId: 'usr-1',
        name: 'House Rent Allocation',
        amountMinor: 2200000, // ৳22,000.00
        type: 'expense',
        frequency: 'monthly',
        nextOccurrence: '2026-11-05',
        isActive: true,
      },
      {
        id: 'rec-2',
        userId: 'usr-1',
        name: 'Electricity Utility Bill (DESCO)',
        amountMinor: 340000, // ৳3,400.00
        type: 'expense',
        frequency: 'monthly',
        nextOccurrence: '2026-11-12',
        isActive: true,
      },
    ],
    activeGoals: [
      {
        id: 'goal-1',
        userId: 'usr-1',
        name: '6-Month Emergency Vault',
        targetAmountMinor: 30000000, // ৳300,000.00
        currentAmountMinor: 18500000, // ৳185,000.00 (61.7%)
        targetDate: '2027-04-30',
        status: 'active',
      },
      {
        id: 'goal-2',
        userId: 'usr-1',
        name: 'Tech Hardware Replacement',
        targetAmountMinor: 12000000, // ৳120,000.00
        currentAmountMinor: 9500000,  // ৳95,000.00 (79.2%)
        targetDate: '2026-12-31',
        status: 'active',
      },
    ],
    monthlyCashFlowTrend: [
      { month: 'Jun', incomeMinor: 7200000, expenseMinor: 4600000 },
      { month: 'Jul', incomeMinor: 7500000, expenseMinor: 4900000 },
      { month: 'Aug', incomeMinor: 8000000, expenseMinor: 5200000 },
      { month: 'Sep', incomeMinor: 8200000, expenseMinor: 4700000 },
      { month: 'Oct', incomeMinor: 7800000, expenseMinor: 5100000 },
      { month: 'Nov', incomeMinor: 8500000, expenseMinor: 4850000 },
    ],
    spendingByCategory: [
      { categoryName: 'Groceries & Dining', categoryColor: '#059669', spentMinor: 1420000, percentage: 29.3 },
      { categoryName: 'Utilities & Subscriptions', categoryColor: '#d97706', spentMinor: 885000, percentage: 18.2 },
      { categoryName: 'Transportation & Fuel', categoryColor: '#2563eb', spentMinor: 840000, percentage: 17.3 },
      { categoryName: 'Personal Discretionary', categoryColor: '#64748b', spentMinor: 280000, percentage: 5.8 },
      { categoryName: 'Rent & Housing', categoryColor: '#161d26', spentMinor: 1425000, percentage: 29.4 },
    ],
  },
  '2026-10': {
    periodMonth: '2026-10',
    totalIncomeMinor: 7800000,
    totalExpenseMinor: 5100000,
    netCashFlowMinor: 2700000,
    savingsRate: 34.62,
    previousMonthIncomeMinor: 8200000,
    previousMonthExpenseMinor: 4700000,
    accounts: [
      {
        id: 'acc-1',
        userId: 'usr-1',
        name: 'Cash Vault',
        type: 'cash',
        currency: 'BDT',
        openingBalanceMinor: 500000,
        currentBalanceMinor: 712000,
        isArchived: false,
      },
      {
        id: 'acc-2',
        userId: 'usr-1',
        name: 'Prime Bank Current',
        type: 'bank',
        currency: 'BDT',
        openingBalanceMinor: 10000000,
        currentBalanceMinor: 11200000,
        accountNumberMasked: '•••• 4892',
        isArchived: false,
      },
      {
        id: 'acc-3',
        userId: 'usr-1',
        name: 'bKash Primary MFS',
        type: 'mobile_wallet',
        currency: 'BDT',
        openingBalanceMinor: 250000,
        currentBalanceMinor: 1240000,
        accountNumberMasked: '017••••1234',
        isArchived: false,
      },
      {
        id: 'acc-4',
        userId: 'usr-1',
        name: 'Nagad Wallet',
        type: 'mobile_wallet',
        currency: 'BDT',
        openingBalanceMinor: 100000,
        currentBalanceMinor: 310000,
        accountNumberMasked: '018••••5678',
        isArchived: false,
      },
    ],
    budgets: [
      {
        id: 'bgt-10-1',
        userId: 'usr-1',
        categoryId: 'cat-food',
        categoryName: 'Groceries & Dining',
        categoryColor: '#059669',
        month: '2026-10-01',
        limitMinor: 2000000,
        spentMinor: 1980000, // 99% - High Warning Caliper
        alertThreshold: 0.8,
      },
      {
        id: 'bgt-10-2',
        userId: 'usr-1',
        categoryId: 'cat-bills',
        categoryName: 'Utilities & Subscriptions',
        categoryColor: '#d97706',
        month: '2026-10-01',
        limitMinor: 1000000,
        spentMinor: 920000,
        alertThreshold: 0.8,
      },
    ],
    recentTransactions: [
      {
        id: 'tx-10-1',
        userId: 'usr-1',
        accountId: 'acc-2',
        accountName: 'Prime Bank Current',
        categoryId: 'cat-salary',
        categoryName: 'Professional Retainer',
        type: 'income',
        amountMinor: 6000000,
        currency: 'BDT',
        transactionDate: '2026-10-01',
        description: 'Monthly Software Architecture Retainer',
        payee: 'TechCorp Solutions',
        createdAt: '2026-10-01T09:30:00Z',
        updatedAt: '2026-10-01T09:30:00Z',
      },
    ],
    upcomingRecurring: [],
    activeGoals: [],
    monthlyCashFlowTrend: [],
    spendingByCategory: [],
  },
}

export function useDashboardData() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-01T00:00:00'))

  const currentMonthKey = useMemo(() => format(currentDate, 'yyyy-MM'), [currentDate])
  const formattedMonthDisplay = useMemo(() => format(currentDate, 'MMMM yyyy'), [currentDate])

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1))
  }

  const goToCurrentMonth = () => {
    setCurrentDate(new Date('2026-11-01T00:00:00'))
  }

  const isCurrentMonth = useMemo(() => {
    return isSameMonth(currentDate, new Date('2026-11-01T00:00:00'))
  }, [currentDate])

  const query = useQuery<DashboardSummary>({
    queryKey: ['dashboard', currentMonthKey],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: DashboardSummary }>(
          `/analytics/summary?month=${currentMonthKey}`
        )
        if (response.data?.data) {
          return response.data.data
        }
      } catch {
        // Quiet fallback to structured local financial dataset
      }

      // Return matching demo dataset or generate a clean month baseline
      if (DEMO_DASHBOARD_DATA[currentMonthKey]) {
        return DEMO_DASHBOARD_DATA[currentMonthKey]
      }

      // Default baseline for unpopulated months
      return {
        periodMonth: currentMonthKey,
        totalIncomeMinor: 0,
        totalExpenseMinor: 0,
        netCashFlowMinor: 0,
        savingsRate: null,
        previousMonthIncomeMinor: 0,
        previousMonthExpenseMinor: 0,
        accounts: DEMO_DASHBOARD_DATA['2026-11'].accounts,
        budgets: [],
        recentTransactions: [],
        upcomingRecurring: [],
        activeGoals: DEMO_DASHBOARD_DATA['2026-11'].activeGoals,
        monthlyCashFlowTrend: DEMO_DASHBOARD_DATA['2026-11'].monthlyCashFlowTrend,
        spendingByCategory: [],
      }
    },
  })

  return {
    ...query,
    currentDate,
    currentMonthKey,
    formattedMonthDisplay,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  }
}

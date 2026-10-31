import { useState, useMemo, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export type AnalyticsTimeRange = '6m' | '12m' | 'ytd' | 'month'

export interface MonthlyTrendDataPoint {
  month: string
  label: string
  incomeMinor: number
  expenseMinor: number
  netMinor: number
  savingsRate: number
}

export interface CategoryShareDataPoint {
  categoryId: string
  categoryName: string
  categoryColor: string
  spentMinor: number
  percentage: number
  previousMonthSpentMinor: number
}

export interface BudgetPerformanceDataPoint {
  categoryName: string
  categoryColor: string
  budgetLimitMinor: number
  actualSpentMinor: number
  percentageUsed: number
}

export interface TopExpenseItem {
  id: string
  description: string
  payee?: string
  categoryName: string
  date: string
  amountMinor: number
}

// 12-Month Historical Ledger Data (in integer minor units / paisa)
const HISTORICAL_MONTHLY_DATA: MonthlyTrendDataPoint[] = [
  { month: '2025-12', label: 'Dec 25', incomeMinor: 7000000, expenseMinor: 4500000, netMinor: 2500000, savingsRate: 35.7 },
  { month: '2026-01', label: 'Jan 26', incomeMinor: 7200000, expenseMinor: 4600000, netMinor: 2600000, savingsRate: 36.1 },
  { month: '2026-02', label: 'Feb 26', incomeMinor: 7100000, expenseMinor: 4400000, netMinor: 2700000, savingsRate: 38.0 },
  { month: '2026-03', label: 'Mar 26', incomeMinor: 7600000, expenseMinor: 4800000, netMinor: 2800000, savingsRate: 36.8 },
  { month: '2026-04', label: 'Apr 26', incomeMinor: 7400000, expenseMinor: 4900000, netMinor: 2500000, savingsRate: 33.8 },
  { month: '2026-05', label: 'May 26', incomeMinor: 7500000, expenseMinor: 4700000, netMinor: 2800000, savingsRate: 37.3 },
  { month: '2026-06', label: 'Jun 26', incomeMinor: 7200000, expenseMinor: 4600000, netMinor: 2600000, savingsRate: 36.1 },
  { month: '2026-07', label: 'Jul 26', incomeMinor: 7500000, expenseMinor: 4900000, netMinor: 2600000, savingsRate: 34.7 },
  { month: '2026-08', label: 'Aug 26', incomeMinor: 8000000, expenseMinor: 5200000, netMinor: 2800000, savingsRate: 35.0 },
  { month: '2026-09', label: 'Sep 26', incomeMinor: 8200000, expenseMinor: 4700000, netMinor: 3500000, savingsRate: 42.7 },
  { month: '2026-10', label: 'Oct 26', incomeMinor: 7800000, expenseMinor: 5100000, netMinor: 2700000, savingsRate: 34.6 },
  { month: '2026-11', label: 'Nov 26', incomeMinor: 8500000, expenseMinor: 4850000, netMinor: 3650000, savingsRate: 42.9 },
]

const CATEGORY_SHARE_DATA: CategoryShareDataPoint[] = [
  { categoryId: 'cat-housing', categoryName: 'Housing & Rent', categoryColor: '#161d26', spentMinor: 2200000, percentage: 38.6, previousMonthSpentMinor: 2200000 },
  { categoryId: 'cat-food', categoryName: 'Groceries & Dining', categoryColor: '#059669', spentMinor: 1420000, percentage: 24.9, previousMonthSpentMinor: 1980000 },
  { categoryId: 'cat-bills', categoryName: 'Utilities & Subscriptions', categoryColor: '#d97706', spentMinor: 885000, percentage: 15.5, previousMonthSpentMinor: 920000 },
  { categoryId: 'cat-transport', categoryName: 'Transportation & Fuel', categoryColor: '#2563eb', spentMinor: 840000, percentage: 14.7, previousMonthSpentMinor: 780000 },
  { categoryId: 'cat-personal', categoryName: 'Personal Discretionary', categoryColor: '#64748b', spentMinor: 280000, percentage: 4.9, previousMonthSpentMinor: 450000 },
  { categoryId: 'cat-health', categoryName: 'Health & Medical', categoryColor: '#dc2626', spentMinor: 120000, percentage: 2.1, previousMonthSpentMinor: 250000 },
]

const BUDGET_PERFORMANCE_DATA: BudgetPerformanceDataPoint[] = [
  { categoryName: 'Groceries & Dining', categoryColor: '#059669', budgetLimitMinor: 2000000, actualSpentMinor: 1420000, percentageUsed: 71.0 },
  { categoryName: 'Utilities & Subscriptions', categoryColor: '#d97706', budgetLimitMinor: 1000000, actualSpentMinor: 885000, percentageUsed: 88.5 },
  { categoryName: 'Transportation & Fuel', categoryColor: '#2563eb', budgetLimitMinor: 800000, actualSpentMinor: 840000, percentageUsed: 105.0 },
  { categoryName: 'Personal Discretionary', categoryColor: '#64748b', budgetLimitMinor: 600000, actualSpentMinor: 280000, percentageUsed: 46.7 },
  { categoryName: 'Health & Medical', categoryColor: '#dc2626', budgetLimitMinor: 500000, actualSpentMinor: 120000, percentageUsed: 24.0 },
  { categoryName: 'Housing & Rent', categoryColor: '#161d26', budgetLimitMinor: 2500000, actualSpentMinor: 2200000, percentageUsed: 88.0 },
]

const TOP_EXPENSES_DATA: TopExpenseItem[] = [
  { id: 'tx-top-1', description: 'Apartment Monthly Rent', payee: 'Gulshan Residential Holdings', categoryName: 'Housing & Rent', date: '2026-11-05', amountMinor: 2200000 },
  { id: 'tx-top-2', description: 'Monthly Supermarket Provisions', payee: 'Shwapno Super Shop', categoryName: 'Groceries & Dining', date: '2026-10-30', amountMinor: 428000 },
  { id: 'tx-top-3', description: 'Electricity Bill', payee: 'DESCO Utility', categoryName: 'Utilities & Subscriptions', date: '2026-10-18', amountMinor: 340000 },
  { id: 'tx-top-4', description: 'Colleague Dinner', payee: 'Star Kabab & Restaurant', categoryName: 'Groceries & Dining', date: '2026-10-26', amountMinor: 185000 },
  { id: 'tx-top-5', description: 'Fiber Optic Internet', payee: 'Carnival Internet', categoryName: 'Utilities & Subscriptions', date: '2026-11-01', amountMinor: 150000 },
]

export function useAnalytics() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('6m')
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendDataPoint[]>(HISTORICAL_MONTHLY_DATA)
  const [categoryShare, setCategoryShare] = useState<CategoryShareDataPoint[]>(CATEGORY_SHARE_DATA)
  const [budgetPerformance, setBudgetPerformance] = useState<BudgetPerformanceDataPoint[]>(BUDGET_PERFORMANCE_DATA)
  const [topExpenses, setTopExpenses] = useState<TopExpenseItem[]>(TOP_EXPENSES_DATA)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)
      const [trendRes, catRes, bgtRes, topRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: { trend: MonthlyTrendDataPoint[] } }>('/analytics/monthly-trend?months=12').catch(() => null),
        apiClient.get<{ success: boolean; data: { categories: any[] } }>('/analytics/category-breakdown').catch(() => null),
        apiClient.get<{ success: boolean; data: { performance: BudgetPerformanceDataPoint[] } }>('/analytics/budget-performance').catch(() => null),
        apiClient.get<{ success: boolean; data: { topExpenses: TopExpenseItem[] } }>('/analytics/top-expenses?limit=10').catch(() => null),
      ])

      if (trendRes?.data?.data?.trend && Array.isArray(trendRes.data.data.trend) && trendRes.data.data.trend.length > 0) {
        setMonthlyTrend(trendRes.data.data.trend)
      }

      if (catRes?.data?.data?.categories && Array.isArray(catRes.data.data.categories) && catRes.data.data.categories.length > 0) {
        setCategoryShare(catRes.data.data.categories.map((c: any) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          categoryColor: c.categoryColor,
          spentMinor: Number(c.spentMinor),
          percentage: Number(c.percentage),
          previousMonthSpentMinor: Number(c.previousMonthSpentMinor || c.spentMinor),
        })))
      }

      if (bgtRes?.data?.data?.performance && Array.isArray(bgtRes.data.data.performance) && bgtRes.data.data.performance.length > 0) {
        setBudgetPerformance(bgtRes.data.data.performance)
      }

      if (topRes?.data?.data?.topExpenses && Array.isArray(topRes.data.data.topExpenses) && topRes.data.data.topExpenses.length > 0) {
        setTopExpenses(topRes.data.data.topExpenses)
      }
    } catch {
      // Retain fallback dataset
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Filtered monthly trend data
  const filteredTrend = useMemo(() => {
    switch (timeRange) {
      case '6m':
        return monthlyTrend.slice(-6)
      case '12m':
        return monthlyTrend.slice(-12)
      case 'ytd':
        return monthlyTrend.filter((d) => d.month.startsWith('2026'))
      case 'month':
        return monthlyTrend.slice(-1)
      default:
        return monthlyTrend.slice(-6)
    }
  }, [monthlyTrend, timeRange])

  // Summary KPIs for the selected range
  const kpis = useMemo(() => {
    let totalIncomeMinor = 0
    let totalExpenseMinor = 0

    filteredTrend.forEach((m) => {
      totalIncomeMinor += m.incomeMinor
      totalExpenseMinor += m.expenseMinor
    })

    const netMinor = totalIncomeMinor - totalExpenseMinor
    const avgSavingsRate =
      totalIncomeMinor > 0 ? (netMinor / totalIncomeMinor) * 100 : 0
    const avgMonthlyBurnMinor =
      filteredTrend.length > 0 ? Math.round(totalExpenseMinor / filteredTrend.length) : 0

    return {
      totalIncomeMinor,
      totalExpenseMinor,
      netMinor,
      avgSavingsRate,
      avgMonthlyBurnMinor,
      monthsCount: filteredTrend.length,
    }
  }, [filteredTrend])

  return {
    timeRange,
    setTimeRange,
    filteredTrend,
    kpis,
    isLoading,
    categoryShare,
    budgetPerformance,
    topExpenses,
    refreshAnalytics: fetchAnalytics,
  }
}


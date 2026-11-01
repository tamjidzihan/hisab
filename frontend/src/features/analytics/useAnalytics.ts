import { useState, useMemo, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'
import { LEDGER_UPDATED_EVENT } from '@/lib/ledgerEvents'

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

export function useAnalytics() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('6m')
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendDataPoint[]>([])
  const [categoryShare, setCategoryShare] = useState<CategoryShareDataPoint[]>([])
  const [budgetPerformance, setBudgetPerformance] = useState<BudgetPerformanceDataPoint[]>([])
  const [topExpenses, setTopExpenses] = useState<TopExpenseItem[]>([])
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

      if (trendRes?.data?.data?.trend && Array.isArray(trendRes.data.data.trend)) {
        setMonthlyTrend(trendRes.data.data.trend)
      } else {
        setMonthlyTrend([])
      }

      if (catRes?.data?.data?.categories && Array.isArray(catRes.data.data.categories)) {
        setCategoryShare(catRes.data.data.categories.map((c: any) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          categoryColor: c.categoryColor,
          spentMinor: Number(c.spentMinor),
          percentage: Number(c.percentage),
          previousMonthSpentMinor: Number(c.previousMonthSpentMinor || c.spentMinor),
        })))
      } else {
        setCategoryShare([])
      }

      if (bgtRes?.data?.data?.performance && Array.isArray(bgtRes.data.data.performance)) {
        setBudgetPerformance(bgtRes.data.data.performance)
      } else {
        setBudgetPerformance([])
      }

      if (topRes?.data?.data?.topExpenses && Array.isArray(topRes.data.data.topExpenses)) {
        setTopExpenses(topRes.data.data.topExpenses)
      } else {
        setTopExpenses([])
      }
    } catch {
      setMonthlyTrend([])
      setCategoryShare([])
      setBudgetPerformance([])
      setTopExpenses([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    window.addEventListener(LEDGER_UPDATED_EVENT, fetchAnalytics)
    return () => window.removeEventListener(LEDGER_UPDATED_EVENT, fetchAnalytics)
  }, [fetchAnalytics])

  // Filtered monthly trend data
  const filteredTrend = useMemo(() => {
    const currentYear = new Date().getFullYear().toString()
    switch (timeRange) {
      case '6m':
        return monthlyTrend.slice(-6)
      case '12m':
        return monthlyTrend.slice(-12)
      case 'ytd':
        return monthlyTrend.filter((d) => d.month.startsWith(currentYear))
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

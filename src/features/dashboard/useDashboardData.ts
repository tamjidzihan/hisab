import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, addMonths, subMonths, isSameMonth } from 'date-fns'
import { apiClient } from '@/lib/api'
import type { DashboardSummary } from '@/types'

const EMPTY_DASHBOARD_BASELINE = (monthKey: string): DashboardSummary => ({
  periodMonth: monthKey,
  totalIncomeMinor: 0,
  totalExpenseMinor: 0,
  netCashFlowMinor: 0,
  savingsRate: null,
  previousMonthIncomeMinor: 0,
  previousMonthExpenseMinor: 0,
  accounts: [],
  budgets: [],
  recentTransactions: [],
  upcomingRecurring: [],
  activeGoals: [],
  monthlyCashFlowTrend: [],
  spendingByCategory: [],
})

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
          `/analytics/dashboard?month=${currentMonthKey}`
        )
        if (response.data?.data) {
          return response.data.data
        }
      } catch {
        // Return empty ledger baseline
      }

      return EMPTY_DASHBOARD_BASELINE(currentMonthKey)
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

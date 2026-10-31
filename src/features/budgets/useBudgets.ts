import { useState, useMemo, useCallback } from 'react'
import { format, addMonths, subMonths, isSameMonth } from 'date-fns'
import type { Budget } from '@/types'

const INITIAL_BUDGETS_MAP: Record<string, Budget[]> = {
  '2026-11': [
    {
      id: 'bgt-1',
      userId: 'usr-1',
      categoryId: 'cat-food',
      categoryName: 'Groceries & Dining',
      categoryColor: '#059669',
      month: '2026-11-01',
      limitMinor: 2000000, // ৳20,000.00
      spentMinor: 1420000, // ৳14,200.00 (71.0% - Safe)
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
      spentMinor: 885000,  // ৳8,850.00 (88.5% - Warning Caliper)
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
      spentMinor: 840000,  // ৳8,400.00 (105.0% - Crimson Hard Limit)
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
    {
      id: 'bgt-5',
      userId: 'usr-1',
      categoryId: 'cat-health',
      categoryName: 'Health & Medical',
      categoryColor: '#dc2626',
      month: '2026-11-01',
      limitMinor: 500000,  // ৳5,000.00
      spentMinor: 120000,  // ৳1,200.00 (24.0% - Safe)
      alertThreshold: 0.8,
    },
    {
      id: 'bgt-6',
      userId: 'usr-1',
      categoryId: 'cat-housing',
      categoryName: 'Housing & Rent',
      categoryColor: '#161d26',
      month: '2026-11-01',
      limitMinor: 2500000, // ৳25,000.00
      spentMinor: 2200000, // ৳22,000.00 (88.0% - Warning Caliper)
      alertThreshold: 0.8,
    },
  ],
  '2026-10': [
    {
      id: 'bgt-10-1',
      userId: 'usr-1',
      categoryId: 'cat-food',
      categoryName: 'Groceries & Dining',
      categoryColor: '#059669',
      month: '2026-10-01',
      limitMinor: 2000000,
      spentMinor: 1980000, // 99% - High Warning
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
}

export type BudgetFilterType = 'all' | 'warning' | 'exceeded' | 'safe'

export function useBudgets() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-01T00:00:00'))
  const [budgetsMap, setBudgetsMap] = useState<Record<string, Budget[]>>(INITIAL_BUDGETS_MAP)
  const [filter, setFilter] = useState<BudgetFilterType>('all')

  const currentMonthKey = useMemo(() => format(currentDate, 'yyyy-MM'), [currentDate])
  const formattedMonthDisplay = useMemo(() => format(currentDate, 'MMMM yyyy'), [currentDate])

  const isCurrentMonth = useMemo(
    () => isSameMonth(currentDate, new Date('2026-11-01T00:00:00')),
    [currentDate]
  )

  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1))
  const goToCurrentMonth = () => setCurrentDate(new Date('2026-11-01T00:00:00'))

  // Active budgets for the selected month
  const activeBudgets = useMemo(() => {
    return budgetsMap[currentMonthKey] || []
  }, [budgetsMap, currentMonthKey])

  // Filtered budgets based on caliper status
  const filteredBudgets = useMemo(() => {
    return activeBudgets.filter((bgt) => {
      const percentage = bgt.limitMinor > 0 ? (bgt.spentMinor / bgt.limitMinor) * 100 : 0
      if (filter === 'exceeded') return percentage >= 100
      if (filter === 'warning') return percentage >= 80 && percentage < 100
      if (filter === 'safe') return percentage < 80
      return true
    })
  }, [activeBudgets, filter])

  // Summary Metrics for the active month
  const metrics = useMemo(() => {
    let totalLimitMinor = 0
    let totalSpentMinor = 0
    let warningCount = 0
    let exceededCount = 0

    activeBudgets.forEach((bgt) => {
      totalLimitMinor += bgt.limitMinor
      totalSpentMinor += bgt.spentMinor
      const percentage = bgt.limitMinor > 0 ? (bgt.spentMinor / bgt.limitMinor) * 100 : 0
      if (percentage >= 100) {
        exceededCount++
      } else if (percentage >= 80) {
        warningCount++
      }
    })

    const remainingMinor = totalLimitMinor - totalSpentMinor
    const overallPercentage =
      totalLimitMinor > 0 ? (totalSpentMinor / totalLimitMinor) * 100 : 0

    return {
      totalLimitMinor,
      totalSpentMinor,
      remainingMinor,
      overallPercentage,
      warningCount,
      exceededCount,
      totalCount: activeBudgets.length,
    }
  }, [activeBudgets])

  // CRUD actions
  const createBudget = useCallback(
    (newBgt: Omit<Budget, 'id' | 'month' | 'spentMinor'>) => {
      const budget: Budget = {
        ...newBgt,
        id: `bgt-${Date.now()}`,
        month: `${currentMonthKey}-01`,
        spentMinor: 0,
      }

      setBudgetsMap((prev) => ({
        ...prev,
        [currentMonthKey]: [...(prev[currentMonthKey] || []), budget],
      }))

      return budget
    },
    [currentMonthKey]
  )

  const updateBudget = useCallback(
    (id: string, updates: Partial<Budget>) => {
      setBudgetsMap((prev) => ({
        ...prev,
        [currentMonthKey]: (prev[currentMonthKey] || []).map((bgt) =>
          bgt.id === id ? { ...bgt, ...updates } : bgt
        ),
      }))
    },
    [currentMonthKey]
  )

  const deleteBudget = useCallback(
    (id: string) => {
      setBudgetsMap((prev) => ({
        ...prev,
        [currentMonthKey]: (prev[currentMonthKey] || []).filter((bgt) => bgt.id !== id),
      }))
    },
    [currentMonthKey]
  )

  const copyBudgetsFromPreviousMonth = useCallback(() => {
    const prevMonthDate = subMonths(currentDate, 1)
    const prevMonthKey = format(prevMonthDate, 'yyyy-MM')
    const prevBudgets = budgetsMap[prevMonthKey] || []

    if (prevBudgets.length === 0) return 0

    const copied = prevBudgets.map((b) => ({
      ...b,
      id: `bgt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      month: `${currentMonthKey}-01`,
      spentMinor: 0,
    }))

    setBudgetsMap((prev) => ({
      ...prev,
      [currentMonthKey]: [...(prev[currentMonthKey] || []), ...copied],
    }))

    return copied.length
  }, [currentDate, currentMonthKey, budgetsMap])

  return {
    activeBudgets,
    filteredBudgets,
    metrics,
    filter,
    setFilter,
    currentDate,
    currentMonthKey,
    formattedMonthDisplay,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    createBudget,
    updateBudget,
    deleteBudget,
    copyBudgetsFromPreviousMonth,
  }
}


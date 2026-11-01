import { useState, useMemo, useCallback, useEffect } from 'react'
import { format, addMonths, subMonths, isSameMonth } from 'date-fns'
import { apiClient } from '@/lib/api'
import { LEDGER_UPDATED_EVENT } from '@/lib/ledgerEvents'
import type { Budget } from '@/types'

export type BudgetFilterType = 'all' | 'warning' | 'exceeded' | 'safe'

export function useBudgets() {
  const [today] = useState<Date>(() => new Date())
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())
  const [budgetsMap, setBudgetsMap] = useState<Record<string, Budget[]>>({})
  const [filter, setFilter] = useState<BudgetFilterType>('all')
  const [isLoading, setIsLoading] = useState(false)

  const currentMonthKey = useMemo(() => format(currentDate, 'yyyy-MM'), [currentDate])
  const formattedMonthDisplay = useMemo(() => format(currentDate, 'MMMM yyyy'), [currentDate])

  const isCurrentMonth = useMemo(
    () => isSameMonth(currentDate, today),
    [currentDate, today]
  )

  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1))
  const goToCurrentMonth = () => setCurrentDate(new Date())

  // Fetch budgets for active month from backend
  const fetchBudgets = useCallback(async (monthKey: string) => {
    try {
      setIsLoading(true)
      const res = await apiClient.get<{ success: boolean; data: { budgets: any[] } }>(
        `/budgets?month=${monthKey}`
      )
      if (res.data?.data?.budgets && Array.isArray(res.data.data.budgets)) {
        const mapped: Budget[] = res.data.data.budgets.map((b: any) => ({
          id: b.id,
          userId: b.userId,
          categoryId: b.categoryId,
          categoryName:
            b.category?.name || b.categoryName || (b.categoryId ? undefined : 'Overall Monthly Ceiling'),
          categoryColor: b.category?.color || b.categoryColor || '#059669',
          month: b.month,
          limitMinor: Number(b.limitMinor),
          spentMinor: Number(b.spentMinor || 0),
          alertThreshold: typeof b.alertThreshold === 'number' && b.alertThreshold > 1 ? b.alertThreshold / 100 : parseFloat(b.alertThreshold) || 0.8,
        }))

        setBudgetsMap((prev) => ({
          ...prev,
          [monthKey]: mapped,
        }))
      } else {
        setBudgetsMap((prev) => ({
          ...prev,
          [monthKey]: [],
        }))
      }
    } catch {
      setBudgetsMap((prev) => ({
        ...prev,
        [monthKey]: [],
      }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBudgets(currentMonthKey)
    const refreshCurrentBudgets = () => fetchBudgets(currentMonthKey)
    window.addEventListener(LEDGER_UPDATED_EVENT, refreshCurrentBudgets)
    return () => window.removeEventListener(LEDGER_UPDATED_EVENT, refreshCurrentBudgets)
  }, [currentMonthKey, fetchBudgets])

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
      const tempId = `bgt-${Date.now()}`
      const budget: Budget = {
        ...newBgt,
        id: tempId,
        month: `${currentMonthKey}-01`,
        spentMinor: 0,
      }

      setBudgetsMap((prev) => ({
        ...prev,
        [currentMonthKey]: [...(prev[currentMonthKey] || []), budget],
      }))

      apiClient.post('/budgets', {
        categoryId: newBgt.categoryId,
        month: currentMonthKey,
        limitMinor: newBgt.limitMinor,
        alertThreshold: Math.round((newBgt.alertThreshold ?? 0.8) * 100),
      }).then((res) => {
        if (res.data?.data?.budget?.id) {
          setBudgetsMap((prev) => ({
            ...prev,
            [currentMonthKey]: (prev[currentMonthKey] || []).map((b) =>
              b.id === tempId ? { ...b, id: res.data.data.budget.id } : b
            ),
          }))
        }
      }).catch(() => {})

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

      apiClient.patch(`/budgets/${id}`, {
        limitMinor: updates.limitMinor,
        alertThreshold: updates.alertThreshold ? Math.round(updates.alertThreshold * 100) : undefined,
      }).catch(() => {})
    },
    [currentMonthKey]
  )

  const deleteBudget = useCallback(
    (id: string) => {
      setBudgetsMap((prev) => ({
        ...prev,
        [currentMonthKey]: (prev[currentMonthKey] || []).filter((bgt) => bgt.id !== id),
      }))

      apiClient.delete(`/budgets/${id}`).catch(() => {})
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

    copied.forEach((b) => {
      apiClient.post('/budgets', {
        categoryId: b.categoryId,
        month: currentMonthKey,
        limitMinor: b.limitMinor,
        alertThreshold: Math.round((b.alertThreshold ?? 0.8) * 100),
      }).catch(() => {})
    })

    return copied.length
  }, [currentDate, currentMonthKey, budgetsMap])

  return {
    activeBudgets,
    filteredBudgets,
    metrics,
    filter,
    setFilter,
    isLoading,
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
    refreshBudgets: () => fetchBudgets(currentMonthKey),
  }
}

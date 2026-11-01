import { useState, useMemo, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/features/auth/AuthContext'
import type { SavingsGoal } from '@/types'

export interface GoalContribution {
  id: string
  goalId: string
  goalName: string
  amountMinor: number
  date: string
  accountId?: string
  accountName?: string
  notes?: string
}

export type GoalStatusFilter = 'all' | 'active' | 'completed' | 'paused'

export function useSavingsGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [statusFilter, setStatusFilter] = useState<GoalStatusFilter>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch goals and contributions from backend
  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get<{ success: boolean; data: { goals: any[] } }>('/goals')
      if (res.data?.data?.goals && Array.isArray(res.data.data.goals)) {
        const mappedGoals: SavingsGoal[] = res.data.data.goals.map((g: any) => ({
          id: g.id,
          userId: g.userId,
          name: g.name,
          targetAmountMinor: Number(g.targetAmountMinor),
          currentAmountMinor: Number(g.currentAmountMinor || 0),
          targetDate: g.targetDate || undefined,
          status: g.status || 'active',
        }))

        const allContribs: GoalContribution[] = []
        res.data.data.goals.forEach((g: any) => {
          if (Array.isArray(g.contributions)) {
            g.contributions.forEach((c: any) => {
              allContribs.push({
                id: c.id,
                goalId: g.id,
                goalName: g.name,
                amountMinor: Number(c.amountMinor),
                date: c.contributionDate,
                accountName: c.account?.name || undefined,
                notes: c.note || undefined,
              })
            })
          }
        })

        setGoals(mappedGoals)
        setContributions(allContribs)
      } else {
        setGoals([])
        setContributions([])
      }
    } catch {
      setGoals([])
      setContributions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false
      return true
    })
  }, [goals, statusFilter])

  // Aggregate KPI Calculations
  const metrics = useMemo(() => {
    let totalTargetMinor = 0
    let totalAccumulatedMinor = 0
    let activeCount = 0
    let completedCount = 0

    goals.forEach((g) => {
      if (g.status === 'completed') {
        completedCount++
      } else {
        activeCount++
        totalTargetMinor += g.targetAmountMinor
        totalAccumulatedMinor += g.currentAmountMinor
      }
    })

    const overallPercentage =
      totalTargetMinor > 0 ? (totalAccumulatedMinor / totalTargetMinor) * 100 : 0
    const remainingToFundMinor = totalTargetMinor - totalAccumulatedMinor

    return {
      totalTargetMinor,
      totalAccumulatedMinor,
      remainingToFundMinor,
      overallPercentage,
      activeCount,
      completedCount,
      totalCount: goals.length,
    }
  }, [goals])

  // CRUD Actions
  const createGoal = useCallback(
    (newGoal: Omit<SavingsGoal, 'id' | 'userId'>) => {
      const tempId = `goal-${Date.now()}`
      const goal: SavingsGoal = {
        ...newGoal,
        id: tempId,
        userId: user?.id || '',
      }
      setGoals((prev) => [goal, ...prev])

      apiClient.post('/goals', {
        name: newGoal.name,
        targetAmountMinor: newGoal.targetAmountMinor,
        targetDate: newGoal.targetDate,
      }).then((res) => {
        if (res.data?.data?.goal?.id) {
          setGoals((prev) =>
            prev.map((g) => (g.id === tempId ? { ...g, id: res.data.data.goal.id } : g))
          )
        }
      }).catch(() => {})

      return goal
    },
    [user?.id]
  )

  const updateGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )

    apiClient.patch(`/goals/${id}`, updates).catch(() => {})
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setContributions((prev) => prev.filter((c) => c.goalId !== id))

    apiClient.delete(`/goals/${id}`).catch(() => {})
  }, [])

  const addContribution = useCallback(
    (
      goalId: string,
      amountMinor: number,
      date: string,
      accountId?: string,
      accountName?: string,
      notes?: string
    ) => {
      const targetGoal = goals.find((g) => g.id === goalId)
      if (!targetGoal || amountMinor <= 0) return null

      const newContribution: GoalContribution = {
        id: `con-${Date.now()}`,
        goalId,
        goalName: targetGoal.name,
        amountMinor,
        date,
        accountId,
        accountName,
        notes,
      }

      setContributions((prev) => [newContribution, ...prev])

      // Update goal current amount
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === goalId) {
            const updatedCurrent = g.currentAmountMinor + amountMinor
            const isNowCompleted = updatedCurrent >= g.targetAmountMinor
            return {
              ...g,
              currentAmountMinor: updatedCurrent,
              status: isNowCompleted ? 'completed' : g.status,
            }
          }
          return g
        })
      )

      apiClient.post(`/goals/${goalId}/contributions`, {
        amountMinor,
        accountId,
        note: notes,
      }).catch(() => {})

      return newContribution
    },
    [goals]
  )

  return {
    goals,
    filteredGoals,
    contributions,
    isLoading,
    statusFilter,
    setStatusFilter,
    metrics,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    refreshGoals: fetchGoals,
  }
}

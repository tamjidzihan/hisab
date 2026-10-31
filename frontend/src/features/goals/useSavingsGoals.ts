import { useState, useMemo, useCallback } from 'react'
import type { SavingsGoal } from '@/types'

export interface GoalContribution {
  id: string
  goalId: string
  goalName: string
  amountMinor: number
  date: string
  accountName?: string
  notes?: string
}

const INITIAL_GOALS: SavingsGoal[] = [
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
  {
    id: 'goal-3',
    userId: 'usr-1',
    name: 'Hajj & Pilgrimage Reserve',
    targetAmountMinor: 50000000, // ৳500,000.00
    currentAmountMinor: 21000000, // ৳210,000.00 (42.0%)
    targetDate: '2028-06-01',
    status: 'active',
  },
  {
    id: 'goal-4',
    userId: 'usr-1',
    name: 'Home Appliance Upgrades',
    targetAmountMinor: 5000000, // ৳50,000.00
    currentAmountMinor: 5000000, // ৳50,000.00 (100.0%)
    targetDate: '2026-10-15',
    status: 'completed',
  },
]

const INITIAL_CONTRIBUTIONS: GoalContribution[] = [
  {
    id: 'con-1',
    goalId: 'goal-1',
    goalName: '6-Month Emergency Vault',
    amountMinor: 1500000, // ৳15,000.00
    date: '2026-10-28',
    accountName: 'Prime Bank Current',
    notes: 'Monthly allocation from client retainer.',
  },
  {
    id: 'con-2',
    goalId: 'goal-2',
    goalName: 'Tech Hardware Replacement',
    amountMinor: 1000000, // ৳10,000.00
    date: '2026-10-15',
    accountName: 'Prime Bank Current',
    notes: 'Q4 GPU replacement fund deposit.',
  },
  {
    id: 'con-3',
    goalId: 'goal-3',
    goalName: 'Hajj & Pilgrimage Reserve',
    amountMinor: 2000000, // ৳20,000.00
    date: '2026-10-05',
    accountName: 'Prime Bank Current',
    notes: 'Quarterly deposit into Shariah savings.',
  },
]

export type GoalStatusFilter = 'all' | 'active' | 'completed' | 'paused'

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS)
  const [contributions, setContributions] = useState<GoalContribution[]>(INITIAL_CONTRIBUTIONS)
  const [statusFilter, setStatusFilter] = useState<GoalStatusFilter>('all')

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
      const goal: SavingsGoal = {
        ...newGoal,
        id: `goal-${Date.now()}`,
        userId: 'usr-1',
      }
      setGoals((prev) => [goal, ...prev])
      return goal
    },
    []
  )

  const updateGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setContributions((prev) => prev.filter((c) => c.goalId !== id))
  }, [])

  const addContribution = useCallback(
    (
      goalId: string,
      amountMinor: number,
      date: string,
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

      return newContribution
    },
    [goals]
  )

  return {
    goals,
    filteredGoals,
    contributions,
    statusFilter,
    setStatusFilter,
    metrics,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  }
}


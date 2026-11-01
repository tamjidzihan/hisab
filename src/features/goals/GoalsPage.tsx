import React, { useMemo, useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { GoalsSummaryMetrics } from './components/GoalsSummaryMetrics'
import { GoalCard } from './components/GoalCard'
import { ContributionHistoryTable } from './components/ContributionHistoryTable'
import { GoalModal } from './components/GoalModal'
import { ContributionModal } from './components/ContributionModal'
import { useSavingsGoals, type GoalStatusFilter } from './useSavingsGoals'
import { useAccountsAndCategories } from '@/features/accounts/useAccountsAndCategories'
import { Plus, Target, ArrowDownToLine } from 'lucide-react'
import { toast } from 'sonner'
import type { SavingsGoal } from '@/types'

export const GoalsPage: React.FC = () => {
  const { accounts } = useAccountsAndCategories()
  const availableAccounts = useMemo(
    () => accounts.filter((account) => !account.isArchived),
    [accounts]
  )

  const {
    filteredGoals,
    goals,
    contributions,
    statusFilter,
    setStatusFilter,
    metrics,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  } = useSavingsGoals()

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [depositTargetGoal, setDepositTargetGoal] = useState<SavingsGoal | null>(null)

  const handleOpenCreateGoal = () => {
    setEditingGoal(null)
    setIsGoalModalOpen(true)
  }

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setIsGoalModalOpen(true)
  }

  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'userId'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData)
      toast.success('Savings goal parameters updated')
    } else {
      createGoal(goalData)
      toast.success('New savings vault established')
    }
  }

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal? Recorded contributions will also be removed.')) {
      deleteGoal(id)
      toast.success('Savings goal eliminated')
    }
  }

  const handleOpenDeposit = (goal?: SavingsGoal) => {
    setDepositTargetGoal(goal || null)
    setIsDepositModalOpen(true)
  }

  const handleAddDeposit = (
    goalId: string,
    amountMinor: number,
    date: string,
    accountId?: string,
    accountName?: string,
    notes?: string
  ) => {
    const res = addContribution(goalId, amountMinor, date, accountId, accountName, notes)
    if (res) {
      toast.success('Deposit successfully recorded into savings goal')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Savings Goals & Capital Reserves
          </h1>
          <p className="text-xs text-[#64748b]">
            Allocate liquidity towards milestones, emergency vaults, and asset purchases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {goals.some((g) => g.status !== 'completed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDeposit()}
              className="flex items-center gap-1.5"
            >
              <ArrowDownToLine className="w-4 h-4 text-[#059669]" />
              <span>Deposit Capital</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateGoal}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Establish Goal</span>
          </Button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <GoalsSummaryMetrics metrics={metrics} />

      {/* Filter Tabs & Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'all', label: 'All Goals' },
                { id: 'active', label: 'In Progress' },
                { id: 'completed', label: 'Achieved' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as GoalStatusFilter)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-[3px] transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#161d26] text-white'
                    : 'text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#64748b]">
            Showing {filteredGoals.length} of {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
          </span>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="py-8 bg-white border border-[#d2d9e4] rounded-[4px]">
            <EmptyState
              icon={<Target className="w-8 h-8 text-[#64748b]" />}
              title="No goals match this criteria"
              description="Establish target milestones to direct disciplined savings each month."
              actionLabel="Establish Goal"
              onAction={handleOpenCreateGoal}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onDeposit={handleOpenDeposit}
                onEdit={handleOpenEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contribution Ledger */}
      <ContributionHistoryTable contributions={contributions} />

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />

      <ContributionModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onAddContribution={handleAddDeposit}
        goals={goals}
        defaultGoal={depositTargetGoal}
        availableAccounts={availableAccounts}
      />
    </div>
  )
}
export default GoalsPage

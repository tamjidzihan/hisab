import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { MonthNavigator } from '@/features/dashboard/components/MonthNavigator'
import { BudgetSummaryMetrics } from './components/BudgetSummaryMetrics'
import { BudgetRowCard } from './components/BudgetRowCard'
import { BudgetModal } from './components/BudgetModal'
import { useBudgets } from './useBudgets'
import { formatCurrency } from '@/lib/formatters'
import { SlidersHorizontal, Plus, Copy } from 'lucide-react'
import type { Budget } from '@/types'

// Category reference for modal selection
const AVAILABLE_CATEGORIES = [
  { id: 'cat-food', name: 'Groceries & Dining', color: '#059669' },
  { id: 'cat-bills', name: 'Utilities & Subscriptions', color: '#d97706' },
  { id: 'cat-transport', name: 'Transportation & Fuel', color: '#2563eb' },
  { id: 'cat-housing', name: 'Housing & Rent', color: '#161d26' },
  { id: 'cat-health', name: 'Health & Medical', color: '#dc2626' },
  { id: 'cat-personal', name: 'Personal Discretionary', color: '#64748b' },
  { id: 'cat-education', name: 'Education & Learning', color: '#7c3aed' },
]

export const BudgetsPage: React.FC = () => {
  const {
    activeBudgets,
    filteredBudgets,
    metrics,
    filter,
    setFilter,
    formattedMonthDisplay,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    createBudget,
    updateBudget,
    deleteBudget,
    copyBudgetsFromPreviousMonth,
  } = useBudgets()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const handleOpenCreate = () => {
    setEditingBudget(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (bgt: Budget) => {
    setEditingBudget(bgt)
    setModalOpen(true)
  }

  const handleSaveBudget = (data: Omit<Budget, 'id' | 'month' | 'spentMinor'>) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, data)
      toast.success(`Budget for "${data.categoryName || 'Ceiling'}" updated.`)
    } else {
      createBudget(data)
      toast.success(
        `Established budget: ${formatCurrency(data.limitMinor)} for ${data.categoryName || 'Overall'}.`
      )
    }
  }

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id)
    toast('Budget ceiling removed.')
  }

  const handleCopyFromPrevious = () => {
    const count = copyBudgetsFromPreviousMonth()
    if (count > 0) {
      toast.success(`Copied ${count} budget limits from previous month.`)
    } else {
      toast.error('No budget targets found in the previous month to copy.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Surface Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Monthly Budgets & Dimension Calipers
          </h1>
          <p className="text-xs text-[#64748b]">
            Enforce spending limits with physical 80% warning and 100% hard limit calipers.
          </p>
        </div>

        {/* Month Navigator & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <MonthNavigator
            formattedMonthDisplay={formattedMonthDisplay}
            isCurrentMonth={isCurrentMonth}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
            onCurrent={goToCurrentMonth}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromPrevious}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
            className="text-xs h-9"
          >
            Copy Previous
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs h-9 font-semibold"
          >
            Establish Budget
          </Button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <BudgetSummaryMetrics metrics={metrics} />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            className="text-xs h-7 px-3"
          >
            All Calipers ({activeBudgets.length})
          </Button>

          <Button
            size="sm"
            variant={filter === 'warning' ? 'primary' : 'outline'}
            onClick={() => setFilter('warning')}
            className="text-xs h-7 px-3 text-[#d97706]"
          >
            80%+ Warning ({metrics.warningCount})
          </Button>

          <Button
            size="sm"
            variant={filter === 'exceeded' ? 'primary' : 'outline'}
            onClick={() => setFilter('exceeded')}
            className="text-xs h-7 px-3 text-[#dc2626]"
          >
            Over Limit ({metrics.exceededCount})
          </Button>

          <Button
            size="sm"
            variant={filter === 'safe' ? 'primary' : 'outline'}
            onClick={() => setFilter('safe')}
            className="text-xs h-7 px-3 text-[#059669]"
          >
            On Track ({metrics.totalCount - metrics.warningCount - metrics.exceededCount})
          </Button>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#64748b]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            &lt;80% Safe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
            80% Warning Caliper
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            100% Hard Limit
          </span>
        </div>
      </div>

      {/* Budgets Grid */}
      {filteredBudgets.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="w-6 h-6" />}
          title={`No Budgets Found for ${formattedMonthDisplay}`}
          description={
            filter !== 'all'
              ? 'No budgets match the selected caliper threshold filter.'
              : 'You have not established category spending limits for this calendar month.'
          }
          actionLabel={filter !== 'all' ? 'View All Calipers' : 'Establish First Budget'}
          onAction={filter !== 'all' ? () => setFilter('all') : handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((budget) => (
            <BudgetRowCard
              key={budget.id}
              budget={budget}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      {/* Establish / Edit Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveBudget}
        initialBudget={editingBudget}
        availableCategories={AVAILABLE_CATEGORIES}
      />
    </div>
  )
}

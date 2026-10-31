import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/formatters'
import { Edit2, Trash2, PlusCircle, CheckCircle, Calendar } from 'lucide-react'
import type { SavingsGoal } from '@/types'

export interface GoalCardProps {
  goal: SavingsGoal
  onDeposit: (goal: SavingsGoal) => void
  onEdit: (goal: SavingsGoal) => void
  onDelete: (id: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onDeposit,
  onEdit,
  onDelete,
}) => {
  const percentage =
    goal.targetAmountMinor > 0
      ? (goal.currentAmountMinor / goal.targetAmountMinor) * 100
      : 0
  const remainingMinor = goal.targetAmountMinor - goal.currentAmountMinor
  const isCompleted = goal.status === 'completed' || percentage >= 100

  return (
    <Card className="hover:border-[#94a3b8] transition-colors relative flex flex-col justify-between p-4">
      <div className="space-y-3">
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#161d26] leading-tight">
              {goal.name}
            </h3>
            {goal.targetDate && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#64748b] mt-0.5">
                <Calendar className="w-3 h-3 text-[#64748b]" />
                <span>Target Date: {formatDate(goal.targetDate, 'dd MMM yyyy')}</span>
              </div>
            )}
          </div>

          <Badge
            variant={isCompleted ? 'inflow' : goal.status === 'paused' ? 'neutral' : 'warning'}
            size="sm"
          >
            {isCompleted ? 'COMPLETED' : goal.status === 'paused' ? 'PAUSED' : 'IN PROGRESS'}
          </Badge>
        </div>

        {/* Current vs Target Numbers */}
        <div className="flex items-baseline justify-between font-mono text-xs pt-1">
          <div>
            <span className="text-[10px] text-[#64748b] uppercase block">Saved So Far</span>
            <span className="text-lg font-bold tabular-nums text-[#059669]">
              {formatCurrency(goal.currentAmountMinor)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#64748b] uppercase block">Target Goal</span>
            <span className="text-sm font-semibold text-[#161d26] tabular-nums">
              {formatCurrency(goal.targetAmountMinor)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <CaliperProgress
          value={goal.currentAmountMinor}
          max={goal.targetAmountMinor}
          showNotches={false}
          height="md"
        />

        {/* Remaining Headroom Status Line */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#64748b]">
          <span className="font-semibold text-[#161d26]">
            {formatPercentage(percentage)} funded
          </span>
          <span>
            {remainingMinor <= 0 ? (
              <span className="text-[#059669] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Fully Funded!
              </span>
            ) : (
              <span>{formatCurrency(remainingMinor)} to reach goal</span>
            )}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-[#e5eaf0] flex items-center justify-between">
        {!isCompleted ? (
          <button
            onClick={() => onDeposit(goal)}
            className="inline-flex items-center gap-1 text-xs text-[#059669] hover:underline font-semibold cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Deposit Capital</span>
          </button>
        ) : (
          <span className="text-xs text-[#059669] font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Goal Achieved
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(goal)}
            aria-label={`Edit ${goal.name}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            aria-label={`Delete ${goal.name}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}


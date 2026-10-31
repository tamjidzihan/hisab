import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { Edit2, Trash2, AlertTriangle } from 'lucide-react'
import type { Budget } from '@/types'

export interface BudgetRowCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export const BudgetRowCard: React.FC<BudgetRowCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  const percentage =
    budget.limitMinor > 0 ? (budget.spentMinor / budget.limitMinor) * 100 : 0
  const remainingMinor = budget.limitMinor - budget.spentMinor
  const isOverBudget = percentage >= 100
  const isWarning = percentage >= 80 && percentage < 100

  return (
    <Card className="hover:border-[#94a3b8] transition-colors relative flex flex-col justify-between p-4">
      <div className="space-y-3">
        {/* Header: Category Name, Color & Caliper Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-[3px] shrink-0 border border-[#d2d9e4]"
              style={{ backgroundColor: budget.categoryColor || '#161d26' }}
              title="Category Color"
            />
            <h3 className="text-sm font-bold text-[#161d26] leading-tight">
              {budget.categoryName || 'Overall Monthly Spending Ceiling'}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isOverBudget ? (
              <Badge variant="critical" size="sm">
                <AlertTriangle className="w-3 h-3 mr-0.5 inline" />
                OVER LIMIT
              </Badge>
            ) : isWarning ? (
              <Badge variant="warning" size="sm">
                80%+ CALIPER
              </Badge>
            ) : (
              <Badge variant="inflow" size="sm">
                ON TRACK
              </Badge>
            )}
          </div>
        </div>

        {/* Consumed vs Limit Numbers */}
        <div className="flex items-baseline justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#64748b] uppercase block">Consumed</span>
            <span
              className={`text-base font-bold tabular-nums ${
                isOverBudget ? 'text-[#dc2626]' : isWarning ? 'text-[#d97706]' : 'text-[#161d26]'
              }`}
            >
              {formatCurrency(budget.spentMinor)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#64748b] uppercase block">Ceiling Limit</span>
            <span className="text-sm font-semibold text-[#161d26] tabular-nums">
              {formatCurrency(budget.limitMinor)}
            </span>
          </div>
        </div>

        {/* Caliper Progress Bar */}
        <CaliperProgress
          value={budget.spentMinor}
          max={budget.limitMinor}
          showNotches
          height="md"
        />

        {/* Headroom / Over-limit Status Line */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#64748b]">
          <span>{formatPercentage(percentage)} used</span>
          <span>
            {remainingMinor >= 0 ? (
              <strong className="text-[#059669]">
                {formatCurrency(remainingMinor)} headroom
              </strong>
            ) : (
              <strong className="text-[#dc2626]">
                {formatCurrency(Math.abs(remainingMinor))} over limit
              </strong>
            )}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-[#e5eaf0] flex items-center justify-between">
        <span className="text-[10px] text-[#64748b] font-mono">
          Caliper Alert: {(budget.alertThreshold * 100).toFixed(0)}%
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${budget.categoryName || 'budget'}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            aria-label={`Delete ${budget.categoryName || 'budget'}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}


import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { Badge } from '@/components/common/Badge'
import { formatCurrency } from '@/lib/formatters'
import { SlidersHorizontal, ArrowRight, AlertTriangle } from 'lucide-react'
import type { Budget } from '@/types'

export interface BudgetCalipersCardProps {
  budgets: Budget[]
}

export const BudgetCalipersCard: React.FC<BudgetCalipersCardProps> = ({ budgets }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#161d26]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Budget Dimension Calipers
            </h3>
          </div>
          <Link
            to="/budgets"
            className="text-[11px] text-[#161d26] hover:underline font-medium inline-flex items-center gap-1"
          >
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      }
    >
      {budgets.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#64748b]">
          <p>No category budgets defined for this month.</p>
          <Link to="/budgets" className="text-[#161d26] font-semibold underline mt-1 inline-block">
            Establish Monthly Budgets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] pb-1 border-b border-[#e5eaf0]">
            <span>Category</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                80% Warning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                100% Hard Limit
              </span>
            </div>
          </div>

          {budgets.map((budget) => {
            const percentage =
              budget.limitMinor > 0 ? (budget.spentMinor / budget.limitMinor) * 100 : 0
            const remainingMinor = budget.limitMinor - budget.spentMinor
            const isExceeded = percentage >= 100
            const isWarning = percentage >= 80 && percentage < 100

            return (
              <div key={budget.id} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#161d26]">
                      {budget.categoryName || 'Overall Budget'}
                    </span>
                    {isExceeded && (
                      <Badge variant="critical" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-0.5 inline" />
                        OVER LIMIT
                      </Badge>
                    )}
                    {isWarning && (
                      <Badge variant="warning" size="sm">
                        80%+ CALIPER
                      </Badge>
                    )}
                  </div>
                  <div className="font-mono text-xs tabular-nums text-[#161d26]">
                    <span className="font-semibold">{formatCurrency(budget.spentMinor)}</span>
                    <span className="text-[#64748b] mx-1">/</span>
                    <span className="text-[#64748b]">{formatCurrency(budget.limitMinor)}</span>
                  </div>
                </div>

                <CaliperProgress
                  value={budget.spentMinor}
                  max={budget.limitMinor}
                  showNotches
                  height="md"
                />

                <div className="flex justify-between items-center text-[10px] font-mono text-[#64748b]">
                  <span>{percentage.toFixed(1)}% consumed</span>
                  <span>
                    {remainingMinor >= 0 ? (
                      <span>{formatCurrency(remainingMinor)} headroom remaining</span>
                    ) : (
                      <span className="text-[#dc2626] font-semibold">
                        {formatCurrency(Math.abs(remainingMinor))} over limit
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}


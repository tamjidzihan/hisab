import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency } from '@/lib/formatters'
import { Target, ArrowRight } from 'lucide-react'
import type { SavingsGoal } from '@/types'

export interface SavingsGoalsWidgetProps {
  goals: SavingsGoal[]
}

export const SavingsGoalsWidget: React.FC<SavingsGoalsWidgetProps> = ({ goals }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#161d26]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Target Savings Goals
            </h3>
          </div>
          <Link
            to="/goals"
            className="text-[11px] text-[#161d26] hover:underline font-medium inline-flex items-center gap-1"
          >
            Goals <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      }
    >
      {goals.length === 0 ? (
        <p className="text-xs text-[#64748b] py-2">No active savings goals defined.</p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage =
              goal.targetAmountMinor > 0
                ? (goal.currentAmountMinor / goal.targetAmountMinor) * 100
                : 0

            return (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#161d26]">{goal.name}</span>
                  <div className="font-mono text-xs tabular-nums text-[#161d26]">
                    <span className="font-bold text-[#059669]">
                      {formatCurrency(goal.currentAmountMinor)}
                    </span>
                    <span className="text-[#64748b] mx-1">/</span>
                    <span className="text-[#64748b]">{formatCurrency(goal.targetAmountMinor)}</span>
                  </div>
                </div>

                <CaliperProgress
                  value={goal.currentAmountMinor}
                  max={goal.targetAmountMinor}
                  showNotches={false}
                  height="sm"
                />

                <div className="flex justify-between items-center text-[10px] font-mono text-[#64748b]">
                  <span>{percentage.toFixed(1)}% funded</span>
                  {goal.targetDate && <span>Target: {goal.targetDate}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}


import React from 'react'
import { Card } from '@/components/common/Card'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import type { BudgetPerformanceDataPoint } from '../useAnalytics'

export interface BudgetPerformanceChartProps {
  performanceData: BudgetPerformanceDataPoint[]
}

export const BudgetPerformanceChart: React.FC<BudgetPerformanceChartProps> = ({
  performanceData,
}) => {
  return (
    <Card
      header={
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
            Budget vs. Actual Variance
          </h3>
          <p className="text-[11px] text-[#64748b]">
            Category ceiling discipline against posted expenditures
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        {performanceData.map((item) => {
          const isOver = item.percentageUsed >= 100
          const isWarning = item.percentageUsed >= 80 && item.percentageUsed < 100

          return (
            <div key={item.categoryName} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{ backgroundColor: item.categoryColor }}
                  />
                  <span className="font-semibold text-[#161d26]">{item.categoryName}</span>
                </div>
                <div className="font-mono text-xs tabular-nums">
                  <span
                    className={`font-bold ${
                      isOver ? 'text-[#dc2626]' : isWarning ? 'text-[#d97706]' : 'text-[#161d26]'
                    }`}
                  >
                    {formatCurrency(item.actualSpentMinor)}
                  </span>
                  <span className="text-[#64748b] mx-1">/</span>
                  <span className="text-[#64748b]">{formatCurrency(item.budgetLimitMinor)}</span>
                  <span className="ml-2 text-[10px] text-[#64748b]">
                    ({formatPercentage(item.percentageUsed)})
                  </span>
                </div>
              </div>

              <CaliperProgress
                value={item.actualSpentMinor}
                max={item.budgetLimitMinor}
                showNotches
                height="sm"
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}


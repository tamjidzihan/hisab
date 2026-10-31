import React from 'react'
import { Card } from '@/components/common/Card'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { TrendingUp, TrendingDown, Scale, Percent } from 'lucide-react'

export interface AnalyticsKPIsProps {
  kpis: {
    totalIncomeMinor: number
    totalExpenseMinor: number
    netMinor: number
    avgSavingsRate: number
    avgMonthlyBurnMinor: number
    monthsCount: number
  }
}

export const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({ kpis }) => {
  const isSurplus = kpis.netMinor >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Period Inflow */}
      <Card className="border-l-[3px] border-l-[#059669]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Accumulated Inflow
          </span>
          <TrendingUp className="w-4 h-4 text-[#059669]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(kpis.totalIncomeMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          Over {kpis.monthsCount} recorded calendar month(s)
        </p>
      </Card>

      {/* Total Period Outflow */}
      <Card className="border-l-[3px] border-l-[#dc2626]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Accumulated Outflow
          </span>
          <TrendingDown className="w-4 h-4 text-[#dc2626]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(kpis.totalExpenseMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          Avg. {formatCurrency(kpis.avgMonthlyBurnMinor)} / month burn rate
        </p>
      </Card>

      {/* Net Period Surplus */}
      <Card
        className={`border-l-[3px] ${
          isSurplus ? 'border-l-[#161d26]' : 'border-l-[#dc2626]'
        }`}
      >
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Net Accumulated Surplus
          </span>
          <Scale className="w-4 h-4 text-[#161d26]" />
        </div>
        <div
          className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${
            isSurplus ? 'text-[#059669]' : 'text-[#dc2626]'
          }`}
        >
          {formatCurrency(kpis.netMinor, 'BDT', { showPositiveSign: true })}
        </div>
        <p className="text-[10px] font-mono mt-1">
          {isSurplus ? (
            <span className="text-[#059669] font-medium">Net wealth generated</span>
          ) : (
            <span className="text-[#dc2626] font-medium">Net reserve reduction</span>
          )}
        </p>
      </Card>

      {/* Average Savings Rate */}
      <Card className="border-l-[3px] border-l-[#d97706]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Mean Savings Rate
          </span>
          <Percent className="w-4 h-4 text-[#d97706]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatPercentage(kpis.avgSavingsRate)}
        </div>
        <p className="text-[10px] font-mono mt-1">
          {kpis.avgSavingsRate >= 35 ? (
            <span className="text-[#059669] font-medium">Above 35% target discipline</span>
          ) : (
            <span className="text-[#d97706] font-medium">Below target benchmark</span>
          )}
        </p>
      </Card>
    </div>
  )
}


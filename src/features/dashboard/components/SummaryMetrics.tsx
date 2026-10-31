import React from 'react'
import { Card } from '@/components/common/Card'
import { TrendingUp, TrendingDown, Scale, Percent } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import type { DashboardSummary } from '@/types'

export interface SummaryMetricsProps {
  data: DashboardSummary
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ data }) => {
  const {
    totalIncomeMinor,
    totalExpenseMinor,
    netCashFlowMinor,
    savingsRate,
    previousMonthIncomeMinor,
    previousMonthExpenseMinor,
  } = data

  // Month-over-month comparisons (pure integer arithmetic)
  const incomeDiff = totalIncomeMinor - previousMonthIncomeMinor
  const incomeChangePct =
    previousMonthIncomeMinor > 0 ? (incomeDiff / previousMonthIncomeMinor) * 100 : 0

  const expenseDiff = totalExpenseMinor - previousMonthExpenseMinor
  const expenseChangePct =
    previousMonthExpenseMinor > 0 ? (expenseDiff / previousMonthExpenseMinor) * 100 : 0

  const expenseShareOfIncome =
    totalIncomeMinor > 0 ? (totalExpenseMinor / totalIncomeMinor) * 100 : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Inflow */}
      <Card className="border-l-[3px] border-l-[#059669]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
          <span className="font-mono tracking-wider text-[11px] uppercase">Total Inflow</span>
          <TrendingUp className="w-4 h-4 text-[#059669]" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums tracking-tight">
          {formatCurrency(totalIncomeMinor)}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono">
          <span
            className={
              incomeChangePct >= 0 ? 'text-[#059669] font-medium' : 'text-[#dc2626] font-medium'
            }
          >
            {incomeChangePct >= 0 ? '+' : ''}
            {incomeChangePct.toFixed(1)}%
          </span>
          <span className="text-[#64748b]">vs previous month</span>
        </div>
      </Card>

      {/* Total Outflow */}
      <Card className="border-l-[3px] border-l-[#dc2626]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
          <span className="font-mono tracking-wider text-[11px] uppercase">Total Outflow</span>
          <TrendingDown className="w-4 h-4 text-[#dc2626]" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums tracking-tight">
          {formatCurrency(totalExpenseMinor)}
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono text-[#64748b]">
          <span>
            {expenseChangePct >= 0 ? '+' : ''}
            {expenseChangePct.toFixed(1)}% MoM
          </span>
          <span className="text-[#161d26] font-medium">
            {expenseShareOfIncome.toFixed(1)}% of income
          </span>
        </div>
      </Card>

      {/* Net Cash Flow */}
      <Card
        className={`border-l-[3px] ${
          netCashFlowMinor >= 0 ? 'border-l-[#161d26]' : 'border-l-[#dc2626]'
        }`}
      >
        <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
          <span className="font-mono tracking-wider text-[11px] uppercase">Net Cash Flow</span>
          <Scale className="w-4 h-4 text-[#161d26]" aria-hidden="true" />
        </div>
        <div
          className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${
            netCashFlowMinor >= 0 ? 'text-[#059669]' : 'text-[#dc2626]'
          }`}
        >
          {formatCurrency(netCashFlowMinor, 'BDT', { showPositiveSign: true })}
        </div>
        <div className="mt-1.5 text-[11px] font-mono text-[#64748b]">
          {netCashFlowMinor >= 0 ? (
            <span className="text-[#059669] font-medium">Surplus retained in vaults</span>
          ) : (
            <span className="text-[#dc2626] font-medium">Deficit covered by reserves</span>
          )}
        </div>
      </Card>

      {/* Savings Rate */}
      <Card className="border-l-[3px] border-l-[#d97706]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
          <span className="font-mono tracking-wider text-[11px] uppercase">Savings Rate</span>
          <Percent className="w-4 h-4 text-[#d97706]" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums tracking-tight">
          {savingsRate !== null ? formatPercentage(savingsRate) : 'N/A'}
        </div>
        <div className="mt-1.5 text-[11px] font-mono text-[#64748b]">
          {savingsRate !== null && savingsRate >= 35 ? (
            <span className="text-[#059669] font-medium">Target met (≥ 35%)</span>
          ) : (
            <span className="text-[#d97706] font-medium">Target caliper: 35.0%</span>
          )}
        </div>
      </Card>
    </div>
  )
}


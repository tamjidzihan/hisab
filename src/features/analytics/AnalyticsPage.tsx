import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/common/Button'
import { AnalyticsKPIs } from './components/AnalyticsKPIs'
import { HistoricalCashFlowChart } from './components/HistoricalCashFlowChart'
import { CategoryBreakdownDonut } from './components/CategoryBreakdownDonut'
import { BudgetPerformanceChart } from './components/BudgetPerformanceChart'
import { TopExpensesTable } from './components/TopExpensesTable'
import { useAnalytics, type AnalyticsTimeRange } from './useAnalytics'
import { AnalyticsSkeleton } from '@/components/common/SkeletonScreens'
import { Download } from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    filteredTrend,
    kpis,
    categoryShare,
    budgetPerformance,
    topExpenses,
    isLoading,
  } = useAnalytics()

  if (isLoading) return <AnalyticsSkeleton />

  const handleExportReport = () => {
    // Generate CSV Analytical Report
    const headers = ['Period', 'Income (BDT)', 'Expense (BDT)', 'Net Flow (BDT)', 'Savings Rate (%)']
    const rows = filteredTrend.map((m) => [
      m.label,
      (m.incomeMinor / 100).toFixed(2),
      (m.expenseMinor / 100).toFixed(2),
      (m.netMinor / 100).toFixed(2),
      `${m.savingsRate.toFixed(1)}%`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `hisab-analytics-report-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Downloaded analytical CSV report.')
  }

  const timeRanges: Array<{ id: AnalyticsTimeRange; label: string }> = [
    { id: '6m', label: 'Last 6 Months' },
    { id: '12m', label: 'Last 12 Months' },
    { id: 'ytd', label: 'Year-to-Date (2026)' },
    { id: 'month', label: 'Current Month' },
  ]

  return (
    <div className="space-y-6">
      {/* Surface Header & Time Range Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Financial Analytics & Trend Intelligence
          </h1>
          <p className="text-xs text-[#64748b]">
            Server-aggregated cash-flow trajectories, category distributions, and budget variance.
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time range selector pills */}
          <div
            data-tour-target="analytics-ranges"
            className="flex items-center gap-1 bg-white border border-[#d2d9e4] rounded-[4px] p-1"
          >
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                  timeRange === range.id
                    ? 'bg-[#161d26] text-white'
                    : 'text-[#64748b] hover:text-[#161d26]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportReport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs h-9"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <AnalyticsKPIs kpis={kpis} />

      {/* Main Historical Trend Chart (Full Width) */}
      <HistoricalCashFlowChart trendData={filteredTrend} />

      {/* Two Column Grid: Category Breakdown Donut & Budget Variance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownDonut categories={categoryShare} />
        <BudgetPerformanceChart performanceData={budgetPerformance} />
      </div>

      {/* Bottom Table: Top Outflows */}
      <TopExpensesTable topExpenses={topExpenses} />
    </div>
  )
}

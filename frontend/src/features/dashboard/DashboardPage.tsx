import React from 'react'
import { useDashboardData } from './useDashboardData'
import { MonthNavigator } from './components/MonthNavigator'
import { SummaryMetrics } from './components/SummaryMetrics'
import { CashFlowTrendChart } from './components/CashFlowTrendChart'
import { BudgetCalipersCard } from './components/BudgetCalipersCard'
import { AccountVaultsRail } from './components/AccountVaultsRail'
import { RecentTransactionsLedger } from './components/RecentTransactionsLedger'
import { UpcomingRecurringWidget } from './components/UpcomingRecurringWidget'
import { SavingsGoalsWidget } from './components/SavingsGoalsWidget'
import { DashboardSkeleton } from '@/components/common/SkeletonScreens'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Badge } from '@/components/common/Badge'

export const DashboardPage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    formattedMonthDisplay,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useDashboardData()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <ErrorMessage
          title="Ledger Communication Error"
          message={error instanceof Error ? error.message : 'Unable to query monthly summary.'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Surface Header & Month Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Monthly Ledger Dashboard
          </h1>
          <p className="text-xs text-[#64748b]">
            Structured cash-flow tracking, account vaults, and dimensioned budget calipers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={data.netCashFlowMinor >= 0 ? 'inflow' : 'critical'}
            size="md"
          >
            {data.netCashFlowMinor >= 0 ? 'Surplus Balance' : 'Deficit Warning'}
          </Badge>

          {/* Interactive Month Navigator */}
          <div data-tour-target="dashboard-months">
            <MonthNavigator
              formattedMonthDisplay={formattedMonthDisplay}
              isCurrentMonth={isCurrentMonth}
              onPrevious={goToPreviousMonth}
              onNext={goToNextMonth}
              onCurrent={goToCurrentMonth}
            />
          </div>
        </div>
      </div>

      {/* Primary Key Metrics Row */}
      <SummaryMetrics data={data} />

      {/* Main 3-Column Drafting Spatial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols): Account Vaults & Liquidity */}
        <div className="lg:col-span-3 space-y-6">
          <AccountVaultsRail accounts={data.accounts} />
          <SavingsGoalsWidget goals={data.activeGoals} />
        </div>

        {/* Center Column (5 cols): Trend Visualization & Recent Ledger Table */}
        <div className="lg:col-span-5 space-y-6">
          <CashFlowTrendChart trendData={data.monthlyCashFlowTrend} />
          <RecentTransactionsLedger transactions={data.recentTransactions} />
        </div>

        {/* Right Column (4 cols): Budget Calipers & Upcoming Obligations */}
        <div className="lg:col-span-4 space-y-6">
          <BudgetCalipersCard budgets={data.budgets} />
          <UpcomingRecurringWidget recurring={data.upcomingRecurring} />
        </div>
      </div>
    </div>
  )
}

/**
 * SkeletonScreens.tsx
 * Page-shaped skeleton loading states for every major route.
 * Each skeleton mirrors the real page's exact DOM structure and grid layout
 * so content snaps into place without layout shift when data arrives.
 */
import React from 'react'
import { Skeleton } from './LoadingSpinner'
import { cn } from '@/lib/utils'

// ─── Reusable Skeleton Atoms ──────────────────────────────────────────────────

const SkeletonPageHeader: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d2d9e4]">
    <div className="space-y-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-3 w-72" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className={cn('h-8 rounded-[3px]', wide ? 'w-36' : 'w-24')} />
      <Skeleton className="h-8 w-24 rounded-[3px]" />
    </div>
  </div>
)

const SkeletonMetricCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white border border-[#d2d9e4] rounded-[4px] p-4 space-y-3', className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-6 rounded-[3px]" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-2.5 w-16" />
  </div>
)

const SkeletonCardHeader: React.FC<{ actionWidth?: string }> = ({ actionWidth = 'w-20' }) => (
  <div className="px-4 py-3 border-b border-[#d2d9e4] flex items-center justify-between">
    <div className="space-y-1.5">
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-2.5 w-20" />
    </div>
    <Skeleton className={cn('h-7 rounded-[3px]', actionWidth)} />
  </div>
)

const SkeletonTableRow: React.FC<{ cols?: number[]; className?: string }> = ({
  cols = [28, 120, 80, 64, 64],
  className,
}) => (
  <div className={cn('flex items-center gap-4 py-3 px-4 border-b border-[#f0f4f8] last:border-0', className)}>
    {cols.map((w, i) => (
      <Skeleton
        key={i}
        className={cn('h-3 shrink-0', i === 0 ? 'rounded-full' : 'rounded-[3px]')}
        style={{ width: w, flex: i === 1 ? 1 : undefined }}
      />
    ))}
  </div>
)

const SkeletonAccountCard: React.FC = () => (
  <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-4 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-8 w-8 rounded-[3px]" />
    </div>
    <Skeleton className="h-6 w-36" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-6 w-20 rounded-[3px]" />
      <Skeleton className="h-6 w-16 rounded-[3px]" />
    </div>
  </div>
)

const SkeletonBudgetRow: React.FC = () => (
  <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-[3px]" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <div className="text-right space-y-1.5">
        <Skeleton className="h-3.5 w-24 ml-auto" />
        <Skeleton className="h-2.5 w-16 ml-auto" />
      </div>
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
)

const SkeletonGoalCard: React.FC = () => (
  <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-4 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <Skeleton className="h-7 w-7 rounded-[3px]" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-7 flex-1 rounded-[3px]" />
      <Skeleton className="h-7 w-7 rounded-[3px]" />
    </div>
  </div>
)

// ─── Dashboard Skeleton ───────────────────────────────────────────────────────

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6" role="status" aria-label="Loading dashboard data">
    <span className="sr-only">Loading dashboard…</span>

    {/* Header */}
    <SkeletonPageHeader wide />

    {/* KPI Row — 4 metric cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* 3-column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: account vaults + goals widget */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-24" />
          <div className="p-3 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 border border-[#f0f4f8] rounded-[3px]">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-[3px]" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        </div>
        {/* Goals mini widget */}
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-16" />
          <div className="p-3 space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-2.5 space-y-2 border border-[#f0f4f8] rounded-[3px]">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: chart + recent transactions */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader />
          <div className="p-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-16" />
          {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
        </div>
      </div>

      {/* Right: budget calipers + recurring */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-16" />
          <div className="p-3 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-16" />
          <div className="p-3 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 border border-[#f0f4f8] rounded-[3px]">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// ─── Transactions Skeleton ────────────────────────────────────────────────────

export const TransactionsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading transactions">
    <span className="sr-only">Loading transactions…</span>

    <SkeletonPageHeader />

    {/* Summary strip */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* Filter bar */}
    <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-3 flex flex-wrap gap-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className={cn('h-8 rounded-[3px]', i === 0 ? 'flex-1 min-w-[160px]' : 'w-28')} />
      ))}
    </div>

    {/* Table */}
    <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center gap-4 py-2.5 px-4 border-b border-[#d2d9e4] bg-[#f8fafc]">
        {[40, 0, 80, 72, 80, 48].map((w, i) => (
          <Skeleton
            key={i}
            className="h-2.5 rounded-[3px]"
            style={{ width: w || undefined, flex: i === 1 ? 1 : undefined }}
          />
        ))}
      </div>
      {[...Array(8)].map((_, i) => (
        <SkeletonTableRow key={i} cols={[28, 120, 80, 64, 72, 40]} />
      ))}
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#d2d9e4]">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-7 w-7 rounded-[3px]" />)}
        </div>
      </div>
    </div>
  </div>
)

// ─── Accounts & Categories Skeleton ──────────────────────────────────────────

export const AccountsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading accounts">
    <span className="sr-only">Loading accounts…</span>

    <SkeletonPageHeader />

    {/* Liquidity summary strip */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* Tab bar */}
    <div className="flex gap-1 border-b border-[#d2d9e4] pb-0">
      <Skeleton className="h-8 w-24 rounded-t-[3px]" />
      <Skeleton className="h-8 w-28 rounded-t-[3px]" />
    </div>

    {/* Account cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <SkeletonAccountCard key={i} />)}
    </div>
  </div>
)

// ─── Budgets Skeleton ─────────────────────────────────────────────────────────

export const BudgetsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading budgets">
    <span className="sr-only">Loading budgets…</span>

    <SkeletonPageHeader wide />

    {/* Summary metrics */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* Filter bar */}
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-[3px]" />)}
    </div>

    {/* Budget rows */}
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <SkeletonBudgetRow key={i} />)}
    </div>
  </div>
)

// ─── Goals Skeleton ───────────────────────────────────────────────────────────

export const GoalsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading savings goals">
    <span className="sr-only">Loading savings goals…</span>

    <SkeletonPageHeader />

    {/* Summary */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* Goal cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(4)].map((_, i) => <SkeletonGoalCard key={i} />)}
    </div>

    {/* Contributions table */}
    <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
      <SkeletonCardHeader />
      {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
    </div>
  </div>
)

// ─── Analytics Skeleton ───────────────────────────────────────────────────────

export const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading analytics">
    <span className="sr-only">Loading analytics…</span>

    <SkeletonPageHeader wide />

    {/* KPI row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <SkeletonMetricCard key={i} />)}
    </div>

    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main trend chart */}
      <div className="lg:col-span-8 bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
        <SkeletonCardHeader actionWidth="w-32" />
        <div className="p-4">
          <Skeleton className="h-56 w-full" />
        </div>
      </div>

      {/* Donut chart */}
      <div className="lg:col-span-4 bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
        <SkeletonCardHeader actionWidth="w-16" />
        <div className="p-4 flex flex-col items-center gap-4">
          <Skeleton className="h-40 w-40 rounded-full" />
          <div className="w-full space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-2.5 flex-1" />
                <Skeleton className="h-2.5 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Budget performance + top expenses */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
        <SkeletonCardHeader />
        <div className="p-4">
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
      <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
        <SkeletonCardHeader />
        {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
      </div>
    </div>
  </div>
)

// ─── Settings Skeleton ────────────────────────────────────────────────────────

export const SettingsSkeleton: React.FC = () => (
  <div className="space-y-5" role="status" aria-label="Loading settings">
    <span className="sr-only">Loading settings…</span>

    <div className="pb-3 border-b border-[#d2d9e4] space-y-2">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-3 w-64" />
    </div>

    {/* Two-column settings layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-5">
        {/* Profile card */}
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-24" />
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-9 w-full rounded-[3px]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional card */}
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-24" />
          <div className="p-5 grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-9 w-full rounded-[3px]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-5">
        {/* Sessions card */}
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-20" />
          <div className="p-3 space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-3 border border-[#f0f4f8] rounded-[3px] space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-5 w-16 rounded-[3px]" />
                </div>
                <Skeleton className="h-2.5 w-40" />
                <Skeleton className="h-2.5 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Caliper alerts card */}
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden">
          <SkeletonCardHeader actionWidth="w-20" />
          <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-40" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)


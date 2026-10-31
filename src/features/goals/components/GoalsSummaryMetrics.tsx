import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { Target, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'

export interface GoalsSummaryMetricsProps {
  metrics: {
    totalTargetMinor: number
    totalAccumulatedMinor: number
    remainingToFundMinor: number
    overallPercentage: number
    activeCount: number
    completedCount: number
    totalCount: number
  }
}

export const GoalsSummaryMetrics: React.FC<GoalsSummaryMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Target Capital */}
      <Card className="border-l-[3px] border-l-[#161d26]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Total Target Capital
          </span>
          <Target className="w-4 h-4 text-[#161d26]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(metrics.totalTargetMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          Across {metrics.activeCount} active wealth targets
        </p>
      </Card>

      {/* Total Capital Accumulated */}
      <Card className="border-l-[3px] border-l-[#059669]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Accumulated Savings
          </span>
          <TrendingUp className="w-4 h-4 text-[#059669]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#059669] tabular-nums tracking-tight">
          {formatCurrency(metrics.totalAccumulatedMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          {formatPercentage(metrics.overallPercentage)} of active capital funded
        </p>
      </Card>

      {/* Remaining Capital to Fund */}
      <Card className="border-l-[3px] border-l-[#d97706]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Remaining Capital
          </span>
          <Sparkles className="w-4 h-4 text-[#d97706]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(metrics.remainingToFundMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          Required to reach all target milestones
        </p>
      </Card>

      {/* Completed & Active Counts */}
      <Card className="border-l-[3px] border-l-[#2563eb]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Goal Milestone Health
          </span>
          <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="inflow" size="md">
            {metrics.completedCount} Completed
          </Badge>
          <Badge variant="neutral" size="md">
            {metrics.activeCount} In Progress
          </Badge>
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-2">
          {metrics.totalCount} total lifelong & emergency vaults
        </p>
      </Card>
    </div>
  )
}


import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { SlidersHorizontal, ArrowDownRight, Scale, AlertTriangle } from 'lucide-react'

export interface BudgetSummaryMetricsProps {
  metrics: {
    totalLimitMinor: number
    totalSpentMinor: number
    remainingMinor: number
    overallPercentage: number
    warningCount: number
    exceededCount: number
    totalCount: number
  }
}

export const BudgetSummaryMetrics: React.FC<BudgetSummaryMetricsProps> = ({ metrics }) => {
  const isOverallDeficit = metrics.remainingMinor < 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Budget Limit */}
      <Card className="border-l-[3px] border-l-[#161d26]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Total Budget Ceiling
          </span>
          <SlidersHorizontal className="w-4 h-4 text-[#161d26]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(metrics.totalLimitMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          Across {metrics.totalCount} category spending limits
        </p>
      </Card>

      {/* Total Consumed */}
      <Card className="border-l-[3px] border-l-[#dc2626]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Total Outflow Consumed
          </span>
          <ArrowDownRight className="w-4 h-4 text-[#dc2626]" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(metrics.totalSpentMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-1">
          {formatPercentage(metrics.overallPercentage)} of allocated ceiling
        </p>
      </Card>

      {/* Remaining Headroom */}
      <Card
        className={`border-l-[3px] ${
          isOverallDeficit ? 'border-l-[#dc2626]' : 'border-l-[#059669]'
        }`}
      >
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Remaining Headroom
          </span>
          <Scale className="w-4 h-4 text-[#161d26]" />
        </div>
        <div
          className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${
            isOverallDeficit ? 'text-[#dc2626]' : 'text-[#059669]'
          }`}
        >
          {formatCurrency(metrics.remainingMinor, 'BDT', { showPositiveSign: true })}
        </div>
        <p className="text-[10px] font-mono mt-1">
          {isOverallDeficit ? (
            <span className="text-[#dc2626] font-semibold">Overall budget exceeded</span>
          ) : (
            <span className="text-[#059669] font-medium">Available before month-end</span>
          )}
        </p>
      </Card>

      {/* Caliper Health Status */}
      <Card className="border-l-[3px] border-l-[#d97706]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Caliper Threshold Alerts
          </span>
          <AlertTriangle className="w-4 h-4 text-[#d97706]" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          {metrics.exceededCount > 0 ? (
            <Badge variant="critical" size="md">
              {metrics.exceededCount} Over Limit
            </Badge>
          ) : (
            <Badge variant="inflow" size="md">
              0 Over Limit
            </Badge>
          )}

          {metrics.warningCount > 0 && (
            <Badge variant="warning" size="md">
              {metrics.warningCount} ≥ 80% Caliper
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-2">
          {metrics.totalCount - metrics.exceededCount - metrics.warningCount} on safe track (&lt;80%)
        </p>
      </Card>
    </div>
  )
}


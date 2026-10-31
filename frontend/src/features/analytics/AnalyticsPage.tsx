import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { BarChart3 } from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Financial Analytics & Trends
        </h1>
        <p className="text-xs text-[#64748b]">
          Recharts-powered cash flow trends, category distributions, and month-over-month analytics.
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<BarChart3 className="w-6 h-6" />}
          title="Analytics & Recharts Scheduled for Stage 6"
          description="In-depth monthly breakdown charts and historical trend visualizations will be introduced in Stage 6."
        />
      </Card>
    </div>
  )
}


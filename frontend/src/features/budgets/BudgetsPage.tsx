import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { SlidersHorizontal } from 'lucide-react'

export const BudgetsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Monthly Budgets & Calipers
        </h1>
        <p className="text-xs text-[#64748b]">
          Category spending limits with 80% warning and 100% hard limit calipers.
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<SlidersHorizontal className="w-6 h-6" />}
          title="Monthly Category Budgets Scheduled for Stage 5"
          description="Establish monthly spending caps and configure proactive caliper alerts in Stage 5."
        />
      </Card>
    </div>
  )
}


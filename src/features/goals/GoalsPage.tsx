import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { Target } from 'lucide-react'

export const GoalsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Savings Goals & Vault Allocations
        </h1>
        <p className="text-xs text-[#64748b]">
          Dedicated goal progress tracking with contribution ledgers.
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<Target className="w-6 h-6" />}
          title="Savings Goals Scheduled for Stage 7"
          description="Track long-term savings targets, emergency funds, and investment contributions in Stage 7."
        />
      </Card>
    </div>
  )
}


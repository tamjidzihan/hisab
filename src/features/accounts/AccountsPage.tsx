import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { Landmark } from 'lucide-react'

export const AccountsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Accounts & Categories
        </h1>
        <p className="text-xs text-[#64748b]">
          Account vaults (cash, bank, MFS) and customizable income/expense categories.
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<Landmark className="w-6 h-6" />}
          title="Account Vaults Scheduled for Stage 4"
          description="Manage opening balances, account reconciliation, and category icons in Stage 4."
        />
      </Card>
    </div>
  )
}


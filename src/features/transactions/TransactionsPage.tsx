import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { Receipt } from 'lucide-react'

export const TransactionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Transactions Ledger
        </h1>
        <p className="text-xs text-[#64748b]">
          Complete double-entry record with filters, search, and CSV import/export.
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<Receipt className="w-6 h-6" />}
          title="Full Transaction Ledger Ready for Stage 3"
          description="Advanced filtering, pagination, payee search, and linked transfer pairs will be established in Stage 3."
        />
      </Card>
    </div>
  )
}


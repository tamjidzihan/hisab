import React from 'react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ArrowDownRight, History } from 'lucide-react'
import type { GoalContribution } from '../useSavingsGoals'

export interface ContributionHistoryTableProps {
  contributions: GoalContribution[]
}

export const ContributionHistoryTable: React.FC<ContributionHistoryTableProps> = ({
  contributions,
}) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-[#d2d9e4] flex items-center justify-between bg-[#f8fafc]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#161d26]" />
          <h3 className="text-xs font-bold text-[#161d26] uppercase tracking-wider font-mono">
            Savings Contribution Ledger
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#64748b]">
          {contributions.length} recorded {contributions.length === 1 ? 'allocation' : 'allocations'}
        </span>
      </div>

      {contributions.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={<History className="w-5 h-5" />}
            title="No goal deposits recorded"
            description="Deposits allocated to your savings goals will appear here in chronological order."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#64748b] border-b border-[#d2d9e4] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Allocation Date</th>
                <th className="py-2.5 px-4 font-semibold">Target Goal</th>
                <th className="py-2.5 px-4 font-semibold">Fund Source</th>
                <th className="py-2.5 px-4 font-semibold">Memo / Notes</th>
                <th className="py-2.5 px-4 font-semibold text-right">Capital Deposited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eaf0]">
              {contributions.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-[#64748b] tabular-nums whitespace-nowrap">
                    {formatDate(item.date, 'dd MMM yyyy')}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#161d26]">
                    {item.goalName}
                  </td>
                  <td className="py-2.5 px-4 text-[#64748b] font-mono text-[11px]">
                    {item.accountName || 'Primary Checking'}
                  </td>
                  <td className="py-2.5 px-4 text-[#64748b] text-[11px] max-w-[240px] truncate">
                    {item.notes || '—'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-[#059669] tabular-nums whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5">
                      <ArrowDownRight className="w-3.5 h-3.5 text-[#059669]" />
                      +{formatCurrency(item.amountMinor)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}


import React from 'react'
import { Card } from '@/components/common/Card'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { TopExpenseItem } from '../useAnalytics'

export interface TopExpensesTableProps {
  topExpenses: TopExpenseItem[]
}

export const TopExpensesTable: React.FC<TopExpensesTableProps> = ({ topExpenses }) => {
  return (
    <Card
      header={
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
            Significant Outflows & Largest Transactions
          </h3>
          <p className="text-[11px] text-[#64748b]">
            Top individual expenditures posted in the selected period
          </p>
        </div>
      }
    >
      <div className="overflow-x-auto -mx-5 -mb-5">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#d2d9e4] bg-[#fafbfd] text-[#64748b] text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-4 font-semibold">Date</th>
              <th className="py-2.5 px-4 font-semibold">Payee & Purpose</th>
              <th className="py-2.5 px-4 font-semibold">Category</th>
              <th className="py-2.5 px-4 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eaf0]">
            {topExpenses.map((item) => (
              <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="py-2.5 px-4 text-[#64748b] whitespace-nowrap">
                  {formatDate(item.date, 'dd MMM yyyy')}
                </td>
                <td className="py-2.5 px-4 font-sans">
                  <span className="font-semibold text-[#161d26] block leading-tight">
                    {item.description}
                  </span>
                  {item.payee && (
                    <span className="text-[10px] text-[#64748b] font-mono">{item.payee}</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-[#64748b] whitespace-nowrap">
                  {item.categoryName}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums font-bold text-[#dc2626] whitespace-nowrap">
                  -{formatCurrency(item.amountMinor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}


import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ArrowRight, Receipt, ArrowRightLeft } from 'lucide-react'
import type { Transaction } from '@/types'

export interface RecentTransactionsLedgerProps {
  transactions: Transaction[]
}

export const RecentTransactionsLedger: React.FC<RecentTransactionsLedgerProps> = ({
  transactions,
}) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#161d26]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Recent Posted Transactions
            </h3>
          </div>
          <Link
            to="/transactions"
            className="text-[11px] text-[#161d26] hover:underline font-medium inline-flex items-center gap-1"
          >
            Full Ledger ({transactions.length}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      }
    >
      {transactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#64748b]">
          <p>No transactions posted for this calendar month.</p>
          <Link to="/transactions" className="text-[#161d26] font-semibold underline mt-1 inline-block">
            Log New Transaction
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#d2d9e4] bg-[#fafbfd] text-[#64748b] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4 font-semibold">Date</th>
                <th className="py-2.5 px-4 font-semibold">Payee & Description</th>
                <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Account</th>
                <th className="py-2.5 px-4 font-semibold">Classification</th>
                <th className="py-2.5 px-4 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eaf0]">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income'
                const isExpense = tx.type === 'expense'
                const isTransfer = tx.type === 'transfer'

                return (
                  <tr key={tx.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#64748b] whitespace-nowrap">
                      {formatDate(tx.transactionDate, 'dd MMM yyyy')}
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#161d26] leading-tight line-clamp-1">
                        {tx.description}
                      </div>
                      {tx.payee && (
                        <div className="text-[10px] text-[#64748b] font-mono mt-0.5">
                          {tx.payee}
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-[#64748b] text-xs hidden sm:table-cell whitespace-nowrap">
                      {tx.accountName || '—'}
                      {isTransfer && tx.transferDestinationAccountName && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#2563eb] ml-1 font-mono">
                          <ArrowRightLeft className="w-2.5 h-2.5" />
                          {tx.transferDestinationAccountName}
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {isIncome && (
                        <Badge variant="inflow" size="sm">
                          INFLOW
                        </Badge>
                      )}
                      {isExpense && (
                        <Badge variant="expense" size="sm">
                          EXPENSE
                        </Badge>
                      )}
                      {isTransfer && (
                        <Badge variant="transfer" size="sm">
                          TRANSFER
                        </Badge>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right font-mono text-xs tabular-nums font-bold whitespace-nowrap">
                      {isIncome && (
                        <span className="text-[#059669]">
                          +{formatCurrency(tx.amountMinor)}
                        </span>
                      )}
                      {isExpense && (
                        <span className="text-[#161d26]">
                          -{formatCurrency(tx.amountMinor)}
                        </span>
                      )}
                      {isTransfer && (
                        <span className="text-[#2563eb]">
                          {formatCurrency(tx.amountMinor)}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

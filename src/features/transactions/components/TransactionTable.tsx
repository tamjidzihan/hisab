import React from 'react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { formatCurrency, formatDate } from '@/lib/formatters'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react'
import type { Transaction } from '@/types'

export interface TransactionTableProps {
  transactions: Transaction[]
  sortField: 'transactionDate' | 'amountMinor' | 'description'
  sortOrder: 'asc' | 'desc'
  onToggleSort: (field: 'transactionDate' | 'amountMinor' | 'description') => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  page: number
  totalPages: number
  pageSize: number
  totalCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newSize: number) => void
  onResetFilters?: () => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  sortField,
  sortOrder,
  onToggleSort,
  onEdit,
  onDelete,
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
}) => {
  const getSortIcon = (field: 'transactionDate' | 'amountMinor' | 'description') => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#94a3b8] ml-1 inline" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#161d26] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#161d26] ml-1 inline" />
    )
  }

  const startRecord = (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, totalCount)

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-6 h-6" />}
        title="No Transactions Found"
        description="No ledger postings match your active filter criteria."
        actionLabel={onResetFilters ? 'Clear Filters' : undefined}
        onAction={onResetFilters}
      />
    )
  }

  return (
    <div className="bg-white border border-[#d2d9e4] rounded-[6px] overflow-hidden shadow-2xs">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#d2d9e4] bg-[#fafbfd] text-[#64748b] font-mono uppercase tracking-wider text-[11px] select-none">
              <th
                className="py-2.5 px-4 font-semibold cursor-pointer hover:text-[#161d26] transition-colors"
                onClick={() => onToggleSort('transactionDate')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {getSortIcon('transactionDate')}
                </div>
              </th>

              <th
                className="py-2.5 px-4 font-semibold cursor-pointer hover:text-[#161d26] transition-colors"
                onClick={() => onToggleSort('description')}
              >
                <div className="flex items-center">
                  <span>Payee / Description</span>
                  {getSortIcon('description')}
                </div>
              </th>

              <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Account Vault</th>
              <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Category</th>
              <th className="py-2.5 px-4 font-semibold">Classification</th>

              <th
                className="py-2.5 px-4 text-right font-semibold cursor-pointer hover:text-[#161d26] transition-colors"
                onClick={() => onToggleSort('amountMinor')}
              >
                <div className="flex items-center justify-end">
                  <span>Amount</span>
                  {getSortIcon('amountMinor')}
                </div>
              </th>

              <th className="py-2.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eaf0]">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income'
              const isExpense = tx.type === 'expense'
              const isTransfer = tx.type === 'transfer'

              return (
                <tr key={tx.id} className="hover:bg-[#f8fafc] transition-colors group">
                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-[11px] text-[#64748b] whitespace-nowrap">
                    {formatDate(tx.transactionDate, 'dd MMM yyyy')}
                  </td>

                  {/* Description & Payee */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-[#161d26] leading-tight truncate">
                      {tx.description}
                    </div>
                    {tx.payee && (
                      <div className="text-[10px] text-[#64748b] font-mono mt-0.5 truncate">
                        {tx.payee}
                      </div>
                    )}
                  </td>

                  {/* Account Vault */}
                  <td className="py-3 px-4 text-[#64748b] text-xs hidden md:table-cell whitespace-nowrap">
                    <span className="font-medium text-[#161d26]">{tx.accountName || 'Primary Vault'}</span>
                    {isTransfer && tx.transferDestinationAccountName && (
                      <div className="flex items-center gap-1 text-[10px] text-[#2563eb] font-mono mt-0.5">
                        <ArrowRightLeft className="w-2.5 h-2.5" />
                        <span>{tx.transferDestinationAccountName}</span>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap">
                    {tx.categoryName ? (
                      <span className="inline-block text-[11px] font-medium text-[#64748b] px-2 py-0.5 rounded-[3px] bg-[#f4f6f9] border border-[#e2e8f0]">
                        {tx.categoryName}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#94a3b8] font-mono">—</span>
                    )}
                  </td>

                  {/* Classification */}
                  <td className="py-3 px-4 whitespace-nowrap">
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

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-mono text-xs tabular-nums font-bold whitespace-nowrap">
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

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(tx)}
                        aria-label={`Edit ${tx.description}`}
                        className="p-1 rounded-[3px] text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        aria-label={`Delete ${tx.description}`}
                        className="p-1 rounded-[3px] text-[#64748b] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-[#e5eaf0] bg-[#fafbfd] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748b]">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>
            Showing <strong className="text-[#161d26]">{startRecord}</strong> to{' '}
            <strong className="text-[#161d26]">{endRecord}</strong> of{' '}
            <strong className="text-[#161d26]">{totalCount}</strong> transactions
          </span>
          <span className="hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-6 text-xs bg-white border border-[#d2d9e4] rounded-[3px] px-1 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous Page"
            className="h-7 text-xs px-2"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Prev
          </Button>

          <span className="text-xs font-mono px-2">
            Page {page} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next Page"
            className="h-7 text-xs px-2"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}


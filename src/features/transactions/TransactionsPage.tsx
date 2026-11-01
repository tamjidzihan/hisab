import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useTransactions } from './useTransactions'
import { TransactionFilterBar } from './components/TransactionFilterBar'
import { TransactionTable } from './components/TransactionTable'
import { TransactionModal } from './components/TransactionModal'
import { CsvImportModal } from './components/CsvImportModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { exportTransactionsToCsv } from './csvUtils'
import { useAccountsAndCategories } from '@/features/accounts/useAccountsAndCategories'
import { formatCurrency } from '@/lib/formatters'
import { TransactionsSkeleton } from '@/components/common/SkeletonScreens'
import type { Transaction } from '@/types'

export const TransactionsPage: React.FC = () => {
  const { accounts, categories } = useAccountsAndCategories()
  const activeAccounts = useMemo(
    () => accounts.filter((account) => !account.isArchived),
    [accounts]
  )
  const activeCategories = useMemo(
    () => categories.filter((category) => !category.isArchived),
    [categories]
  )

  const {
    filteredTransactions,
    paginatedTransactions,
    metrics,
    filters,
    setFilters,
    resetFilters,
    sortField,
    sortOrder,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    availableAccounts,
    availableCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    bulkImportTransactions,
    isLoading,
  } = useTransactions()

  // Modal Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  if (isLoading) return <TransactionsSkeleton />

  // Handlers
  const handleOpenCreate = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx)
    setIsModalOpen(true)
  }

  const handleSaveTransaction = (
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
      toast.success('Transaction updated successfully.')
    } else {
      createTransaction(data)
      toast.success(
        `Logged ${data.type.toUpperCase()}: ${formatCurrency(data.amountMinor)} for ${data.description}`
      )
    }
  }

  const handleDeletePrompt = (tx: Transaction) => {
    setDeletingTransaction(tx)
  }

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      const deleted = deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
      if (deleted) {
        toast('Transaction removed from ledger.', {
          action: {
            label: 'Undo',
            onClick: () => {
              restoreTransaction(deleted)
              toast.success('Transaction restored.')
            },
          },
        })
      }
    }
  }

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions available to export.')
      return
    }
    exportTransactionsToCsv(filteredTransactions)
    toast.success(`Exported ${filteredTransactions.length} transaction records as CSV.`)
  }

  const handleImportSuccess = (newTransactions: Transaction[]) => {
    bulkImportTransactions(newTransactions)
    toast.success(`Successfully imported ${newTransactions.length} transactions into ledger.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Realtime Filtered Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Transactions Ledger
          </h1>
          <p className="text-xs text-[#64748b]">
            Auditable double-entry records with linked transfers and CSV synchronisation.
          </p>
        </div>

        {/* Dynamic Filtered Summary Badges */}
        <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
          <div className="px-2.5 py-1 rounded-[4px] bg-white border border-[#d2d9e4] flex items-center gap-1.5 shadow-2xs">
            <span className="text-[#64748b] text-[10px] uppercase">Records:</span>
            <strong className="text-[#161d26]">{metrics.count}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-[4px] bg-[#ecfdf5] border border-[#a7f3d0] flex items-center gap-1.5 text-[#059669]">
            <span className="text-[10px] uppercase font-semibold">Inflow:</span>
            <strong className="tabular-nums font-bold">+{formatCurrency(metrics.inflowMinor)}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-[4px] bg-[#fef2f2] border border-[#fecaca] flex items-center gap-1.5 text-[#dc2626]">
            <span className="text-[10px] uppercase font-semibold">Outflow:</span>
            <strong className="tabular-nums font-bold">-{formatCurrency(metrics.outflowMinor)}</strong>
          </div>

          <div className="px-2.5 py-1 rounded-[4px] bg-white border border-[#d2d9e4] flex items-center gap-1.5">
            <span className="text-[#64748b] text-[10px] uppercase font-semibold">Net:</span>
            <strong
              className={`tabular-nums font-bold ${
                metrics.netCashFlowMinor >= 0 ? 'text-[#059669]' : 'text-[#dc2626]'
              }`}
            >
              {formatCurrency(metrics.netCashFlowMinor, 'BDT', { showPositiveSign: true })}
            </strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TransactionFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        onOpenCreateModal={handleOpenCreate}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportCsv={handleExportCsv}
        availableAccounts={availableAccounts}
        availableCategories={availableCategories}
      />

      {/* Main Ledger Table */}
      <TransactionTable
        transactions={paginatedTransactions}
        sortField={sortField}
        sortOrder={sortOrder}
        onToggleSort={toggleSort}
        onEdit={handleOpenEdit}
        onDelete={handleDeletePrompt}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={filteredTransactions.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onResetFilters={resetFilters}
      />

      {/* Create / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
        availableAccounts={activeAccounts}
        availableCategories={activeCategories}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSuccess}
        accounts={activeAccounts}
        categories={activeCategories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
      />
    </div>
  )
}

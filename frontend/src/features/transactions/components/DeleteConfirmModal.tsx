import React from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { AlertCircle } from 'lucide-react'
import type { Transaction } from '@/types'

export interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transaction: Transaction | null
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}) => {
  if (!transaction) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Ledger Deletion"
      description="This transaction will be removed from your accounts and cash flow records."
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Delete Transaction
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[4px] text-xs text-[#991b1b]">
          <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />
          <p>
            Are you sure you want to delete this posted record? Account balances and category totals will adjust immediately.
          </p>
        </div>

        <div className="p-3 bg-[#f4f6f9] border border-[#d2d9e4] rounded-[4px] space-y-1.5 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-[#64748b]">Description:</span>
            <span className="font-semibold text-[#161d26] font-sans truncate max-w-[180px]">
              {transaction.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Date:</span>
            <span className="text-[#161d26]">
              {formatDate(transaction.transactionDate, 'dd MMM yyyy')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Amount:</span>
            <span className="font-bold text-[#161d26] tabular-nums">
              {formatCurrency(transaction.amountMinor)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Account:</span>
            <span className="text-[#161d26]">{transaction.accountName || 'Primary'}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}


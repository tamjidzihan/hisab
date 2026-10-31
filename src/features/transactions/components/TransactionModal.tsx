import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { parseToMinorUnits } from '@/lib/formatters'
import type { Transaction, TransactionType } from '@/types'

export interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialTransaction?: Transaction | null
  availableAccounts: string[]
  availableCategories: string[]
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
  availableAccounts,
  availableCategories,
}) => {
  const isEditing = Boolean(initialTransaction)

  // Form State
  const [type, setType] = useState<TransactionType>('expense')
  const [amountStr, setAmountStr] = useState('')
  const [transactionDate, setTransactionDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )
  const [description, setDescription] = useState('')
  const [payee, setPayee] = useState('')
  const [accountName, setAccountName] = useState('Prime Bank Current')
  const [destinationAccountName, setDestinationAccountName] = useState('bKash Primary MFS')
  const [categoryName, setCategoryName] = useState('Groceries & Dining')
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [notes, setNotes] = useState('')

  // Validation Error state
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type)
      setAmountStr((initialTransaction.amountMinor / 100).toFixed(2))
      setTransactionDate(initialTransaction.transactionDate)
      setDescription(initialTransaction.description)
      setPayee(initialTransaction.payee || '')
      setAccountName(initialTransaction.accountName || availableAccounts[0] || 'Primary Vault')
      setDestinationAccountName(
        initialTransaction.transferDestinationAccountName ||
          availableAccounts[1] ||
          'Secondary Vault'
      )
      setCategoryName(initialTransaction.categoryName || availableCategories[0] || 'General')
      setPaymentMethod(initialTransaction.paymentMethod || 'Bank Transfer')
      setNotes(initialTransaction.notes || '')
    } else {
      setType('expense')
      setAmountStr('')
      setTransactionDate(new Date().toISOString().slice(0, 10))
      setDescription('')
      setPayee('')
      setAccountName(availableAccounts[0] || 'Prime Bank Current')
      setDestinationAccountName(availableAccounts[1] || 'bKash Primary MFS')
      setCategoryName(availableCategories[0] || 'Groceries & Dining')
      setPaymentMethod('Bank Transfer')
      setNotes('')
    }
    setErrors({})
  }, [initialTransaction, isOpen, availableAccounts, availableCategories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    const amountMinor = parseToMinorUnits(amountStr)
    if (amountMinor <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero.'
    }

    if (!description.trim()) {
      newErrors.description = 'Transaction description is required.'
    }

    if (!transactionDate) {
      newErrors.date = 'Transaction date is required.'
    }

    if (type === 'transfer' && accountName === destinationAccountName) {
      newErrors.destinationAccount = 'Destination vault cannot be identical to source vault.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      userId: 'usr-1',
      accountId: `acc-${accountName.toLowerCase().replace(/\s+/g, '-')}`,
      accountName,
      categoryId: type === 'transfer' ? null : `cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
      categoryName: type === 'transfer' ? undefined : categoryName,
      type,
      amountMinor,
      currency: 'BDT',
      transactionDate,
      description: description.trim(),
      payee: payee.trim() || undefined,
      paymentMethod,
      transferGroupId: type === 'transfer' ? `trf-${Date.now()}` : undefined,
      transferDestinationAccountId:
        type === 'transfer'
          ? `acc-${destinationAccountName.toLowerCase().replace(/\s+/g, '-')}`
          : undefined,
      transferDestinationAccountName:
        type === 'transfer' ? destinationAccountName : undefined,
      notes: notes.trim() || undefined,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Ledger Entry' : 'Log New Transaction'}
      description="Records are permanently posted in integer minor units (paisa)."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Post to Ledger'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Selector (Toggle buttons) */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#161d26] block mb-1.5">
            Classification
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#f4f6f9] border border-[#d2d9e4] rounded-[4px]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-1.5 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                type === 'expense'
                  ? 'bg-white text-[#dc2626] shadow-2xs border border-[#d2d9e4]'
                  : 'text-[#64748b] hover:text-[#161d26]'
              }`}
            >
              Outflow (Expense)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-1.5 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                type === 'income'
                  ? 'bg-white text-[#059669] shadow-2xs border border-[#d2d9e4]'
                  : 'text-[#64748b] hover:text-[#161d26]'
              }`}
            >
              Inflow (Income)
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-1.5 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer ${
                type === 'transfer'
                  ? 'bg-white text-[#2563eb] shadow-2xs border border-[#d2d9e4]'
                  : 'text-[#64748b] hover:text-[#161d26]'
              }`}
            >
              Transfer (Linked)
            </button>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Amount (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            error={errors.amount}
            required
          />

          <Input
            label="Transaction Date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            error={errors.date}
            required
          />
        </div>

        {/* Description & Payee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Description / Purpose"
            placeholder="e.g. Monthly Broadband, Groceries, Client Retainer"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
          />

          <Input
            label="Payee / Merchant / Entity"
            placeholder="e.g. Shwapno, Carnival, TechCorp"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>

        {/* Vault Accounts (With Transfer Support) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={type === 'transfer' ? 'Source Vault' : 'Account Vault'}
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            options={availableAccounts.map((acc) => ({ value: acc, label: acc }))}
          />

          {type === 'transfer' ? (
            <Select
              label="Destination Vault"
              value={destinationAccountName}
              onChange={(e) => setDestinationAccountName(e.target.value)}
              error={errors.destinationAccount}
              options={availableAccounts.map((acc) => ({ value: acc, label: acc }))}
            />
          ) : (
            <Select
              label="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              options={availableCategories.map((cat) => ({ value: cat, label: cat }))}
            />
          )}
        </div>

        {/* Payment Method */}
        <Select
          label="Payment Instrument / Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            { value: 'Bank Transfer', label: 'Bank Transfer / BEFTN / NPSB' },
            { value: 'bKash MFS', label: 'bKash Mobile Financial Service' },
            { value: 'Nagad MFS', label: 'Nagad Mobile Financial Service' },
            { value: 'Debit Card', label: 'Debit Card' },
            { value: 'Credit Card', label: 'Credit Card' },
            { value: 'Cash', label: 'Cash Currency' },
          ]}
        />

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#161d26]">
            Auditing Notes / Reference (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional context, receipt number, or tax deduction notes..."
            className="w-full px-3 py-2 bg-white text-[#161d26] text-xs rounded-[4px] border border-[#d2d9e4] focus:outline-none focus:border-[#161d26] focus:ring-1 focus:ring-[#161d26] transition-colors resize-none"
          />
        </div>
      </form>
    </Modal>
  )
}


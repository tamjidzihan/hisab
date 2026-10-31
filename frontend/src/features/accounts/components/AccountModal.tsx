import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { parseToMinorUnits } from '@/lib/formatters'
import type { Account, AccountType } from '@/types'

export interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Account, 'id' | 'currentBalanceMinor' | 'isArchived'>) => void
  initialAccount?: Account | null
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAccount,
}) => {
  const isEditing = Boolean(initialAccount)

  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('bank')
  const [openingBalanceStr, setOpeningBalanceStr] = useState('')
  const [accountNumberMasked, setAccountNumberMasked] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialAccount) {
      setName(initialAccount.name)
      setType(initialAccount.type)
      setOpeningBalanceStr((initialAccount.openingBalanceMinor / 100).toFixed(2))
      setAccountNumberMasked(initialAccount.accountNumberMasked || '')
    } else {
      setName('')
      setType('bank')
      setOpeningBalanceStr('0.00')
      setAccountNumberMasked('')
    }
    setErrors({})
  }, [initialAccount, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Account vault name is required.'
    }

    const openingMinor = parseToMinorUnits(openingBalanceStr)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      userId: 'usr-1',
      name: name.trim(),
      type,
      currency: 'BDT',
      openingBalanceMinor: openingMinor,
      accountNumberMasked: accountNumberMasked.trim() || undefined,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Configure Account Vault' : 'Establish New Account Vault'}
      description="Account balances are derived from opening baseline plus posted double-entry transactions."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isEditing ? 'Save Vault Settings' : 'Create Vault'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vault Name"
          placeholder="e.g. City Bank Savings, Cash in Hand, bKash Primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Account Classification"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            options={[
              { value: 'bank', label: 'Commercial Bank Account' },
              { value: 'mobile_wallet', label: 'Mobile Financial Service (MFS)' },
              { value: 'cash', label: 'Physical Cash Wallet' },
              { value: 'card', label: 'Credit Card Vault' },
              { value: 'other', label: 'Other Asset / Custody' },
            ]}
          />

          <Input
            label="Opening Balance (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
            value={openingBalanceStr}
            onChange={(e) => setOpeningBalanceStr(e.target.value)}
            disabled={isEditing} // Opening balance locked after creation to preserve ledger history
            helperText={
              isEditing ? 'Opening balance is locked to preserve ledger auditability.' : undefined
            }
          />
        </div>

        <Input
          label="Masked Number / Identifier (Optional)"
          placeholder="e.g. •••• 4892 or 017••••5678"
          value={accountNumberMasked}
          onChange={(e) => setAccountNumberMasked(e.target.value)}
          helperText="Display-only reference for quick account identification."
        />
      </form>
    </Modal>
  )
}


import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { formatCurrency, parseToMinorUnits } from '@/lib/formatters'
import { ArrowRightLeft } from 'lucide-react'
import type { Account } from '@/types'

export interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (sourceId: string, destId: string, amountMinor: number) => void
  accounts: Account[]
  defaultSourceAccount?: Account | null
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  accounts,
  defaultSourceAccount,
}) => {
  const activeAccounts = accounts.filter((a) => !a.isArchived)

  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (defaultSourceAccount) {
      setSourceId(defaultSourceAccount.id)
      const other = activeAccounts.find((a) => a.id !== defaultSourceAccount.id)
      if (other) setDestId(other.id)
    } else if (activeAccounts.length >= 2) {
      setSourceId(activeAccounts[0].id)
      setDestId(activeAccounts[1].id)
    }
    setAmountStr('')
    setError(null)
  }, [defaultSourceAccount, isOpen])

  const sourceAccount = activeAccounts.find((a) => a.id === sourceId)
  const destAccount = activeAccounts.find((a) => a.id === destId)

  const amountMinor = parseToMinorUnits(amountStr)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (sourceId === destId) {
      setError('Destination vault cannot be the same as the source vault.')
      return
    }

    if (amountMinor <= 0) {
      setError('Please enter a transfer amount greater than zero.')
      return
    }

    if (sourceAccount && sourceAccount.currentBalanceMinor < amountMinor) {
      setError(
        `Insufficient balance in ${sourceAccount.name} (${formatCurrency(
          sourceAccount.currentBalanceMinor
        )}).`
      )
      return
    }

    onTransfer(sourceId, destId, amountMinor)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inter-Vault Fund Transfer"
      description="Transfers move liquidity between accounts without altering net income or expense totals."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Execute Transfer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source and Destination Vaults */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Source Vault (Debit)"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            options={activeAccounts.map((acc) => ({
              value: acc.id,
              label: `${acc.name} (${formatCurrency(acc.currentBalanceMinor)})`,
            }))}
          />

          <Select
            label="Destination Vault (Credit)"
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            options={activeAccounts.map((acc) => ({
              value: acc.id,
              label: `${acc.name} (${formatCurrency(acc.currentBalanceMinor)})`,
            }))}
          />
        </div>

        {/* Transfer Amount */}
        <Input
          label="Transfer Amount (BDT)"
          type="number"
          step="0.01"
          placeholder="0.00"
          prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          required
        />

        {/* Balance Preview Card */}
        {sourceAccount && destAccount && amountMinor > 0 && (
          <div className="p-3 bg-[#f4f6f9] border border-[#d2d9e4] rounded-[4px] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#2563eb] font-semibold border-b border-[#e2e8f0] pb-1">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Projected Balance Adjustments</span>
            </div>
            <div className="flex justify-between items-center text-[#161d26]">
              <span>{sourceAccount.name}:</span>
              <span className="tabular-nums">
                {formatCurrency(sourceAccount.currentBalanceMinor)} →{' '}
                <strong className="text-[#dc2626]">
                  {formatCurrency(sourceAccount.currentBalanceMinor - amountMinor)}
                </strong>
              </span>
            </div>
            <div className="flex justify-between items-center text-[#161d26]">
              <span>{destAccount.name}:</span>
              <span className="tabular-nums">
                {formatCurrency(destAccount.currentBalanceMinor)} →{' '}
                <strong className="text-[#059669]">
                  {formatCurrency(destAccount.currentBalanceMinor + amountMinor)}
                </strong>
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-[#dc2626] font-medium" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}


import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { parseToMinorUnits } from '@/lib/formatters'
import type { Account, SavingsGoal } from '@/types'

export interface ContributionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddContribution: (
    goalId: string,
    amountMinor: number,
    date: string,
    accountId?: string,
    accountName?: string,
    notes?: string
  ) => void
  goals: SavingsGoal[]
  defaultGoal?: SavingsGoal | null
  availableAccounts?: Account[]
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  onAddContribution,
  goals,
  defaultGoal,
  availableAccounts = [],
}) => {
  const activeGoals = goals.filter((g) => g.status !== 'completed')

  const [goalId, setGoalId] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [accountId, setAccountId] = useState(availableAccounts[0]?.id || '')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (defaultGoal) {
      setGoalId(defaultGoal.id)
    } else if (activeGoals.length > 0) {
      setGoalId(activeGoals[0].id)
    }
    setAmountStr('')
    setDate(new Date().toISOString().slice(0, 10))
    setAccountId(availableAccounts[0]?.id || '')
    setNotes('')
    setError(null)
  }, [defaultGoal, isOpen, availableAccounts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!goalId) {
      setError('Please select a target goal.')
      return
    }

    const amountMinor = parseToMinorUnits(amountStr)
    if (amountMinor <= 0) {
      setError('Please enter a deposit amount greater than zero.')
      return
    }

    const account = availableAccounts.find((item) => item.id === accountId)
    onAddContribution(goalId, amountMinor, date, account?.id, account?.name, notes.trim() || undefined)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit Capital to Savings Goal"
      description="Allocates funds from your accounts toward a goal target without counting as an expense."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Confirm Deposit
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Target Goal"
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          options={activeGoals.map((g) => ({
            value: g.id,
            label: g.name,
          }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Deposit Amount (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            required
          />

          <Input
            label="Deposit Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <Select
          label="Source Account Vault"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          disabled={availableAccounts.length === 0}
          options={
            availableAccounts.length > 0
              ? availableAccounts.map((account) => ({
                  value: account.id,
                  label: account.name,
                }))
              : [{ value: '', label: 'No accounts available', disabled: true }]
          }
        />

        <Input
          label="Reference Notes (Optional)"
          placeholder="e.g. Allocation from client bonus, freelance gig, savings transfer"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && (
          <p className="text-xs text-[#dc2626] font-medium" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}

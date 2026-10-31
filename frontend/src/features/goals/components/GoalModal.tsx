import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { parseToMinorUnits } from '@/lib/formatters'
import type { SavingsGoal } from '@/types'

export interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<SavingsGoal, 'id' | 'userId'>) => void
  initialGoal?: SavingsGoal | null
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal)

  const [name, setName] = useState('')
  const [targetAmountStr, setTargetAmountStr] = useState('')
  const [currentAmountStr, setCurrentAmountStr] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [status, setStatus] = useState<SavingsGoal['status']>('active')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialGoal) {
      setName(initialGoal.name)
      setTargetAmountStr((initialGoal.targetAmountMinor / 100).toFixed(2))
      setCurrentAmountStr((initialGoal.currentAmountMinor / 100).toFixed(2))
      setTargetDate(initialGoal.targetDate || '')
      setStatus(initialGoal.status)
    } else {
      setName('')
      setTargetAmountStr('')
      setCurrentAmountStr('0.00')
      setTargetDate('')
      setStatus('active')
    }
    setErrors({})
  }, [initialGoal, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Goal title is required.'
    }

    const targetMinor = parseToMinorUnits(targetAmountStr)
    if (targetMinor <= 0) {
      newErrors.target = 'Please specify a target capital amount greater than zero.'
    }

    const currentMinor = parseToMinorUnits(currentAmountStr)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      name: name.trim(),
      targetAmountMinor: targetMinor,
      currentAmountMinor: currentMinor,
      targetDate: targetDate || undefined,
      status: currentMinor >= targetMinor ? 'completed' : status,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Configure Savings Goal' : 'Establish Savings Goal'}
      description="Track long-term wealth targets, emergency funds, and major milestone purchases."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isEditing ? 'Save Goal' : 'Establish Goal'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Name / Purpose"
          placeholder="e.g. 6-Month Emergency Vault, Hajj Pilgrimage, New Laptop"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Capital (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
            value={targetAmountStr}
            onChange={(e) => setTargetAmountStr(e.target.value)}
            error={errors.target}
            required
          />

          <Input
            label="Current Funded Baseline (BDT)"
            type="number"
            step="0.01"
            placeholder="0.00"
            prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
            value={currentAmountStr}
            onChange={(e) => setCurrentAmountStr(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Completion Date (Optional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <Select
            label="Milestone Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as SavingsGoal['status'])}
            options={[
              { value: 'active', label: 'Active (Accumulating)' },
              { value: 'paused', label: 'Paused (Temporarily on hold)' },
              { value: 'completed', label: 'Completed (Fully Funded)' },
            ]}
          />
        </div>
      </form>
    </Modal>
  )
}


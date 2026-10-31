import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { parseToMinorUnits } from '@/lib/formatters'
import type { Budget } from '@/types'

export interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Budget, 'id' | 'month' | 'spentMinor'>) => void
  initialBudget?: Budget | null
  availableCategories: Array<{ id: string; name: string; color: string }>
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBudget,
  availableCategories,
}) => {
  const isEditing = Boolean(initialBudget)

  const [categoryId, setCategoryId] = useState('')
  const [limitStr, setLimitStr] = useState('')
  const [alertThreshold, setAlertThreshold] = useState('0.8')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialBudget) {
      setCategoryId(initialBudget.categoryId || 'overall')
      setLimitStr((initialBudget.limitMinor / 100).toFixed(2))
      setAlertThreshold(initialBudget.alertThreshold.toString())
    } else {
      setCategoryId(availableCategories[0]?.id || 'overall')
      setLimitStr('')
      setAlertThreshold('0.8')
    }
    setErrors({})
  }, [initialBudget, isOpen, availableCategories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    const limitMinor = parseToMinorUnits(limitStr)
    if (limitMinor <= 0) {
      newErrors.limit = 'Please enter a valid spending ceiling greater than zero.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const selectedCategory = availableCategories.find((c) => c.id === categoryId)

    onSave({
      userId: 'usr-1',
      categoryId: categoryId === 'overall' ? null : categoryId,
      categoryName: categoryId === 'overall' ? 'Overall Monthly Ceiling' : selectedCategory?.name,
      categoryColor: selectedCategory?.color || '#161d26',
      limitMinor,
      alertThreshold: parseFloat(alertThreshold) || 0.8,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Configure Budget Caliper' : 'Establish Monthly Category Budget'}
      description="Calipers monitor posted expense transactions and display threshold notches."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isEditing ? 'Save Caliper' : 'Establish Budget'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Budget Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isEditing}
          options={[
            { value: 'overall', label: 'Overall Monthly Spending Ceiling' },
            ...availableCategories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })),
          ]}
        />

        <Input
          label="Spending Ceiling Limit (BDT)"
          type="number"
          step="0.01"
          placeholder="0.00"
          prefixElement={<span className="font-mono text-sm font-bold">৳</span>}
          value={limitStr}
          onChange={(e) => setLimitStr(e.target.value)}
          error={errors.limit}
          required
        />

        <Select
          label="Proactive Warning Caliper Notch"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(e.target.value)}
          options={[
            { value: '0.7', label: '70% — Early Warning Caliper' },
            { value: '0.75', label: '75% — Conservative Caliper' },
            { value: '0.8', label: '80% — Standard Caliper (Recommended)' },
            { value: '0.85', label: '85% — High Warning Caliper' },
            { value: '0.9', label: '90% — Critical Pre-Limit Caliper' },
          ]}
          helperText="A visual amber notch will mark this threshold on the progress caliper."
        />
      </form>
    </Modal>
  )
}


import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import type { Category } from '@/types'

export interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Category, 'id' | 'isArchived'>) => void
  initialCategory?: Category | null
}

const PALETTE_PRESETS = [
  { name: 'Jade', color: '#059669' },
  { name: 'Amber', color: '#d97706' },
  { name: 'Cobalt', color: '#2563eb' },
  { name: 'Crimson', color: '#dc2626' },
  { name: 'Graphite', color: '#161d26' },
  { name: 'Blueprint', color: '#64748b' },
  { name: 'Slate Violet', color: '#7c3aed' },
  { name: 'Teal', color: '#0f766e' },
]

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}) => {
  const isEditing = Boolean(initialCategory)

  const [name, setName] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [color, setColor] = useState('#059669')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name)
      setType(initialCategory.type)
      setColor(initialCategory.color)
    } else {
      setName('')
      setType('expense')
      setColor('#059669')
    }
    setError(null)
  }, [initialCategory, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category classification name is required.')
      return
    }

    onSave({
      userId: 'usr-1',
      name: name.trim(),
      type,
      color,
      icon: 'Tag',
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Configure Category' : 'Establish New Category'}
      description="Categorize inflows and outflows for granular budgeting and analytics."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {isEditing ? 'Save Category' : 'Create Category'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Household Maintenance, Dental & Healthcare"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error || undefined}
          required
        />

        <Select
          label="Classification Type"
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          options={[
            { value: 'expense', label: 'Outflow (Expense Category)' },
            { value: 'income', label: 'Inflow (Income Category)' },
          ]}
        />

        {/* Color Palette Selector */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#161d26] block mb-2">
            Semantic Color Token
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PALETTE_PRESETS.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() => setColor(preset.color)}
                className={`w-7 h-7 rounded-[4px] border-2 transition-transform cursor-pointer flex items-center justify-center ${
                  color === preset.color
                    ? 'border-[#161d26] scale-110 shadow-sm'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}


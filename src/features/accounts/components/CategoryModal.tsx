import React, { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { useAuth } from '@/features/auth/AuthContext'
import { CATEGORY_ICON_OPTIONS, getCategoryIcon } from './categoryIcons'
import type { Category } from '@/types'

export interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Category, 'id' | 'isArchived'>) => Promise<void>
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
  const { user } = useAuth()

  const [name, setName] = useState(initialCategory?.name ?? '')
  const [type, setType] = useState<'expense' | 'income'>(initialCategory?.type ?? 'expense')
  const [color, setColor] = useState(initialCategory?.color ?? '#059669')
  const [icon, setIcon] = useState(initialCategory?.icon ?? 'Tag')
  const [nameError, setNameError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const SelectedIcon = getCategoryIcon(icon)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Enter a name for this category.')
      return
    }

    setIsSaving(true)
    setNameError(null)
    setSaveError(null)

    try {
      await onSave({
        userId: user?.id || null,
        name: name.trim(),
        type,
        color,
        icon,
      })
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ? error.message
            : 'Could not save this category. Please try again.'
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit category' : 'Add a category'}
      description="Choose a name, transaction type, color, and icon."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="category-form"
            isLoading={isSaving}
          >
            {isEditing ? 'Save category' : 'Create category'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-[6px] border border-[#d2d9e4] bg-[#f4f6f9] p-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] border border-[#d2d9e4] bg-white"
            style={{ color }}
            aria-hidden="true"
          >
            {React.createElement(SelectedIcon, { className: 'h-5 w-5' })}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#161d26]">
              {name.trim() || 'New category'}
            </p>
            <p className="mt-0.5 text-xs text-[#64748b]">
              {type === 'income' ? 'Income' : 'Expense'} category
            </p>
          </div>
          <span
            className="ml-auto h-5 w-5 shrink-0 rounded-[3px] border border-[#d2d9e4]"
            style={{ backgroundColor: color }}
            title={`Selected color ${color}`}
            aria-label={`Selected color ${color}`}
          />
        </div>

        <Input
          label="Category name"
          placeholder="e.g. Housing & Rent"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setNameError(null)
          }}
          error={nameError || undefined}
          maxLength={60}
          required
        />

        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#161d26]">
            Color
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PALETTE_PRESETS.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() => setColor(preset.color)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161d26] ${
                  color === preset.color
                    ? 'border-[#161d26]'
                    : 'border-transparent hover:border-[#94a3b8]'
                }`}
                style={{ backgroundColor: preset.color }}
                title={`${preset.name} (${preset.color})`}
                aria-label={`${preset.name} color`}
                aria-pressed={color === preset.color}
              />
            ))}
            <label className="flex h-8 cursor-pointer items-center gap-2 rounded-[4px] border border-[#d2d9e4] bg-white px-2 text-xs font-medium text-[#161d26] hover:bg-[#f4f6f9] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#161d26]">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label="Choose a custom color"
                className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
              />
              Custom
            </label>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#161d26]">
            Icon
          </legend>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8" role="group" aria-label="Category icon">
            {CATEGORY_ICON_OPTIONS.map(({ name: iconName, Icon }) => (
              <button
                key={iconName}
                type="button"
                onClick={() => setIcon(iconName)}
                className={`flex h-10 items-center justify-center rounded-[4px] border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161d26] ${
                  icon === iconName
                    ? 'border-[#161d26] bg-[#f4f6f9] text-[#161d26]'
                    : 'border-[#d2d9e4] bg-white text-[#64748b] hover:border-[#94a3b8] hover:text-[#161d26]'
                }`}
                title={iconName}
                aria-label={iconName}
                aria-pressed={icon === iconName}
              >
                {React.createElement(Icon, { className: 'h-4 w-4', 'aria-hidden': true })}
              </button>
            ))}
          </div>
        </fieldset>

        {saveError && (
          <p className="text-sm text-[#dc2626]" role="alert">
            {saveError}
          </p>
        )}
      </form>
    </Modal>
  )
}

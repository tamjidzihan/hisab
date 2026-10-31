import React from 'react'
import { Search, Download, Upload, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import type { TransactionFilterState } from '../useTransactions'

export interface TransactionFilterBarProps {
  filters: TransactionFilterState
  onFilterChange: (filters: TransactionFilterState) => void
  onReset: () => void
  onOpenCreateModal: () => void
  onOpenImportModal: () => void
  onExportCsv: () => void
  availableAccounts: string[]
  availableCategories: string[]
}

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  onOpenCreateModal,
  onOpenImportModal,
  onExportCsv,
  availableAccounts,
  availableCategories,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.account !== 'all' ||
    filters.category !== 'all' ||
    filters.datePreset !== 'all'

  return (
    <div className="space-y-3 bg-white border border-[#d2d9e4] rounded-[6px] p-3.5">
      {/* Top Row: Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-2.5 text-[#64748b] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search payee, description, or notes..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white text-[#161d26] rounded-[4px] border border-[#d2d9e4] focus:outline-none focus:border-[#161d26] focus:ring-1 focus:ring-[#161d26] transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onExportCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs h-9"
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenImportModal}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs h-9"
          >
            Import
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={onOpenCreateModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs h-9 font-semibold"
          >
            Log Transaction
          </Button>
        </div>
      </div>

      {/* Bottom Row: Granular Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2 border-t border-[#e5eaf0] text-xs">
        {/* Type Filter */}
        <Select
          value={filters.type}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              type: e.target.value as TransactionFilterState['type'],
            })
          }
          className="h-8 text-xs"
          options={[
            { value: 'all', label: 'All Classifications' },
            { value: 'income', label: 'Inflow Only' },
            { value: 'expense', label: 'Outflow Only' },
            { value: 'transfer', label: 'Transfers Only' },
          ]}
        />

        {/* Account Filter */}
        <Select
          value={filters.account}
          onChange={(e) => onFilterChange({ ...filters, account: e.target.value })}
          className="h-8 text-xs"
          options={[
            { value: 'all', label: 'All Accounts' },
            ...availableAccounts.map((acc) => ({ value: acc, label: acc })),
          ]}
        />

        {/* Category Filter */}
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="h-8 text-xs"
          options={[
            { value: 'all', label: 'All Categories' },
            ...availableCategories.map((cat) => ({ value: cat, label: cat })),
          ]}
        />

        {/* Date Filter */}
        <Select
          value={filters.datePreset}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              datePreset: e.target.value as TransactionFilterState['datePreset'],
            })
          }
          className="h-8 text-xs font-mono"
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'this_month', label: 'This Month (Nov 2026)' },
            { value: 'last_month', label: 'Last Month (Oct 2026)' },
          ]}
        />

        {/* Reset Filter Button */}
        {isFiltered && (
          <div className="col-span-2 sm:col-span-1 flex items-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-3 h-3" />}
              className="h-8 text-xs text-[#64748b] hover:text-[#161d26] w-full sm:w-auto"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


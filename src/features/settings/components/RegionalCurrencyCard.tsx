import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { toast } from 'sonner'
import { Globe, Save, Check } from 'lucide-react'
import type { RegionalSettings, SupportedCurrency, DateFormatOption, WeekStartOption } from '../types'

export interface RegionalCurrencyCardProps {
  regional: RegionalSettings
  onSave: (updates: Partial<RegionalSettings>) => void
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  SAR: '﷼',
  AED: 'د.إ',
  CAD: '$',
}

export const RegionalCurrencyCard: React.FC<RegionalCurrencyCardProps> = ({
  regional,
  onSave,
}) => {
  const [baseCurrency, setBaseCurrency] = useState<SupportedCurrency>(regional.baseCurrency)
  const [dateFormat, setDateFormat] = useState<DateFormatOption>(regional.dateFormat)
  const [decimalPrecision, setDecimalPrecision] = useState<'2' | '0'>(regional.decimalPrecision)
  const [weekStartDay, setWeekStartDay] = useState<WeekStartOption>(regional.weekStartDay)
  const [fiscalCycleDay, setFiscalCycleDay] = useState<number>(regional.fiscalCycleDay)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      baseCurrency,
      dateFormat,
      decimalPrecision,
      weekStartDay,
      fiscalCycleDay,
    })
    setHasChanges(false)
    toast.success('Regional conventions and base currency saved')
  }

  const sampleAmount = decimalPrecision === '2' ? '125,450.00' : '125,450'
  const symbol = CURRENCY_SYMBOLS[baseCurrency] || '৳'

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf0]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#161d26]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#161d26] font-mono">
            Currency & Regional Formatting
          </h2>
        </div>
        <span className="text-xs font-mono text-[#059669] flex items-center gap-1 font-semibold">
          <Check className="w-3.5 h-3.5" /> Monetary Integrity: Integer Minor Units
        </span>
      </div>

      {/* Live Ledger Preview Badge */}
      <div className="bg-[#f8fafc] border border-[#d2d9e4] p-4 rounded-[4px] space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block font-semibold">
          Live Formatting Preview
        </span>
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#64748b] uppercase block">Ledger Display</span>
            <span className="text-lg font-bold text-[#161d26] tabular-nums">
              {symbol}{sampleAmount}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748b] uppercase block">Sample Ledger Date</span>
            <span className="text-sm font-semibold text-[#161d26] tabular-nums">
              {dateFormat === 'YYYY-MM-DD'
                ? '2026-11-01'
                : dateFormat === 'DD/MM/YYYY'
                ? '01/11/2026'
                : '01 Nov 2026'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748b] uppercase block">Weekly Invariant</span>
            <span className="text-sm font-semibold text-[#161d26] capitalize">
              Starts on {weekStartDay}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Base Reporting Currency"
            value={baseCurrency}
            onChange={(e) => {
              setBaseCurrency(e.target.value as SupportedCurrency)
              setHasChanges(true)
            }}
            options={[
              { value: 'BDT', label: 'BDT (৳) — Bangladeshi Taka' },
              { value: 'USD', label: 'USD ($) — United States Dollar' },
              { value: 'EUR', label: 'EUR (€) — Euro' },
              { value: 'GBP', label: 'GBP (£) — British Pound' },
              { value: 'INR', label: 'INR (₹) — Indian Rupee' },
              { value: 'SAR', label: 'SAR (﷼) — Saudi Riyal' },
              { value: 'AED', label: 'AED (د.إ) — UAE Dirham' },
              { value: 'CAD', label: 'CAD ($) — Canadian Dollar' },
            ]}
          />

          <Select
            label="Date Formatting Mask"
            value={dateFormat}
            onChange={(e) => {
              setDateFormat(e.target.value as DateFormatOption)
              setHasChanges(true)
            }}
            options={[
              { value: 'DD MMM YYYY', label: 'DD MMM YYYY (e.g. 01 Nov 2026)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO 8601 Standard)' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 01/11/2026)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Decimal Notation Precision"
            value={decimalPrecision}
            onChange={(e) => {
              setDecimalPrecision(e.target.value as '2' | '0')
              setHasChanges(true)
            }}
            options={[
              { value: '2', label: '2 Decimal Places (৳100.00)' },
              { value: '0', label: 'Whole Numbers (৳100)' },
            ]}
          />

          <Select
            label="First Day of Accounting Week"
            value={weekStartDay}
            onChange={(e) => {
              setWeekStartDay(e.target.value as WeekStartOption)
              setHasChanges(true)
            }}
            options={[
              { value: 'saturday', label: 'Saturday (BD / GCC Standard)' },
              { value: 'sunday', label: 'Sunday (North American)' },
              { value: 'monday', label: 'Monday (ISO Standard)' },
            ]}
          />

          <Select
            label="Monthly Accounting Cycle Anchor"
            value={String(fiscalCycleDay)}
            onChange={(e) => {
              setFiscalCycleDay(Number(e.target.value))
              setHasChanges(true)
            }}
            options={[
              { value: '1', label: '1st of the Month (Calendar)' },
              { value: '25', label: '25th of the Month (Payday Cycle)' },
              { value: '28', label: '28th of the Month (End of Month)' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#e5eaf0]">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? 'Unsaved regional updates' : 'Regional tokens synchronized'}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Apply Regional Settings</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}


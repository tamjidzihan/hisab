import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { Badge } from '@/components/common/Badge'
import { toast } from 'sonner'
import { Globe, Save, CheckCircle2 } from 'lucide-react'
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
    toast.success('Regional conventions and base currency applied')
  }

  const sampleAmount = decimalPrecision === '2' ? '125,450.00' : '125,450'
  const symbol = CURRENCY_SYMBOLS[baseCurrency] || '৳'

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#161d26]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#161d26] font-mono">
              Currency & Regional Precision
            </h2>
          </div>
          <Badge variant="inflow" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Integer Minor Units (Paisa)
          </Badge>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? '● Unapplied regional adjustments' : 'Formatting in sync with application'}
          </span>
          <Button
            type="submit"
            form="regional-currency-form"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Apply Regional Settings
          </Button>
        </div>
      }
    >
      <form id="regional-currency-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Live Ledger Preview Badge */}
        <div className="bg-[#f8fafc] border border-[#d2d9e4] p-4 rounded-[4px] space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block font-semibold">
            Real-Time Output Preview
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[3px]">
              <span className="text-[10px] text-[#64748b] uppercase block">Monetary Format</span>
              <span className="text-base font-bold text-[#161d26] tabular-nums mt-0.5 block">
                {symbol} {sampleAmount}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[3px]">
              <span className="text-[10px] text-[#64748b] uppercase block">Sample Ledger Date</span>
              <span className="text-sm font-semibold text-[#161d26] tabular-nums mt-0.5 block">
                {dateFormat === 'YYYY-MM-DD'
                  ? '2026-11-01'
                  : dateFormat === 'DD/MM/YYYY'
                  ? '01/11/2026'
                  : '01 Nov 2026'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[3px]">
              <span className="text-[10px] text-[#64748b] uppercase block">Accounting Week</span>
              <span className="text-sm font-semibold text-[#161d26] capitalize mt-0.5 block">
                Starts {weekStartDay}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Date Masks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

        {/* Precision & Calendar Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Select
            label="Decimal Precision"
            value={decimalPrecision}
            onChange={(e) => {
              setDecimalPrecision(e.target.value as '2' | '0')
              setHasChanges(true)
            }}
            options={[
              { value: '2', label: '2 Decimals (৳100.00)' },
              { value: '0', label: 'Whole Numbers (৳100)' },
            ]}
          />

          <Select
            label="Accounting Week Start"
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
            label="Fiscal Payday Cycle Anchor"
            value={String(fiscalCycleDay)}
            onChange={(e) => {
              setFiscalCycleDay(Number(e.target.value))
              setHasChanges(true)
            }}
            options={[
              { value: '1', label: '1st of Month (Calendar)' },
              { value: '25', label: '25th of Month (Salary Payday)' },
              { value: '28', label: '28th of Month (End of Month)' },
            ]}
          />
        </div>
      </form>
    </Card>
  )
}

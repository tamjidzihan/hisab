import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'
import { Sliders, Bell, AlertTriangle, Save } from 'lucide-react'
import type { CaliperAlertSettings } from '../types'

export interface CaliperThresholdsCardProps {
  caliper: CaliperAlertSettings
  onSave: (updates: Partial<CaliperAlertSettings>) => void
}

export const CaliperThresholdsCard: React.FC<CaliperThresholdsCardProps> = ({
  caliper,
  onSave,
}) => {
  const [warningThreshold, setWarningThreshold] = useState(caliper.warningThresholdPercent)
  const [limitThreshold, setLimitThreshold] = useState(caliper.limitThresholdPercent)
  const [leadDays, setLeadDays] = useState(caliper.billReminderLeadDays)
  const [enableCaliperNotices, setEnableCaliperNotices] = useState(caliper.enableCaliperNotices)
  const [enableNegativeCashFlowAlerts, setEnableNegativeCashFlowAlerts] = useState(
    caliper.enableNegativeCashFlowAlerts
  )
  const [enableLowBalanceAlerts, setEnableLowBalanceAlerts] = useState(
    caliper.enableLowBalanceAlerts
  )
  const [lowBalanceAmountStr, setLowBalanceAmountStr] = useState(
    (caliper.lowBalanceThresholdMinor / 100).toFixed(0)
  )
  const [hasChanges, setHasChanges] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lowBalanceMinor = Math.max(0, Math.round(Number(lowBalanceAmountStr || 0) * 100))

    onSave({
      warningThresholdPercent: warningThreshold,
      limitThresholdPercent: limitThreshold,
      billReminderLeadDays: leadDays,
      enableCaliperNotices,
      enableNegativeCashFlowAlerts,
      enableLowBalanceAlerts,
      lowBalanceThresholdMinor: lowBalanceMinor,
    })
    setHasChanges(false)
    toast.success('Budget caliper tolerances and alert rules updated')
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf0]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#161d26]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#161d26] font-mono">
            Dimension Calipers & Alert Thresholds
          </h2>
        </div>
        <span className="text-xs font-mono text-[#d97706] flex items-center gap-1 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" /> Drafting Tolerances Active
        </span>
      </div>

      {/* Live Caliper Preview */}
      <div className="bg-[#f8fafc] border border-[#d2d9e4] p-4 rounded-[4px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] font-semibold">
            Interactive Caliper Simulation (Simulated ৳82,000 / ৳100,000 Budget)
          </span>
          <span className="text-xs font-mono font-bold text-[#161d26]">
            82.0% Consumed
          </span>
        </div>

        <CaliperProgress
          value={8200000}
          max={10000000}
          warningThreshold={warningThreshold / 100}
          limitThreshold={limitThreshold / 100}
          showNotches={true}
          height="lg"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] pt-1">
          <span className="inline-flex items-center gap-1.5 text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            Nominal Inflow (0% – {warningThreshold}%)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#d97706]">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" />
            Warning Caliper ({warningThreshold}%)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#dc2626]">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
            Hard Limit Caliper ({limitThreshold}%)
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sliders for Caliper Thresholds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="warning-slider" className="font-semibold text-[#161d26]">
                Warning Caliper Notch
              </label>
              <span className="font-bold text-[#d97706]">{warningThreshold}%</span>
            </div>
            <input
              id="warning-slider"
              type="range"
              min="50"
              max="95"
              step="5"
              value={warningThreshold}
              onChange={(e) => {
                setWarningThreshold(Number(e.target.value))
                setHasChanges(true)
              }}
              className="w-full accent-[#d97706] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748b]">
              Notch where progress changes to amber warning tone across all category budgets.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="limit-slider" className="font-semibold text-[#161d26]">
                Hard Limit Caliper Notch
              </label>
              <span className="font-bold text-[#dc2626]">{limitThreshold}%</span>
            </div>
            <input
              id="limit-slider"
              type="range"
              min="90"
              max="120"
              step="5"
              value={limitThreshold}
              onChange={(e) => {
                setLimitThreshold(Number(e.target.value))
                setHasChanges(true)
              }}
              className="w-full accent-[#dc2626] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748b]">
              Threshold where budget triggers high-priority limit crimson alerts.
            </p>
          </div>
        </div>

        {/* Lead Days and Low Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#e5eaf0]">
          <Select
            label="Recurring Obligation Lead Reminder"
            value={String(leadDays)}
            onChange={(e) => {
              setLeadDays(Number(e.target.value))
              setHasChanges(true)
            }}
            options={[
              { value: '1', label: '1 Day in Advance' },
              { value: '2', label: '2 Days in Advance' },
              { value: '3', label: '3 Days in Advance (Recommended)' },
              { value: '5', label: '5 Days in Advance' },
              { value: '7', label: '1 Week in Advance' },
            ]}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#161d26] block">
              Low Account Liquidity Alert (BDT)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#64748b]">
                ৳
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={lowBalanceAmountStr}
                onChange={(e) => {
                  setLowBalanceAmountStr(e.target.value)
                  setHasChanges(true)
                }}
                className="w-full pl-7 pr-3 py-1.5 text-xs font-mono rounded-[3px] border border-[#d2d9e4] bg-white focus:outline-none focus:border-[#161d26]"
              />
            </div>
            <span className="text-[10px] text-[#64748b] font-mono">
              Notify when account drops below {formatCurrency(Number(lowBalanceAmountStr || 0) * 100)}
            </span>
          </div>
        </div>

        {/* Checkbox Notification Rules */}
        <div className="space-y-3 pt-2 border-t border-[#e5eaf0]">
          <h3 className="text-xs font-bold text-[#161d26] uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#161d26]" /> Notification Dispatch Rules
          </h3>

          <div className="space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-[#161d26] cursor-pointer">
              <input
                type="checkbox"
                checked={enableCaliperNotices}
                onChange={(e) => {
                  setEnableCaliperNotices(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] text-[#161d26] accent-[#161d26] cursor-pointer"
              />
              <div>
                <span className="font-semibold block">Budget Caliper Breach Notifications</span>
                <span className="text-[11px] text-[#64748b]">
                  Dispatch alert when any spending category crosses the 80% warning or 100% hard limit.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-[#161d26] cursor-pointer">
              <input
                type="checkbox"
                checked={enableNegativeCashFlowAlerts}
                onChange={(e) => {
                  setEnableNegativeCashFlowAlerts(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] text-[#161d26] accent-[#161d26] cursor-pointer"
              />
              <div>
                <span className="font-semibold block">Negative Cash Flow Deficit Warning</span>
                <span className="text-[11px] text-[#64748b]">
                  Alert when current month cumulative expenses surpass verified income inflows.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-[#161d26] cursor-pointer">
              <input
                type="checkbox"
                checked={enableLowBalanceAlerts}
                onChange={(e) => {
                  setEnableLowBalanceAlerts(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] text-[#161d26] accent-[#161d26] cursor-pointer"
              />
              <div>
                <span className="font-semibold block">Account Minimum Balance Watchdog</span>
                <span className="text-[11px] text-[#64748b]">
                  Flag accounts approaching zero liquidity or safety minimum reserve.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#e5eaf0]">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? 'Unsaved caliper changes' : 'Tolerances calibrated'}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Caliper Rules</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

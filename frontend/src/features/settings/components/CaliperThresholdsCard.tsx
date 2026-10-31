import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Badge } from '@/components/common/Badge'
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
    toast.success('Budget caliper tolerances and notification triggers updated')
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#161d26]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#161d26] font-mono">
              Dimension Calipers & Alert Thresholds
            </h2>
          </div>
          <Badge variant="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1" /> Dynamic Tolerances Active
          </Badge>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? '● Unsaved caliper notch changes' : 'Tolerances calibrated to ledger'}
          </span>
          <Button
            type="submit"
            form="caliper-thresholds-form"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Caliper Rules
          </Button>
        </div>
      }
    >
      <form id="caliper-thresholds-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Live Caliper Preview Simulation */}
        <div className="bg-[#f8fafc] border border-[#d2d9e4] p-4 rounded-[4px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] font-semibold">
              Live Caliper Simulation (Simulated ৳82,000 / ৳100,000 Budget)
            </span>
            <span className="text-xs font-mono font-bold text-[#161d26] tabular-nums">
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#64748b] pt-1">
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

        {/* Caliper Sliders in Balanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-3.5 border border-[#d2d9e4] rounded-[4px] bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="warning-slider" className="font-semibold text-[#161d26]">
                Warning Caliper Notch
              </label>
              <span className="font-bold text-sm text-[#d97706] tabular-nums bg-[#fffbeb] px-2 py-0.5 rounded border border-[#fde68a]">
                {warningThreshold}%
              </span>
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
              className="w-full accent-[#d97706] cursor-pointer h-2 bg-[#f1f5f9] rounded-lg"
            />
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Triggers amber warning badges across category budgets when spending reaches this ratio.
            </p>
          </div>

          <div className="p-3.5 border border-[#d2d9e4] rounded-[4px] bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="limit-slider" className="font-semibold text-[#161d26]">
                Hard Limit Caliper Notch
              </label>
              <span className="font-bold text-sm text-[#dc2626] tabular-nums bg-[#fef2f2] px-2 py-0.5 rounded border border-[#fecaca]">
                {limitThreshold}%
              </span>
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
              className="w-full accent-[#dc2626] cursor-pointer h-2 bg-[#f1f5f9] rounded-lg"
            />
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Triggers high-priority Limit Crimson alerts when spending exceeds this ceiling.
            </p>
          </div>
        </div>

        {/* Lead Days and Low Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <Select
            label="Bill Reminder Lead Notice"
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

          <Input
            label="Low Account Liquidity Watchdog"
            type="number"
            min="0"
            step="500"
            prefixElement={<span className="font-mono text-xs font-semibold text-[#64748b]">৳</span>}
            value={lowBalanceAmountStr}
            onChange={(e) => {
              setLowBalanceAmountStr(e.target.value)
              setHasChanges(true)
            }}
            helperText={`Alert dispatched when any account drops below ${formatCurrency(
              Number(lowBalanceAmountStr || 0) * 100
            )}.`}
          />
        </div>

        {/* Checkbox Notification Rules */}
        <div className="space-y-3 pt-3 border-t border-[#e5eaf0]">
          <h3 className="text-xs font-bold text-[#161d26] uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#161d26]" /> Notification Dispatch Triggers
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-xs text-[#161d26] cursor-pointer p-2.5 rounded-[4px] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] transition-colors">
              <input
                type="checkbox"
                checked={enableCaliperNotices}
                onChange={(e) => {
                  setEnableCaliperNotices(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] accent-[#161d26] cursor-pointer w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="font-semibold block text-[#161d26]">Budget Caliper Threshold Alerts</span>
                <span className="text-[11px] text-[#64748b] leading-relaxed block">
                  Surface alerts in the notification bell whenever a category crosses the 80% warning or 100% hard limit.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-xs text-[#161d26] cursor-pointer p-2.5 rounded-[4px] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] transition-colors">
              <input
                type="checkbox"
                checked={enableNegativeCashFlowAlerts}
                onChange={(e) => {
                  setEnableNegativeCashFlowAlerts(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] accent-[#161d26] cursor-pointer w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="font-semibold block text-[#161d26]">Negative Cash Flow Deficit Warning</span>
                <span className="text-[11px] text-[#64748b] leading-relaxed block">
                  Notify immediately when cumulative monthly outflows surpass verified income inflows.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-xs text-[#161d26] cursor-pointer p-2.5 rounded-[4px] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] transition-colors">
              <input
                type="checkbox"
                checked={enableLowBalanceAlerts}
                onChange={(e) => {
                  setEnableLowBalanceAlerts(e.target.checked)
                  setHasChanges(true)
                }}
                className="mt-0.5 rounded-[3px] accent-[#161d26] cursor-pointer w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="font-semibold block text-[#161d26]">Account Minimum Balance Watchdog</span>
                <span className="text-[11px] text-[#64748b] leading-relaxed block">
                  Flag accounts approaching zero liquidity or minimum safety reserve thresholds.
                </span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </Card>
  )
}

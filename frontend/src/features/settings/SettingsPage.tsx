import React from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { toast } from 'sonner'

export const SettingsPage: React.FC = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Settings updated successfully.')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-2 border-b border-[#d2d9e4]">
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          System Preferences & Currency
        </h1>
        <p className="text-xs text-[#64748b]">
          User profile defaults, reporting currency, and alert thresholds.
        </p>
      </div>

      <Card
        header={
          <span className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
            General Profile & Defaults
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            defaultValue="Account Holder"
          />
          <Input
            label="Email Address"
            type="email"
            defaultValue="user@hisab.local"
          />
          <Select
            label="Base Currency"
            defaultValue="BDT"
            options={[
              { value: 'BDT', label: 'BDT (৳) — Bangladeshi Taka' },
              { value: 'USD', label: 'USD ($) — United States Dollar' },
              { value: 'EUR', label: 'EUR (€) — Euro' },
              { value: 'INR', label: 'INR (₹) — Indian Rupee' },
            ]}
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}


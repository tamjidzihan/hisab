import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Badge } from '@/components/common/Badge'
import { toast } from 'sonner'
import { User, ShieldCheck, Hash, Calendar, Save } from 'lucide-react'
import type { UserProfile } from '../types'

export interface ProfileSettingsCardProps {
  profile: UserProfile
  onSave: (updates: Partial<UserProfile>) => void
}

export const ProfileSettingsCard: React.FC<ProfileSettingsCardProps> = ({
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [householdName, setHouseholdName] = useState(profile.householdName)
  const [hasChanges, setHasChanges] = useState(false)

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AC'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('User name cannot be empty')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email address required')
      return
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      householdName: householdName.trim(),
    })
    setHasChanges(false)
    toast.success('User identity and ledger profile saved')
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#161d26]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#161d26] font-mono">
              User Identity & Ledger Controller
            </h2>
          </div>
          <Badge variant="inflow" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1" /> Verified Controller
          </Badge>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? '● Unsaved profile modifications' : 'Profile in sync with ledger'}
          </span>
          <Button
            type="submit"
            form="profile-settings-form"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Profile
          </Button>
        </div>
      }
    >
      <form id="profile-settings-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Monogram & Metadata Header */}
        <div className="flex items-center gap-4 bg-[#f8fafc] p-4 rounded-[4px] border border-[#d2d9e4]">
          <div className="w-14 h-14 rounded-[4px] bg-[#161d26] text-white flex items-center justify-center font-mono font-bold text-lg tracking-wider border border-[#0f172a] shrink-0">
            {initials}
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#161d26]">{name || 'Account profile'}</span>
              <span className="text-[11px] font-mono text-[#64748b] bg-white px-2 py-0.5 rounded border border-[#d2d9e4]">
                {profile.role || '—'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748b]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#94a3b8]" /> Enrolled: {profile.joinedDate || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Full Legal Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setHasChanges(true)
            }}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setHasChanges(true)
            }}
            placeholder="name@example.com"
            required
          />
        </div>

        <Input
          label="Household / Ledger Moniker"
          value={householdName}
          onChange={(e) => {
            setHouseholdName(e.target.value)
            setHasChanges(true)
          }}
          placeholder="e.g. Household Ledger"
          helperText="Displayed on financial exports and official PDF summary statements."
        />
      </form>
    </Card>
  )
}

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

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'HB'

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
      householdName: householdName.trim() || 'Personal Ledger',
    })
    setHasChanges(false)
    toast.success('User identity & ledger profile updated')
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf0]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#161d26]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#161d26] font-mono">
            User Identity & Ledger Controller
          </h2>
        </div>
        <Badge variant="inflow" size="sm">
          <ShieldCheck className="w-3 h-3 mr-1" /> Verified
        </Badge>
      </div>

      {/* Avatar Monogram & Metadata Header */}
      <div className="flex items-center gap-4 bg-[#f8fafc] p-4 rounded-[4px] border border-[#d2d9e4]">
        <div className="w-14 h-14 rounded-[4px] bg-[#161d26] text-white flex items-center justify-center font-mono font-bold text-lg tracking-wider border border-[#0f172a] shadow-xs">
          {initials}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#161d26]">{name}</span>
            <span className="text-[11px] font-mono text-[#64748b]">({profile.role})</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#64748b]">
            <span className="inline-flex items-center gap-1">
              <Hash className="w-3 h-3 text-[#64748b]" /> {profile.userId}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#64748b]" /> Member since {profile.joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setHasChanges(true)
            }}
            placeholder="e.g. Zihan Chowdhury"
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
            placeholder="e.g. zihan@hisab.local"
            required
          />
        </div>

        <Input
          label="Household / Ledger Title"
          value={householdName}
          onChange={(e) => {
            setHouseholdName(e.target.value)
            setHasChanges(true)
          }}
          placeholder="e.g. Chowdhury Household Ledger"
          helperText="Identifies this ledger on exports and summary financial statements."
        />

        <div className="flex items-center justify-between pt-2 border-t border-[#e5eaf0]">
          <span className="text-xs text-[#64748b] font-mono">
            {hasChanges ? 'Unsaved profile edits pending' : 'Profile synchronized'}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!hasChanges}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}


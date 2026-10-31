import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Modal } from '@/components/common/Modal'
import { toast } from 'sonner'
import {
  Shield,
  KeyRound,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  LogOut,
  Lock,
} from 'lucide-react'
import type { SessionInfo } from '../types'

export interface SecuritySessionsCardProps {
  sessions: SessionInfo[]
  onTerminateSession: (sessionId: string) => void
}

export const SecuritySessionsCard: React.FC<SecuritySessionsCardProps> = ({
  sessions,
  onTerminateSession,
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [idleLockTime, setIdleLockTime] = useState('30')

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Current password is required.')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must contain at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    toast.success('Master encryption passphrase updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsPasswordModalOpen(false)
  }

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('phone')) return <Smartphone className="w-4 h-4" />
    if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet'))
      return <Tablet className="w-4 h-4" />
    return <Laptop className="w-4 h-4" />
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf0]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#161d26]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#161d26] font-mono">
            Security, Credentials & Active Sessions
          </h2>
        </div>
        <Badge variant="inflow" size="sm">
          <Lock className="w-3 h-3 mr-1" /> Multi-Factor Active
        </Badge>
      </div>

      {/* Password & Session Lock Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-[#161d26] font-mono uppercase block">
              Master Access Passphrase
            </span>
            <p className="text-[11px] text-[#64748b] mt-1">
              Secures your encrypted financial ledger and export credentials.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-[#161d26]" />
            <span>Update Master Passphrase</span>
          </Button>
        </div>

        <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-[#161d26] font-mono uppercase block">
              Automated Session Idle Timeout
            </span>
            <p className="text-[11px] text-[#64748b] mt-1">
              Automatically locks the workspace window after a period of user inactivity.
            </p>
          </div>
          <Select
            label=""
            value={idleLockTime}
            onChange={(e) => {
              setIdleLockTime(e.target.value)
              toast.success(`Session timeout updated to ${e.target.value} minutes`)
            }}
            options={[
              { value: '15', label: 'Lock after 15 minutes of inactivity' },
              { value: '30', label: 'Lock after 30 minutes of inactivity' },
              { value: '60', label: 'Lock after 1 hour of inactivity' },
              { value: 'never', label: 'Never lock automatically (Not recommended)' },
            ]}
          />
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="space-y-3 pt-2 border-t border-[#e5eaf0]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#161d26] uppercase font-mono tracking-wider">
            Active Connected Devices ({sessions.length})
          </h3>
          <span className="text-[11px] font-mono text-[#64748b]">
            Audited against authenticated token signatures
          </span>
        </div>

        <div className="divide-y divide-[#e5eaf0] border border-[#d2d9e4] rounded-[4px] overflow-hidden bg-white">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fafc] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-[3px] bg-[#f1f5f9] text-[#161d26] border border-[#d2d9e4]">
                  {getDeviceIcon(sess.device)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#161d26]">{sess.device}</span>
                    {sess.isCurrent ? (
                      <Badge variant="inflow" size="sm">
                        CURRENT DEVICE
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        REMOTE
                      </Badge>
                    )}
                  </div>

                  <p className="text-[11px] text-[#64748b] font-mono">{sess.browser}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#64748b] pt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#64748b]" /> {sess.location} ({sess.ipAddress})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#64748b]" /> {sess.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!sess.isCurrent && (
                <div className="sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onTerminateSession(sess.id)
                      toast.success(`Session on ${sess.device} revoked`)
                    }}
                    className="text-xs text-[#dc2626] hover:bg-[#fef2f2] hover:border-[#dc2626] flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Revoke Access</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update Master Passphrase"
        description="Change the primary encryption key used to authenticate this workspace."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handlePasswordSubmit}>
              Update Passphrase
            </Button>
          </>
        }
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Master Passphrase"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />
          <Input
            label="New Passphrase"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            helperText="Include uppercase, lowercase, numbers, and symbols."
            required
          />
          <Input
            label="Confirm New Passphrase"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new passphrase"
            required
          />
        </form>
      </Modal>
    </Card>
  )
}


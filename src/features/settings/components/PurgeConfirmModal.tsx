import React, { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { AlertOctagon } from 'lucide-react'

export interface PurgeConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmPurge: () => void
}

export const PurgeConfirmModal: React.FC<PurgeConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmPurge,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('')

  const isConfirmed = confirmationInput.trim().toUpperCase() === 'PURGE'

  const handleConfirm = () => {
    if (!isConfirmed) return
    onConfirmPurge()
    setConfirmationInput('')
    onClose()
  }

  const handleClose = () => {
    setConfirmationInput('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Purge & Reset Ledger Database"
      description="Irreversible destructive action for Hisab financial data."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="flex items-center gap-1.5"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Permanently Purge Data</span>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[4px] text-xs text-[#991b1b] space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono">
            <AlertOctagon className="w-4 h-4 text-[#dc2626]" /> Warning: High-Risk Operation
          </div>
          <p>
            This action will permanently purge all local records, resetting accounts, transactions,
            transfer pairings, budget allocations, and savings goals back to initial empty states.
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pt-1">
            <li>Zeroes out all account balances and ledger entries</li>
            <li>Eliminates all categorized expenses and linked transfers</li>
            <li>Resets budget caliper tracking and savings vault contributions</li>
          </ul>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#161d26] block">
            Type <span className="font-mono font-bold text-[#dc2626]">PURGE</span> to authorize this action:
          </label>
          <Input
            placeholder="Type PURGE in capital letters"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            className="font-mono text-center tracking-widest uppercase font-bold"
            autoFocus
          />
        </div>
      </div>
    </Modal>
  )
}


import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency } from '@/lib/formatters'
import {
  Wallet,
  Building,
  Smartphone,
  CreditCard,
  Edit2,
  ArrowRightLeft,
  Archive,
} from 'lucide-react'
import type { Account } from '@/types'

export interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onTransfer: (account: Account) => void
  onArchive: (id: string) => void
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onTransfer,
  onArchive,
}) => {
  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'cash':
        return <Wallet className="w-5 h-5 text-[#161d26]" />
      case 'bank':
        return <Building className="w-5 h-5 text-[#2563eb]" />
      case 'mobile_wallet':
        return <Smartphone className="w-5 h-5 text-[#d97706]" />
      case 'card':
        return <CreditCard className="w-5 h-5 text-[#7c3aed]" />
      default:
        return <Wallet className="w-5 h-5 text-[#64748b]" />
    }
  }

  const deltaSinceOpening = account.currentBalanceMinor - account.openingBalanceMinor
  const isPositiveDelta = deltaSinceOpening >= 0

  return (
    <Card className="hover:border-[#94a3b8] transition-colors relative flex flex-col justify-between">
      <div>
        {/* Header: Icon, Name & Type */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[4px] bg-[#f4f6f9] border border-[#d2d9e4] flex items-center justify-center shrink-0">
              {getAccountIcon(account.type)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#161d26] leading-tight">
                {account.name}
              </h3>
              {account.accountNumberMasked ? (
                <span className="text-[11px] font-mono text-[#64748b]">
                  {account.accountNumberMasked}
                </span>
              ) : (
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#64748b]">
                  {account.type.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          <Badge variant="neutral" size="sm" className="uppercase text-[10px]">
            {account.type.replace('_', ' ')}
          </Badge>
        </div>

        {/* Current Balance Readout */}
        <div className="py-2.5 my-2 border-y border-[#e5eaf0] bg-[#fafbfd] -mx-5 px-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block mb-0.5">
            Current Balance
          </span>
          <div
            className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${
              account.currentBalanceMinor < 0 ? 'text-[#dc2626]' : 'text-[#161d26]'
            }`}
          >
            {formatCurrency(account.currentBalanceMinor)}
          </div>
        </div>

        {/* Balance Breakdown Metadata */}
        <div className="space-y-1 text-[11px] font-mono text-[#64748b] pt-1">
          <div className="flex justify-between">
            <span>Opening Balance:</span>
            <span className="tabular-nums text-[#161d26]">
              {formatCurrency(account.openingBalanceMinor)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Net Delta:</span>
            <span
              className={`tabular-nums font-semibold ${
                isPositiveDelta ? 'text-[#059669]' : 'text-[#dc2626]'
              }`}
            >
              {isPositiveDelta ? '+' : ''}
              {formatCurrency(deltaSinceOpening)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-[#e5eaf0] flex items-center justify-between">
        <button
          onClick={() => onTransfer(account)}
          className="inline-flex items-center gap-1.5 text-xs text-[#2563eb] hover:underline font-semibold cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transfer</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(account)}
            aria-label={`Edit ${account.name}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onArchive(account.id)}
            aria-label={`Archive ${account.name}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}


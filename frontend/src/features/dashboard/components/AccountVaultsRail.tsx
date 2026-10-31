import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { formatCurrency } from '@/lib/formatters'
import { Wallet, Building, Smartphone, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react'
import type { Account } from '@/types'

export interface AccountVaultsRailProps {
  accounts: Account[]
}

export const AccountVaultsRail: React.FC<AccountVaultsRailProps> = ({ accounts }) => {
  const totalLiquidityMinor = accounts.reduce(
    (sum, acc) => sum + (acc.isArchived ? 0 : acc.currentBalanceMinor),
    0
  )

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'cash':
        return <Wallet className="w-4 h-4 text-[#161d26]" />
      case 'bank':
        return <Building className="w-4 h-4 text-[#2563eb]" />
      case 'mobile_wallet':
        return <Smartphone className="w-4 h-4 text-[#d97706]" />
      case 'card':
        return <CreditCard className="w-4 h-4 text-[#7c3aed]" />
      default:
        return <Wallet className="w-4 h-4 text-[#64748b]" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Total Liquidity Metric Box */}
      <Card className="bg-[#fafbfd] border-[#d2d9e4]">
        <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
          <span className="uppercase text-[10px] tracking-wider font-semibold">
            Total Vault Liquidity
          </span>
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
        </div>
        <div className="text-xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
          {formatCurrency(totalLiquidityMinor)}
        </div>
        <p className="text-[10px] text-[#64748b] font-mono mt-0.5">
          Across {accounts.length} active financial accounts
        </p>
      </Card>

      {/* Account Vaults List */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Account Vaults
            </span>
            <Link
              to="/accounts"
              className="text-[11px] text-[#161d26] hover:underline font-medium inline-flex items-center gap-1"
            >
              Vaults <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        }
      >
        <div className="space-y-2.5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-2.5 rounded-[4px] border border-[#e5eaf0] bg-white hover:border-[#cbd5e1] hover:bg-[#fafbfd] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-[3px] bg-[#f4f6f9] border border-[#e2e8f0]">
                    {getAccountIcon(acc.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#161d26] leading-tight">
                      {acc.name}
                    </h4>
                    {acc.accountNumberMasked && (
                      <span className="text-[10px] text-[#64748b] font-mono">
                        {acc.accountNumberMasked}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono tabular-nums text-[#161d26]">
                    {formatCurrency(acc.currentBalanceMinor)}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-[#64748b]">
                    {acc.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}


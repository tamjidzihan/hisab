import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { CaliperProgress } from '@/components/common/CaliperProgress'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  Wallet,
  Building,
  Smartphone,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  // Demonstration numbers in integer minor units (paisa)
  const totalIncomeMinor = 8500000 // ৳85,000.00
  const totalExpenseMinor = 4850000 // ৳48,500.00
  const netCashFlowMinor = totalIncomeMinor - totalExpenseMinor // ৳36,500.00
  const savingsRate = (netCashFlowMinor / totalIncomeMinor) * 100 // 42.9%

  return (
    <div className="space-y-6">
      {/* Month Header / Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Monthly Ledger Overview
          </h1>
          <p className="text-xs text-[#64748b]">
            Financial summary and dimensioned budget limits for the current cycle.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="md">
            November 2026
          </Badge>
          <Badge variant="inflow" size="md">
            Positive Cash Flow
          </Badge>
        </div>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <Card className="border-l-4 border-l-[#059669]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
            <span>TOTAL INFLOW</span>
            <TrendingUp className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums">
            {formatCurrency(totalIncomeMinor)}
          </div>
          <p className="text-[11px] text-[#059669] font-mono mt-1">+12% vs last month</p>
        </Card>

        {/* Expenses Card */}
        <Card className="border-l-4 border-l-[#dc2626]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
            <span>TOTAL OUTFLOW</span>
            <TrendingDown className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums">
            {formatCurrency(totalExpenseMinor)}
          </div>
          <p className="text-[11px] text-[#64748b] font-mono mt-1">57.1% of monthly income</p>
        </Card>

        {/* Net Cash Flow Card */}
        <Card className="border-l-4 border-l-[#161d26]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
            <span>NET CASH FLOW</span>
            <Scale className="w-4 h-4 text-[#161d26]" />
          </div>
          <div className="text-2xl font-bold text-[#059669] font-mono tabular-nums">
            {formatCurrency(netCashFlowMinor, 'BDT', { showPositiveSign: true })}
          </div>
          <p className="text-[11px] text-[#64748b] font-mono mt-1">Available for savings</p>
        </Card>

        {/* Savings Rate Card */}
        <Card className="border-l-4 border-l-[#d97706]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-medium mb-1">
            <span>SAVINGS RATE</span>
            <Percent className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="text-2xl font-bold text-[#161d26] font-mono tabular-nums">
            {formatPercentage(savingsRate)}
          </div>
          <p className="text-[11px] text-[#d97706] font-mono mt-1">Target benchmark: 35.0%</p>
        </Card>
      </div>

      {/* Main Two-Column Spatial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Transactions Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            header={
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
                  Recent Ledger Postings
                </span>
                <Link
                  to="/transactions"
                  className="text-xs text-[#161d26] hover:underline font-medium inline-flex items-center gap-1"
                >
                  View Full Ledger <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#d2d9e4] text-[#64748b] font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Account</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eaf0]">
                  <tr className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#64748b]">01 Nov 2026</td>
                    <td className="py-2.5 px-3 font-medium text-[#161d26]">Monthly Software Retainer</td>
                    <td className="py-2.5 px-3 text-[#64748b]">Bank Vault</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="inflow" size="sm">INFLOW</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#059669] tabular-nums">
                      +৳ 60,000.00
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#64748b]">01 Nov 2026</td>
                    <td className="py-2.5 px-3 font-medium text-[#161d26]">Residential Fiber Internet</td>
                    <td className="py-2.5 px-3 text-[#64748b]">bKash MFS</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="expense" size="sm">EXPENSE</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#161d26] tabular-nums">
                      -৳ 1,500.00
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#64748b]">31 Oct 2026</td>
                    <td className="py-2.5 px-3 font-medium text-[#161d26]">Bank to bKash Transfer</td>
                    <td className="py-2.5 px-3 text-[#64748b]">Linked Pair</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="transfer" size="sm">TRANSFER</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#2563eb] tabular-nums">
                      ৳ 5,000.00
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#64748b]">30 Oct 2026</td>
                    <td className="py-2.5 px-3 font-medium text-[#161d26]">Grocery & Provisions</td>
                    <td className="py-2.5 px-3 text-[#64748b]">Cash Wallet</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="expense" size="sm">EXPENSE</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#161d26] tabular-nums">
                      -৳ 4,280.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Account Vaults Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-3 bg-[#fafbfd]">
              <div className="flex items-center gap-2 text-[#64748b] text-xs mb-1">
                <Wallet className="w-4 h-4 text-[#161d26]" />
                <span className="font-semibold text-[#161d26]">Cash Wallet</span>
              </div>
              <p className="text-lg font-bold font-mono text-[#161d26] tabular-nums">
                ৳ 8,420.00
              </p>
            </Card>

            <Card className="p-3 bg-[#fafbfd]">
              <div className="flex items-center gap-2 text-[#64748b] text-xs mb-1">
                <Building className="w-4 h-4 text-[#2563eb]" />
                <span className="font-semibold text-[#161d26]">Bank Account</span>
              </div>
              <p className="text-lg font-bold font-mono text-[#161d26] tabular-nums">
                ৳ 124,500.00
              </p>
            </Card>

            <Card className="p-3 bg-[#fafbfd]">
              <div className="flex items-center gap-2 text-[#64748b] text-xs mb-1">
                <Smartphone className="w-4 h-4 text-[#d97706]" />
                <span className="font-semibold text-[#161d26]">bKash MFS</span>
              </div>
              <p className="text-lg font-bold font-mono text-[#161d26] tabular-nums">
                ৳ 16,850.00
              </p>
            </Card>
          </div>
        </div>

        {/* Right 1 Col: Dimensioned Budget Calipers */}
        <div className="space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
                  Category Budgets
                </span>
                <span className="text-[10px] text-[#64748b] font-mono">
                  80% / 100% Calipers
                </span>
              </div>
            }
          >
            <div className="space-y-5">
              {/* Category 1: Food & Groceries */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#161d26]">Groceries & Dining</span>
                  <span className="font-mono text-[#64748b] tabular-nums">
                    ৳16,800 / ৳20,000
                  </span>
                </div>
                <CaliperProgress value={16800} max={20000} showPercentageLabel />
              </div>

              {/* Category 2: Utilities & Bills (Warning Caliper) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#161d26]">Utilities & Bills</span>
                  <span className="font-mono text-[#d97706] font-semibold tabular-nums">
                    ৳8,600 / ৳10,000
                  </span>
                </div>
                <CaliperProgress value={8600} max={10000} showPercentageLabel />
              </div>

              {/* Category 3: Transport & Fuel */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#161d26]">Transportation</span>
                  <span className="font-mono text-[#64748b] tabular-nums">
                    ৳4,200 / ৳8,000
                  </span>
                </div>
                <CaliperProgress value={4200} max={8000} showPercentageLabel />
              </div>

              {/* Category 4: Leisure & Entertainment */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#161d26]">Personal Discretionary</span>
                  <span className="font-mono text-[#64748b] tabular-nums">
                    ৳3,500 / ৳6,000
                  </span>
                </div>
                <CaliperProgress value={3500} max={6000} showPercentageLabel />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


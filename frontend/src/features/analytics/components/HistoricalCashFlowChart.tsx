import React, { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { Table, BarChart2 } from 'lucide-react'
import type { MonthlyTrendDataPoint } from '../useAnalytics'

export interface HistoricalCashFlowChartProps {
  trendData: MonthlyTrendDataPoint[]
}

export const HistoricalCashFlowChart: React.FC<HistoricalCashFlowChartProps> = ({
  trendData,
}) => {
  const [showTable, setShowTable] = useState(false)

  const chartData = trendData.map((d) => ({
    label: d.label,
    Inflow: Math.round(d.incomeMinor / 100),
    Outflow: Math.round(d.expenseMinor / 100),
    Net: Math.round(d.netMinor / 100),
    rawIncome: d.incomeMinor,
    rawExpense: d.expenseMinor,
    rawNet: d.netMinor,
    savingsRate: d.savingsRate,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      return (
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-2.5 shadow-md text-xs font-mono">
          <p className="font-semibold text-[#161d26] mb-1.5 border-b border-[#e5eaf0] pb-1">
            {label} Breakdown
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-[#059669]">
              <span>Inflow:</span>
              <span className="font-bold tabular-nums">
                {formatCurrency(point.rawIncome)}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[#dc2626]">
              <span>Outflow:</span>
              <span className="font-bold tabular-nums">
                {formatCurrency(point.rawExpense)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-[#e5eaf0] text-[#161d26] font-bold">
              <span>Net Flow:</span>
              <span className="tabular-nums">
                {formatCurrency(point.rawNet, 'BDT', { showPositiveSign: true })}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[#d97706] font-semibold text-[11px]">
              <span>Savings Rate:</span>
              <span className="tabular-nums">{formatPercentage(point.savingsRate)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Historical Cash Flow & Net Trajectory
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Inflow, Outflow, and Net Savings trajectory in BDT
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTable(!showTable)}
            aria-label="Toggle tabular data view"
            leftIcon={showTable ? <BarChart2 className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
            className="text-[11px] h-7 px-2 border border-[#d2d9e4]"
          >
            {showTable ? 'Chart View' : 'Table View'}
          </Button>
        </div>
      }
    >
      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#d2d9e4] text-[#64748b] text-[11px]">
                <th className="py-2 px-3">Period</th>
                <th className="py-2 px-3 text-right text-[#059669]">Inflow</th>
                <th className="py-2 px-3 text-right text-[#dc2626]">Outflow</th>
                <th className="py-2 px-3 text-right">Net Flow</th>
                <th className="py-2 px-3 text-right text-[#d97706]">Savings %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eaf0]">
              {trendData.map((row) => (
                <tr key={row.month} className="hover:bg-[#f8fafc]">
                  <td className="py-2 px-3 font-semibold text-[#161d26]">{row.label}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-[#059669]">
                    {formatCurrency(row.incomeMinor)}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-[#dc2626]">
                    {formatCurrency(row.expenseMinor)}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-bold text-[#161d26]">
                    {formatCurrency(row.netMinor, 'BDT', { showPositiveSign: true })}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-semibold text-[#d97706]">
                    {formatPercentage(row.savingsRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                fontFamily="monospace"
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                fontFamily="monospace"
                tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }}
              />
              <Bar dataKey="Inflow" fill="#059669" radius={[2, 2, 0, 0]} maxBarSize={24} />
              <Bar dataKey="Outflow" fill="#dc2626" radius={[2, 2, 0, 0]} maxBarSize={24} />
              <Line
                type="monotone"
                dataKey="Net"
                stroke="#161d26"
                strokeWidth={2}
                dot={{ r: 3, fill: '#161d26' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}


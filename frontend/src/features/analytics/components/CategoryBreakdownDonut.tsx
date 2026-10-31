import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/common/Card'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import type { CategoryShareDataPoint } from '../useAnalytics'

export interface CategoryBreakdownDonutProps {
  categories: CategoryShareDataPoint[]
}

export const CategoryBreakdownDonut: React.FC<CategoryBreakdownDonutProps> = ({
  categories,
}) => {
  const chartData = categories.map((cat) => ({
    name: cat.categoryName,
    value: Math.round(cat.spentMinor / 100),
    rawMinor: cat.spentMinor,
    color: cat.categoryColor,
    percentage: cat.percentage,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-[#d2d9e4] rounded-[4px] p-2.5 shadow-md text-xs font-mono">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-[#161d26]">{data.name}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#161d26]">
            <span>Spent:</span>
            <span className="font-bold tabular-nums">
              {formatCurrency(data.rawMinor)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-[#64748b] text-[11px]">
            <span>Share of Wallet:</span>
            <span className="tabular-nums">{formatPercentage(data.percentage)}</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      header={
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
            Expense Distribution by Category
          </h3>
          <p className="text-[11px] text-[#64748b]">
            Share of wallet across spending classifications
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart (5 cols) */}
        <div className="md:col-span-5 h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={1} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabular Category Ranks (7 cols) */}
        <div className="md:col-span-7 space-y-2">
          <div className="border border-[#d2d9e4] rounded-[4px] overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f4f6f9] border-b border-[#d2d9e4] text-[#64748b] text-[10px]">
                <tr>
                  <th className="py-1.5 px-3">Classification</th>
                  <th className="py-1.5 px-3 text-right">Spent</th>
                  <th className="py-1.5 px-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eaf0]">
                {categories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-[#fafbfd]">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: cat.categoryColor }}
                      />
                      <span className="font-sans font-medium text-[#161d26] truncate max-w-[130px]">
                        {cat.categoryName}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#161d26] font-semibold">
                      {formatCurrency(cat.spentMinor)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#64748b]">
                      {formatPercentage(cat.percentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
}


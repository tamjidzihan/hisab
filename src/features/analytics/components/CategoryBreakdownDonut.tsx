import React, { useState } from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PieChart as PieChartIcon, Table2 } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { CategoryShareDataPoint } from '../useAnalytics'

export interface CategoryBreakdownDonutProps {
  categories: CategoryShareDataPoint[]
}

export type CategoryViewMode = 'donut' | 'table'

export const CategoryBreakdownDonut: React.FC<CategoryBreakdownDonutProps> = ({
  categories,
}) => {
  const [viewMode, setViewMode] = useState<CategoryViewMode>('donut')

  const totalSpentMinor = categories.reduce((sum, cat) => sum + cat.spentMinor, 0)

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
          <div className="flex items-center gap-1.5 mb-1.5 border-b border-[#e5eaf0] pb-1">
            <span
              className="w-2.5 h-2.5 rounded-[2px] shrink-0"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-[#161d26]">{data.name}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-[#161d26]">
              <span className="text-[#64748b]">Outflow:</span>
              <span className="font-bold tabular-nums">
                {formatCurrency(data.rawMinor)}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[#64748b] text-[11px]">
              <span>Share of Wallet:</span>
              <span className="font-semibold text-[#161d26] tabular-nums">
                {formatPercentage(data.percentage)}
              </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26] font-mono">
              Expense Distribution by Category
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Share of wallet across {categories.length} spending classifications
            </p>
          </div>

          <div className="flex items-center gap-3">
                       {/* Segmented View Mode Toggle */}
            <div
              role="group"
              aria-label="Distribution View Selector"
              className="inline-flex items-center p-0.5 bg-[#f1f5f9] border border-[#d2d9e4] rounded-[4px] shrink-0"
            >
              <button
                type="button"
                onClick={() => setViewMode('donut')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-[3px] transition-all cursor-pointer',
                  viewMode === 'donut'
                    ? 'bg-white text-[#161d26] shadow-2xs font-bold'
                    : 'text-[#64748b] hover:text-[#161d26] font-medium'
                )}
                aria-pressed={viewMode === 'donut'}
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span>Donut</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-[3px] transition-all cursor-pointer',
                  viewMode === 'table'
                    ? 'bg-white text-[#161d26] shadow-2xs font-bold'
                    : 'text-[#64748b] hover:text-[#161d26] font-medium'
                )}
                aria-pressed={viewMode === 'table'}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>
      }
    >
      {categories.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#64748b]">
          <p>No categorized expenses recorded for this period.</p>
        </div>
      ) : viewMode === 'donut' ? (
        /* DONUT VIEW WITH SIDE-BY-SIDE LEGEND */
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 py-1">
          {/* Donut Chart (Left Side) */}
          <div className="relative h-56 w-full sm:w-1/2 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={2.5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Center Label in Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] font-semibold">
                Total Outflow
              </span>
              <span className="text-sm font-bold font-mono text-[#161d26] tabular-nums">
                {formatCurrency(totalSpentMinor)}
              </span>
            </div>
          </div>

          {/* Side Legend (Right Side) */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center divide-y divide-[#e5eaf0] border-t sm:border-t-0 sm:border-l border-[#e5eaf0] sm:pl-5 pt-3 sm:pt-0">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className="flex items-center justify-between gap-2 py-1.5 px-1 hover:bg-[#f8fafc] rounded-[3px] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] shrink-0 border border-black/10"
                    style={{ backgroundColor: cat.categoryColor }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-sans font-medium text-[#161d26] text-xs truncate"
                    title={cat.categoryName}
                  >
                    {cat.categoryName}
                  </span>
                </div>
                <span className="text-[#64748b] text-xs font-mono font-semibold tabular-nums shrink-0">
                  ({formatPercentage(cat.percentage)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto border border-[#d2d9e4] rounded-[4px] bg-white shadow-2xs">
          <table className="w-full table-fixed text-left text-xs font-mono border-collapse min-w-[340px]">
            <thead className="bg-[#f8fafc] border-b border-[#d2d9e4] text-[#64748b] text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold text-left">Classification</th>
                <th className="py-2.5 px-3.5 text-right font-semibold w-28">Spent</th>
                <th className="py-2.5 px-3.5 text-right font-semibold w-36">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eaf0]">
              {categories.map((cat) => (
                <tr key={cat.categoryId} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0 border border-black/10"
                        style={{ backgroundColor: cat.categoryColor }}
                        aria-hidden="true"
                      />
                      <span
                        className="font-sans font-medium text-[#161d26] truncate text-xs"
                        title={cat.categoryName}
                      >
                        {cat.categoryName}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-[#161d26] font-semibold whitespace-nowrap w-28">
                    {formatCurrency(cat.spentMinor)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums whitespace-nowrap w-36">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="text-[#161d26] font-semibold text-xs tabular-nums">
                        {formatPercentage(cat.percentage)}
                      </span>
                      <div className="w-14 h-1.5 bg-[#e2e8f0] rounded-[2px] overflow-hidden shrink-0">
                        <div
                          className="h-full rounded-[2px] transition-all duration-300"
                          style={{
                            width: `${Math.min(Math.max(cat.percentage, 0), 100)}%`,
                            backgroundColor: cat.categoryColor,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fafbfd] border-t-2 border-[#d2d9e4] text-[#161d26] font-semibold text-xs">
              <tr>
                <td className="py-2.5 px-3.5 uppercase tracking-wider text-[10px] text-[#64748b]">
                  Total Outflow
                </td>
                <td className="py-2.5 px-3.5 text-right tabular-nums font-bold text-[#161d26] whitespace-nowrap w-28">
                  {formatCurrency(totalSpentMinor)}
                </td>
                <td className="py-2.5 px-3.5 text-right tabular-nums font-bold text-[#161d26] whitespace-nowrap w-36">
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-xs">100.0%</span>
                    <div className="w-14 h-1.5 bg-[#059669] rounded-[2px] shrink-0" />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  )
}

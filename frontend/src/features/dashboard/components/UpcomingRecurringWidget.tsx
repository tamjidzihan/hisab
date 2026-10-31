import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { CalendarClock } from 'lucide-react'
import type { RecurringTransaction } from '@/types'

export interface UpcomingRecurringWidgetProps {
  recurring: RecurringTransaction[]
}

export const UpcomingRecurringWidget: React.FC<UpcomingRecurringWidgetProps> = ({ recurring }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-[#161d26]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#161d26]">
              Upcoming Recurring Obligations
            </h3>
          </div>
          <span className="text-[10px] text-[#64748b] font-mono">Next 14 Days</span>
        </div>
      }
    >
      {recurring.length === 0 ? (
        <p className="text-xs text-[#64748b] py-2">No scheduled bills or recurring entries due.</p>
      ) : (
        <div className="space-y-2.5">
          {recurring.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-[4px] border border-[#e5eaf0] bg-[#fafbfd] text-xs"
            >
              <div>
                <span className="font-semibold text-[#161d26] block leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#64748b] font-mono">
                  Due: {formatDate(item.nextOccurrence, 'dd MMM yyyy')}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#161d26] tabular-nums block">
                  {formatCurrency(item.amountMinor)}
                </span>
                <Badge variant="neutral" size="sm" className="text-[10px]">
                  {item.frequency.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}


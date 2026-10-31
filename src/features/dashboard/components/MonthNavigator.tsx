import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/common/Button'

export interface MonthNavigatorProps {
  formattedMonthDisplay: string
  isCurrentMonth: boolean
  onPrevious: () => void
  onNext: () => void
  onCurrent: () => void
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  formattedMonthDisplay,
  isCurrentMonth,
  onPrevious,
  onNext,
  onCurrent,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-[#d2d9e4] rounded-[4px] p-1 shadow-2xs">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        aria-label="Previous Month"
        className="h-7 w-7 p-0 text-[#64748b] hover:text-[#161d26]"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-[#161d26] select-none font-mono">
        <Calendar className="w-3.5 h-3.5 text-[#64748b]" aria-hidden="true" />
        <span>{formattedMonthDisplay}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        aria-label="Next Month"
        className="h-7 w-7 p-0 text-[#64748b] hover:text-[#161d26]"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCurrent}
          className="h-7 text-[11px] px-2 py-0 ml-1 border-[#cbd5e1] text-[#64748b] hover:text-[#161d26]"
        >
          Current
        </Button>
      )}
    </div>
  )
}


import React from 'react'
import { cn } from '@/lib/utils'

export interface CaliperProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // Current value e.g. spent
  max: number   // Budget limit e.g. total budget
  showNotches?: boolean
  showPercentageLabel?: boolean
  height?: 'sm' | 'md'
}

export const CaliperProgress: React.FC<CaliperProgressProps> = ({
  className,
  value,
  max,
  showNotches = true,
  showPercentageLabel = false,
  height = 'md',
  ...props
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  // Color dynamics based on caliper thresholds
  const isOverBudget = percentage >= 100
  const isWarning = percentage >= 80 && percentage < 100

  const barColor = isOverBudget
    ? 'bg-[#dc2626]'
    : isWarning
    ? 'bg-[#d97706]'
    : 'bg-[#059669]'

  const barHeight = height === 'sm' ? 'h-2' : 'h-3'
  const notchHeight = height === 'sm' ? '-top-1 h-4' : '-top-1.5 h-6'

  return (
    <div className={cn('w-full flex flex-col gap-1', className)} {...props}>
      <div
        className={cn(
          'relative w-full bg-[#e5eaf0] rounded-[3px] overflow-visible border border-[#d2d9e4]',
          barHeight
        )}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${Math.round(percentage)}%`}
      >
        {/* Active progress fill */}
        <div
          className={cn('h-full transition-all duration-300 rounded-l-[2px]', barColor)}
          style={{ width: `${clampedPercentage}%` }}
        />

        {/* Dimension Caliper Notches */}
        {showNotches && (
          <>
            {/* 80% Warning Caliper Notch */}
            <div
              className={cn(
                'absolute w-[2px] bg-[#d97706] z-10 transition-opacity',
                notchHeight
              )}
              style={{ left: '80%' }}
              title="80% Warning Caliper"
              aria-hidden="true"
            >
              <span className="sr-only">80% threshold</span>
            </div>

            {/* 100% Hard Limit Caliper Notch */}
            <div
              className={cn(
                'absolute w-[2px] bg-[#dc2626] z-10 transition-opacity',
                notchHeight
              )}
              style={{ left: '100%', transform: 'translateX(-2px)' }}
              title="100% Hard Limit Caliper"
              aria-hidden="true"
            >
              <span className="sr-only">100% limit</span>
            </div>
          </>
        )}
      </div>

      {showPercentageLabel && (
        <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-[#64748b]">
          <span>{percentage.toFixed(1)}% used</span>
          {isOverBudget ? (
            <span className="text-[#dc2626] font-semibold">Exceeded</span>
          ) : isWarning ? (
            <span className="text-[#d97706] font-semibold">Caliper Alert</span>
          ) : (
            <span>On track</span>
          )}
        </div>
      )}
    </div>
  )
}


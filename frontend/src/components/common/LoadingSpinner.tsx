import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  text,
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center p-6 gap-2 text-[#64748b]', className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      <Loader2 className={cn('animate-spin text-[#161d26]', sizes[size])} aria-hidden="true" />
      {text && <span className="text-xs font-medium">{text}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// ─── Skeleton Primitive ──────────────────────────────────────────────────────
// A single pulsing slab. Compose these into page-shaped skeleton screens.

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn('skeleton-shimmer rounded-[3px]', className)}
    aria-hidden="true"
    {...props}
  />
)

// ─── Skeleton sub-shapes ──────────────────────────────────────────────────────

/** A metric card shell: label slab + large value slab */
export const SkeletonMetricCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white border border-[#d2d9e4] rounded-[4px] p-4 space-y-3', className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-7 w-7 rounded-[3px]" />
    </div>
    <Skeleton className="h-7 w-36" />
    <Skeleton className="h-2.5 w-20" />
  </div>
)

/** A table row shell */
export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <div className="flex items-center gap-4 py-3 px-4 border-b border-[#f0f4f8]">
    <Skeleton className="h-7 w-7 rounded-full shrink-0" />
    {Array.from({ length: cols - 1 }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn('h-3 rounded-[3px]', i === 0 ? 'flex-1' : 'w-20 shrink-0')}
      />
    ))}
  </div>
)

/** A card shell with optional header */
export const SkeletonCard: React.FC<{
  className?: string
  headerHeight?: string
  bodyHeight?: string
  rows?: number
}> = ({ className, headerHeight = 'h-48', bodyHeight, rows }) => (
  <div className={cn('bg-white border border-[#d2d9e4] rounded-[4px] overflow-hidden', className)}>
    <div className="p-4 border-b border-[#d2d9e4] flex items-center justify-between">
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-7 w-20 rounded-[3px]" />
    </div>
    {rows != null ? (
      <div>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </div>
    ) : (
      <div className={cn('p-4', bodyHeight)}>
        <Skeleton className={cn('w-full', headerHeight)} />
      </div>
    )}
  </div>
)


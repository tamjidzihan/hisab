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

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse bg-[#e2e8f0] rounded-[3px]', className)}
      aria-hidden="true"
      {...props}
    />
  )
}


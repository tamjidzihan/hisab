import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'inflow' | 'expense' | 'transfer' | 'warning' | 'critical' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  icon,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium tabular-nums select-none border tracking-wider transition-colors'

  const variants: Record<BadgeVariant, string> = {
    inflow: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]',
    expense: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
    transfer: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
    warning: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]',
    critical: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
    neutral: 'bg-[#f8fafc] text-[#161d26] border-[#d2d9e4]',
  }

  const sizes: Record<BadgeSize, string> = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded-[3px] gap-1',
    md: 'text-xs px-2.5 py-0.5 rounded-full gap-1.5',
  }

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}


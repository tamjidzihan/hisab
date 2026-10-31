import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'inflow' | 'expense' | 'transfer' | 'warning' | 'critical' | 'neutral'
export type BadgeSize = 'xs' | 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  icon,
  dot,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-mono font-semibold tabular-nums select-none border tracking-wider transition-colors shrink-0'

  const variants: Record<BadgeVariant, string> = {
    inflow: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
    expense: 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]',
    transfer: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    warning: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    critical: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
    neutral: 'bg-[#f8fafc] text-[#1e293b] border-[#cbd5e1]',
  }

  const dotColors: Record<BadgeVariant, string> = {
    inflow: 'bg-[#059669]',
    expense: 'bg-[#64748b]',
    transfer: 'bg-[#2563eb]',
    warning: 'bg-[#d97706]',
    critical: 'bg-[#dc2626]',
    neutral: 'bg-[#475569]',
  }

  const sizes: Record<BadgeSize, string> = {
    xs: 'text-[9px] px-1.5 py-0.5 rounded-[3px] gap-1 leading-none',
    sm: 'text-[10px] px-2 py-0.5 rounded-[3px] gap-1 leading-tight',
    md: 'text-[11px] px-2.5 py-1 rounded-[3px] gap-1.5 leading-tight',
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        '[&>svg]:shrink-0 [&>svg]:inline-block',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span
          className="shrink-0 inline-flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

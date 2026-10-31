import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none rounded-[4px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161d26]'

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#161d26] text-white hover:bg-[#25303f] active:bg-[#0b0e13] border border-[#161d26]',
      secondary:
        'bg-white text-[#161d26] border border-[#d2d9e4] hover:bg-[#f4f6f9] hover:border-[#cbd5e1] active:bg-[#e2e8f0]',
      outline:
        'bg-transparent text-[#161d26] border border-[#d2d9e4] hover:bg-[#f4f6f9] active:bg-[#e2e8f0]',
      ghost:
        'bg-transparent text-[#161d26] hover:bg-[#f4f6f9] active:bg-[#e2e8f0]',
      danger:
        'bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] border border-[#dc2626]',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-9',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'


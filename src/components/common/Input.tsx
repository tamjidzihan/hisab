import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  prefixElement?: React.ReactNode
  suffixElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      prefixElement,
      suffixElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#161d26]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#64748b]">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={cn(
              'w-full h-9 px-3 py-1.5 bg-white text-[#161d26] text-sm rounded-[4px] border border-[#d2d9e4] transition-colors',
              'placeholder:text-[#94a3b8]',
              'focus:outline-none focus:border-[#161d26] focus:ring-1 focus:ring-[#161d26]',
              'disabled:bg-[#f8fafc] disabled:text-[#94a3b8] disabled:cursor-not-allowed',
              prefixElement && 'pl-8',
              suffixElement && 'pr-8',
              error && 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]',
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center text-[#64748b]">
              {suffixElement}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-xs text-[#dc2626] font-medium" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#64748b]">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'


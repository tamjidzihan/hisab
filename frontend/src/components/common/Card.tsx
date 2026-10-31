import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-[#d2d9e4] rounded-[6px] overflow-hidden transition-colors',
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-5 py-3.5 border-b border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between">
            {header}
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between text-xs text-[#64748b]">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'


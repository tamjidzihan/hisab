import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  actionLabel,
  onAction,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white border border-[#d2d9e4] border-dashed rounded-[6px]',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-[4px] bg-[#f4f6f9] border border-[#d2d9e4] flex items-center justify-center text-[#64748b] mb-3">
        {icon || <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />}
      </div>
      <h3 className="text-sm font-semibold text-[#161d26]">{title}</h3>
      <p className="text-xs text-[#64748b] max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}


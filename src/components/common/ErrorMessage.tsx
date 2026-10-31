import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  title = 'Unable to Load Data',
  message,
  onRetry,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'p-4 bg-[#fef2f2] border border-[#fecaca] rounded-[4px] flex items-start gap-3 text-sm text-[#991b1b]',
        className
      )}
      {...props}
    >
      <AlertTriangle className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 flex flex-col gap-1">
        <h4 className="font-semibold text-[#dc2626] leading-tight">{title}</h4>
        <p className="text-xs text-[#7f1d1d]">{message}</p>
        {onRetry && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="bg-white border-[#fca5a5] text-[#991b1b] hover:bg-[#fee2e2]"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


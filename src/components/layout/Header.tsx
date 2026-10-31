import React from 'react'
import { Menu, Plus } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { UserMenu } from './UserMenu'
import { NotificationDropdown } from './NotificationDropdown'
import { format } from 'date-fns'

export interface HeaderProps {
  onOpenMobileSidebar: () => void
  onQuickLog?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onQuickLog,
}) => {
  const currentDate = format(new Date(), 'EEEE, dd MMMM yyyy')

  return (
    <header className="h-16 bg-white border-b border-[#d2d9e4] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile hamburger & Date indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar navigation"
          className="p-2 rounded-[4px] border border-[#d2d9e4] md:hidden text-[#161d26] hover:bg-[#f4f6f9] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#161d26] tracking-tight">
            Financial Ledger
          </span>
          <span className="text-[11px] text-[#64748b] font-mono hidden sm:inline">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Right: Quick Action, Alerts & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Log Action */}
        <Button
          size="sm"
          variant="primary"
          onClick={onQuickLog}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-semibold"
        >
          <span className="hidden sm:inline">Quick Log</span>
          <span className="sm:hidden">Log</span>
        </Button>

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-[#d2d9e4] mx-1" aria-hidden="true" />

        {/* User Menu Dropdown */}
        <UserMenu />
      </div>
    </header>
  )
}


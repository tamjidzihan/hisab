import React from 'react'
import { Menu, HelpCircle } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { NotificationDropdown } from './NotificationDropdown'
import { format } from 'date-fns'
import { QuickLogTransaction } from '@/features/transactions/components/QuickLogTransaction'

export interface HeaderProps {
  onOpenMobileSidebar: () => void
  onOpenTourGuide?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenTourGuide,
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

      {/* Right: Quick Action, Tour Guide, Alerts & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <QuickLogTransaction />

        {/* Tour Guide & In-App Help Trigger */}
        {onOpenTourGuide && (
          <button
            type="button"
            onClick={onOpenTourGuide}
            title="Tour Guide & Site Directory"
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#161d26] transition-colors cursor-pointer text-xs font-mono font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-[#d2d9e4] mx-0.5 sm:mx-1" aria-hidden="true" />

        {/* User Menu Dropdown */}
        <UserMenu />
      </div>
    </header>
  )
}

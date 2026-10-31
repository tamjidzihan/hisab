import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Settings, Download, LogOut, ChevronDown } from 'lucide-react'

export interface UserMenuProps {
  userName?: string
  userEmail?: string
  onSignOut?: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({
  userName = 'Account Holder',
  userEmail = 'user@hisab.local',
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 p-1.5 rounded-[4px] hover:bg-[#e5eaf0] transition-colors cursor-pointer select-none border border-transparent focus-visible:outline-2 focus-visible:outline-[#161d26]"
      >
        <div className="w-8 h-8 rounded-[3px] bg-[#161d26] text-white flex items-center justify-center text-xs font-semibold tracking-wider font-mono">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#161d26] leading-tight line-clamp-1">
            {userName}
          </span>
          <span className="text-[10px] text-[#64748b] leading-tight font-mono">
            BDT Ledger
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748b] hidden md:block" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-[#d2d9e4] rounded-[6px] shadow-[0_8px_24px_rgba(22,29,38,0.1)] py-1.5 z-50 text-xs"
        >
          {/* User Info Header */}
          <div className="px-3.5 py-2.5 border-b border-[#e5eaf0] bg-[#fafbfd]">
            <p className="font-semibold text-[#161d26] truncate">{userName}</p>
            <p className="text-[#64748b] truncate text-[11px] mt-0.5 font-mono">{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-[#161d26] hover:bg-[#f4f6f9] transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 text-[#64748b]" />
              <span>Profile Details</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-[#161d26] hover:bg-[#f4f6f9] transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-[#64748b]" />
              <span>Preferences & Currencies</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false)
                alert('Exporting Hisab financial ledger records as CSV...')
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#161d26] hover:bg-[#f4f6f9] transition-colors text-left cursor-pointer"
              role="menuitem"
            >
              <Download className="w-4 h-4 text-[#64748b]" />
              <span>Export Ledger (CSV)</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-[#e5eaf0] pt-1 mt-1">
            <button
              onClick={() => {
                setIsOpen(false)
                if (onSignOut) onSignOut()
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[#dc2626] hover:bg-[#fef2f2] transition-colors text-left cursor-pointer font-medium"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


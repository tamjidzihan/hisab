import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  SlidersHorizontal,
  BarChart3,
  Target,
  Settings,
  Compass,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Transactions', to: '/transactions', icon: Receipt },
  { name: 'Accounts & Vaults', to: '/accounts', icon: Landmark },
  { name: 'Budgets & Calipers', to: '/budgets', icon: SlidersHorizontal },
  { name: 'Analytics & Trends', to: '/analytics', icon: BarChart3 },
  { name: 'Savings Goals', to: '/goals', icon: Target },
  { name: 'Settings', to: '/settings', icon: Settings },
]

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#161d26]/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#d2d9e4] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 shrink-0 select-none',
          isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-5 border-b border-[#e5eaf0] flex items-center justify-between">
            <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#161d26] text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#f59e0b]" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-widest text-[#161d26] uppercase font-mono">
                  HISAB
                </span>
                <span className="text-[10px] text-[#64748b] tracking-tight">
                  Draftsman&apos;s Ledger
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="p-1 rounded-[4px] text-[#64748b] hover:text-[#161d26] md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
              Ledger Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-medium transition-colors border-l-[3px]',
                      isActive
                        ? 'border-[#161d26] bg-[#f4f6f9] text-[#161d26] font-semibold'
                        : 'border-transparent text-[#64748b] hover:text-[#161d26] hover:bg-[#fafbfd]'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-[#e5eaf0] bg-[#fafbfd] text-xs">
          <div className="flex items-center justify-between text-[#64748b] font-mono text-[11px] mb-1">
            <span>CURRENCY</span>
            <span className="font-semibold text-[#161d26]">BDT (৳)</span>
          </div>
          <div className="flex items-center justify-between text-[#64748b] font-mono text-[11px]">
            <span>PRECISION</span>
            <span className="text-[#059669] font-medium">Integer Paisa</span>
          </div>
        </div>
      </aside>
    </>
  )
}


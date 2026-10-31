import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Check,
  Settings,
  Trash2,
  ExternalLink,
} from 'lucide-react'

export interface NotificationItem {
  id: string
  type: 'caliper_breach' | 'caliper_warning' | 'bill_reminder' | 'liquidity' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  link?: string
  severity: 'critical' | 'warning' | 'info' | 'success'
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'caliper_breach',
    title: 'Transportation Budget Exceeded',
    message: 'Current spending of ৳8,400 has exceeded the ৳8,000 limit (105% consumed).',
    timestamp: '15m ago',
    isRead: false,
    link: '/budgets',
    severity: 'critical',
  },
  {
    id: 'notif-2',
    type: 'caliper_warning',
    title: 'Utilities Caliper at 88.5%',
    message: 'Crossed the 80% warning threshold. ৳8,850 spent of ৳10,000 allowance.',
    timestamp: '2h ago',
    isRead: false,
    link: '/budgets',
    severity: 'warning',
  },
  {
    id: 'notif-3',
    type: 'bill_reminder',
    title: 'House Rent Due in 4 Days',
    message: 'Scheduled monthly obligation of ৳22,000 due on 05 Nov 2026.',
    timestamp: 'Today, 09:00',
    isRead: false,
    link: '/dashboard',
    severity: 'info',
  },
  {
    id: 'notif-4',
    type: 'liquidity',
    title: 'Retainer Deposit Posted',
    message: '+৳60,000 received in Prime Bank Current from TechCorp Solutions.',
    timestamp: 'Yesterday',
    isRead: true,
    link: '/transactions',
    severity: 'success',
  },
]

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleItemClick = (notification: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    )
    setIsOpen(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const getSeverityIcon = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-[#dc2626] shrink-0" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0" />
      case 'info':
        return <CalendarClock className="w-4 h-4 text-[#2563eb] shrink-0" />
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
      default:
        return <Bell className="w-4 h-4 text-[#64748b] shrink-0" />
    }
  }

  const getSeverityBadgeClass = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-[3px] border-l-[#dc2626]'
      case 'warning':
        return 'border-l-[3px] border-l-[#d97706]'
      case 'info':
        return 'border-l-[3px] border-l-[#2563eb]'
      case 'success':
        return 'border-l-[3px] border-l-[#059669]'
      default:
        return 'border-l-[3px] border-l-[#64748b]'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`View notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`relative p-2 rounded-[4px] border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#161d26] ${
          isOpen
            ? 'border-[#161d26] bg-[#f4f6f9] text-[#161d26]'
            : 'border-[#d2d9e4] text-[#64748b] hover:text-[#161d26] hover:bg-[#f4f6f9]'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#dc2626] text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-white tabular-nums shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications popover"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#d2d9e4] rounded-[6px] shadow-[0_8px_24px_rgba(22,29,38,0.12)] z-50 text-xs overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#161d26] font-mono tracking-tight uppercase text-xs">
                Ledger Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] font-mono font-semibold text-[10px] tabular-nums">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#059669] hover:underline font-medium cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="overflow-y-auto divide-y divide-[#e5eaf0] max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-[4px] bg-[#f4f6f9] border border-[#d2d9e4] flex items-center justify-center text-[#64748b] mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                </div>
                <p className="font-semibold text-xs text-[#161d26]">All Clear</p>
                <p className="text-[11px] text-[#64748b]">
                  No active caliper notices, bill reminders, or account warnings.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-[#f8fafc] ${getSeverityBadgeClass(
                    item.severity
                  )} ${!item.isRead ? 'bg-[#fafbfd]' : 'bg-white'}`}
                >
                  <div className="pt-0.5">{getSeverityIcon(item.severity)}</div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs leading-snug line-clamp-1 ${
                          !item.isRead ? 'font-bold text-[#161d26]' : 'font-semibold text-[#334155]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#64748b] whitespace-nowrap shrink-0 tabular-nums">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748b] leading-relaxed line-clamp-2">
                      {item.message}
                    </p>

                    {item.link && (
                      <div className="pt-0.5 flex items-center gap-1 text-[10px] font-mono text-[#2563eb] font-medium">
                        <span>Inspect in ledger</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {!item.isRead && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0 mt-1.5"
                      aria-label="Unread"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between text-[11px] font-mono">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="text-[#64748b] hover:text-[#161d26] flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Caliper Alert Preferences</span>
            </Link>

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[#64748b] hover:text-[#dc2626] flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

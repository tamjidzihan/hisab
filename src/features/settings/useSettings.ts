import { useState, useCallback } from 'react'
import type {
  UserProfile,
  RegionalSettings,
  CaliperAlertSettings,
  SessionInfo,
} from './types'
import { exportTransactionsToCsv } from '@/features/transactions/csvUtils'
import { INITIAL_TRANSACTIONS } from '@/features/transactions/useTransactions'

const INITIAL_PROFILE: UserProfile = {
  name: 'Zihan Chowdhury',
  email: 'zihan@hisab.local',
  householdName: 'Chowdhury Household Ledger',
  role: 'Primary Account Controller',
  joinedDate: '2026-01-15',
  userId: 'usr-8921-bd',
}

const INITIAL_REGIONAL: RegionalSettings = {
  baseCurrency: 'BDT',
  dateFormat: 'DD MMM YYYY',
  decimalPrecision: '2',
  weekStartDay: 'saturday',
  fiscalCycleDay: 1,
}

const INITIAL_CALIPER: CaliperAlertSettings = {
  warningThresholdPercent: 80,
  limitThresholdPercent: 100,
  billReminderLeadDays: 3,
  enableCaliperNotices: true,
  enableNegativeCashFlowAlerts: true,
  enableLowBalanceAlerts: true,
  lowBalanceThresholdMinor: 500000, // ৳5,000.00
}

const INITIAL_SESSIONS: SessionInfo[] = [
  {
    id: 'sess-current',
    device: 'Windows 11 Workstation',
    browser: 'Chrome 130.0 / Desktop',
    location: 'Dhaka, Bangladesh',
    ipAddress: '103.114.98.24',
    lastActive: 'Active Now',
    isCurrent: true,
  },
  {
    id: 'sess-mobile',
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile 18.1',
    location: 'Dhaka, Bangladesh',
    ipAddress: '103.114.98.50',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 'sess-tablet',
    device: 'iPad Air 5th Gen',
    browser: 'Safari 18.0',
    location: 'Chittagong, Bangladesh',
    ipAddress: '182.160.112.9',
    lastActive: '3 days ago',
    isCurrent: false,
  },
]

export function useSettings() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE)
  const [regional, setRegional] = useState<RegionalSettings>(INITIAL_REGIONAL)
  const [caliper, setCaliper] = useState<CaliperAlertSettings>(INITIAL_CALIPER)
  const [sessions, setSessions] = useState<SessionInfo[]>(INITIAL_SESSIONS)

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateRegional = useCallback((updates: Partial<RegionalSettings>) => {
    setRegional((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateCaliper = useCallback((updates: Partial<CaliperAlertSettings>) => {
    setCaliper((prev) => ({ ...prev, ...updates }))
  }, [])

  const terminateSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId || s.isCurrent))
  }, [])

  // Full System Export (JSON Archive)
  const exportFullJsonArchive = useCallback(() => {
    const backupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      schema: "Draftsman's Ledger v2.0",
      profile,
      regional,
      caliper,
      exportedRecordsCount: INITIAL_TRANSACTIONS.length,
      transactions: INITIAL_TRANSACTIONS,
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute(
      'download',
      `hisab-full-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }, [profile, regional, caliper])

  // CSV Ledger Export
  const exportCsv = useCallback(() => {
    exportTransactionsToCsv(INITIAL_TRANSACTIONS)
  }, [])

  // System Purge / Reset to default factory state
  const purgeAllData = useCallback(() => {
    setProfile(INITIAL_PROFILE)
    setRegional(INITIAL_REGIONAL)
    setCaliper(INITIAL_CALIPER)
    setSessions([INITIAL_SESSIONS[0]])
  }, [])

  return {
    profile,
    regional,
    caliper,
    sessions,
    updateProfile,
    updateRegional,
    updateCaliper,
    terminateSession,
    exportFullJsonArchive,
    exportCsv,
    purgeAllData,
  }
}


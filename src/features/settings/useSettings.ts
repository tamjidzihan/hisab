import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type {
  UserProfile,
  RegionalSettings,
  CaliperAlertSettings,
  SessionInfo,
} from './types'
import { exportTransactionsToCsv } from '@/features/transactions/csvUtils'

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

export function useSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    userId: '',
    name: '',
    email: '',
    householdName: '',
    role: '',
    joinedDate: '',
  })
  const [regional, setRegional] = useState<RegionalSettings>(INITIAL_REGIONAL)
  const [caliper, setCaliper] = useState<CaliperAlertSettings>(INITIAL_CALIPER)
  const [sessions, setSessions] = useState<SessionInfo[]>(INITIAL_SESSIONS)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch profile and sessions from backend
  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      const [profRes, sessRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: { profile: any } }>('/settings/profile').catch(() => null),
        apiClient.get<{ success: boolean; data: { sessions: any[] } }>('/settings/sessions').catch(() => null),
      ])

      if (profRes?.data?.data?.profile) {
        const p = profRes.data.data.profile
        setProfile({
          userId: p.id || 'usr-8921-bd',
          name: p.name || 'Zihan Chowdhury',
          email: p.email || 'zihan@hisab.local',
          householdName: p.householdName || 'Chowdhury Household Ledger',
          role: p.role || 'Primary Account Controller',
          joinedDate: p.joinedDate || '2026-01-15',
        })
        if (p.baseCurrency) {
          setRegional((prev) => ({ ...prev, baseCurrency: p.baseCurrency }))
        }
      }

      if (sessRes?.data?.data?.sessions && Array.isArray(sessRes.data.data.sessions) && sessRes.data.data.sessions.length > 0) {
        setSessions(sessRes.data.data.sessions.map((s: any) => ({
          id: s.id,
          device: s.device,
          browser: s.browser,
          location: s.location || 'Dhaka, Bangladesh',
          ipAddress: s.ipAddress || '103.114.98.24',
          lastActive: s.isCurrent ? 'Active Now' : new Date(s.lastActive).toLocaleDateString(),
          isCurrent: Boolean(s.isCurrent),
        })))
      }
    } catch {
      // Retain fallback defaults
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
    apiClient.patch('/settings/profile', updates).catch(() => {})
  }, [])

  const updateRegional = useCallback((updates: Partial<RegionalSettings>) => {
    setRegional((prev) => ({ ...prev, ...updates }))
    if (updates.baseCurrency) {
      apiClient.patch('/settings/profile', { baseCurrency: updates.baseCurrency }).catch(() => {})
    }
  }, [])

  const updateCaliper = useCallback((updates: Partial<CaliperAlertSettings>) => {
    setCaliper((prev) => ({ ...prev, ...updates }))
  }, [])

  const terminateSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId || s.isCurrent))
    apiClient.delete(`/settings/sessions/${sessionId}`).catch(() => {})
  }, [])

  // Full System Export (JSON Archive)
  const exportFullJsonArchive = useCallback(async () => {
    try {
      const res = await apiClient.get('/transactions?limit=1000')
      const transactions = res.data?.data?.transactions ?? []
      const backupPayload = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        schema: "Draftsman's Ledger v2.0",
        profile,
        regional,
        caliper,
        exportedRecordsCount: transactions.length,
        transactions,
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
    } catch {
      // silently fail — user sees no download
    }
  }, [profile, regional, caliper])

  // CSV Ledger Export
  const exportCsv = useCallback(async () => {
    try {
      const res = await apiClient.get('/transactions?limit=1000')
      const transactions = res.data?.data?.transactions ?? []
      exportTransactionsToCsv(transactions)
    } catch {
      // silently fail
    }
  }, [])

  // System Purge / Reset to default factory state
  const purgeAllData = useCallback(async () => {
    try {
      await apiClient.delete('/settings/purge').catch(() => {})
    } finally {
      setProfile({
        userId: '',
        name: '',
        email: '',
        householdName: '',
        role: '',
        joinedDate: '',
      })
      setRegional(INITIAL_REGIONAL)
      setCaliper(INITIAL_CALIPER)
      setSessions([])
    }
  }, [])

  return {
    profile,
    regional,
    caliper,
    sessions,
    isLoading,
    updateProfile,
    updateRegional,
    updateCaliper,
    terminateSession,
    exportFullJsonArchive,
    exportCsv,
    purgeAllData,
    refreshSettings: fetchSettings,
  }
}


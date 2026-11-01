import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type {
  UserProfile,
  RegionalSettings,
  CaliperAlertSettings,
  SessionInfo,
} from './types'
import { exportTransactionsToCsv } from '@/features/transactions/csvUtils'
import { useAuth } from '@/features/auth/AuthContext'

interface SettingsProfileResponse {
  id: string
  name: string
  email: string
  householdName: string
  role: string
  joinedDate: string
  baseCurrency?: RegionalSettings['baseCurrency']
}

interface SettingsSessionResponse {
  id: string
  device: string
  browser: string
  location?: string | null
  ipAddress?: string | null
  lastActive: string
  isCurrent: boolean
}

const EMPTY_PROFILE: UserProfile = {
  userId: '',
  name: '',
  email: '',
  householdName: '',
  role: '',
  joinedDate: '',
}

const profileFromAuthUser = (user: ReturnType<typeof useAuth>['user']): UserProfile =>
  user
    ? {
        userId: user.id,
        name: user.name,
        email: user.email,
        householdName: user.householdName,
        role: user.role,
        joinedDate: user.joinedDate,
      }
    : EMPTY_PROFILE

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
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(() => profileFromAuthUser(user))
  const [regional, setRegional] = useState<RegionalSettings>(INITIAL_REGIONAL)
  const [caliper, setCaliper] = useState<CaliperAlertSettings>(INITIAL_CALIPER)
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch profile and sessions from backend
  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    const [profileResult, sessionsResult] = await Promise.allSettled([
      apiClient.get<{ success: boolean; data: { profile: SettingsProfileResponse } }>('/settings/profile'),
      apiClient.get<{ success: boolean; data: { sessions: SettingsSessionResponse[] } }>('/settings/sessions'),
    ])

    if (profileResult.status === 'fulfilled') {
      const p = profileResult.value.data.data.profile
      setProfile({
        userId: p.id || user?.id || '',
        name: p.name || user?.name || '',
        email: p.email || user?.email || '',
        householdName: p.householdName || user?.householdName || '',
        role: p.role || user?.role || '',
        joinedDate: p.joinedDate || user?.joinedDate || '',
      })
      const baseCurrency = p.baseCurrency
      if (baseCurrency) {
        setRegional((prev) => ({ ...prev, baseCurrency }))
      }
    } else {
      setProfile(profileFromAuthUser(user))
      console.error('Failed to load settings profile.', profileResult.reason)
    }

    if (sessionsResult.status === 'fulfilled') {
      setSessions(sessionsResult.value.data.data.sessions.map((s) => ({
          id: s.id,
          device: s.device,
          browser: s.browser,
          location: s.location || 'Location unavailable',
          ipAddress: s.ipAddress || 'Unavailable',
          lastActive: s.isCurrent ? 'Active Now' : new Date(s.lastActive).toLocaleDateString(),
          isCurrent: Boolean(s.isCurrent),
        })))
    } else {
      setSessions([])
      console.error('Failed to load active sessions.', sessionsResult.reason)
    }
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    void fetchSettings()
  }, [fetchSettings, user])

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
      setProfile(EMPTY_PROFILE)
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

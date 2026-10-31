export interface UserProfile {
  name: string
  email: string
  householdName: string
  role: string
  joinedDate: string
  userId: string
}

export type SupportedCurrency = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'SAR' | 'AED' | 'CAD'
export type DateFormatOption = 'DD MMM YYYY' | 'YYYY-MM-DD' | 'DD/MM/YYYY'
export type WeekStartOption = 'saturday' | 'sunday' | 'monday'

export interface RegionalSettings {
  baseCurrency: SupportedCurrency
  dateFormat: DateFormatOption
  decimalPrecision: '2' | '0'
  weekStartDay: WeekStartOption
  fiscalCycleDay: number // e.g. 1 or 25
}

export interface CaliperAlertSettings {
  warningThresholdPercent: number // e.g. 80
  limitThresholdPercent: number // e.g. 100
  billReminderLeadDays: number // e.g. 3
  enableCaliperNotices: boolean
  enableNegativeCashFlowAlerts: boolean
  enableLowBalanceAlerts: boolean
  lowBalanceThresholdMinor: number // e.g. 500000 (৳5,000)
}

export interface SessionInfo {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  lastActive: string
  isCurrent: boolean
}


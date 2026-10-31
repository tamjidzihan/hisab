import { format, parseISO, isValid } from 'date-fns'

/**
 * Currency symbol mapping with default BDT (৳)
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
}

/**
 * Formats integer minor units (e.g., paisa/cents) into exact currency display.
 * Avoids floating-point drift by computing major and minor integer parts directly.
 * 
 * Example:
 * 125050 -> "৳ 1,250.50"
 * -45000 -> "-৳ 450.00"
 */
export function formatCurrency(
  minorUnits: number,
  currency: string = 'BDT',
  options: { showPositiveSign?: boolean; spaceAfterSymbol?: boolean } = {}
): string {
  const { showPositiveSign = false, spaceAfterSymbol = true } = options
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  const spacing = spaceAfterSymbol ? ' ' : ''

  if (isNaN(minorUnits)) {
    return `${symbol}${spacing}0.00`
  }

  const isNegative = minorUnits < 0
  const isPositive = minorUnits > 0
  const absMinor = Math.abs(Math.round(minorUnits))

  const major = Math.floor(absMinor / 100)
  const minor = absMinor % 100

  // Format major units with thousands separators using en-US locale
  const majorFormatted = major.toLocaleString('en-US')
  const minorFormatted = minor.toString().padStart(2, '0')

  const baseFormatted = `${symbol}${spacing}${majorFormatted}.${minorFormatted}`

  if (isNegative) {
    return `-${baseFormatted}`
  }
  if (isPositive && showPositiveSign) {
    return `+${baseFormatted}`
  }
  return baseFormatted
}

/**
 * Parses user input string (e.g. "1250.50" or "1250") safely into integer minor units (125050).
 * Prevents precision loss from standard parseFloat multiplication.
 */
export function parseToMinorUnits(valueStr: string): number {
  if (!valueStr || typeof valueStr !== 'string') return 0
  const clean = valueStr.trim().replace(/[^0-9.-]/g, '')
  if (!clean || clean === '-') return 0

  const isNegative = clean.startsWith('-')
  const absStr = isNegative ? clean.substring(1) : clean

  const parts = absStr.split('.')
  const major = parseInt(parts[0] || '0', 10)
  let minor = 0

  if (parts.length > 1) {
    const minorStr = (parts[1] + '00').substring(0, 2)
    minor = parseInt(minorStr, 10)
  }

  const result = major * 100 + minor
  return isNegative ? -result : result
}

/**
 * Formats a percentage value (e.g. 78.4 -> "78.4%")
 */
export function formatPercentage(rate: number, decimals: number = 1): string {
  if (isNaN(rate) || !isFinite(rate)) return 'N/A'
  return `${rate.toFixed(decimals)}%`
}

/**
 * Formats dates consistently across the app using date-fns
 */
export function formatDate(dateInput: string | Date | null | undefined, pattern: string = 'dd MMM yyyy'): string {
  if (!dateInput) return '—'
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
    if (!isValid(date)) return '—'
    return format(date, pattern)
  } catch {
    return '—'
  }
}


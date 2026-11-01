import type { Account, Category, Transaction, TransactionType } from '@/types'
import { parseToMinorUnits } from '@/lib/formatters'

/**
 * Escapes CSV field according to RFC 4180
 */
function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""'
  const stringValue = String(value)
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Generates and downloads an RFC 4180 CSV export of transaction records.
 */
export function exportTransactionsToCsv(
  transactions: Transaction[],
  fileName: string = `hisab-ledger-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  const headers = [
    'Date',
    'Type',
    'Amount (BDT)',
    'Description',
    'Payee',
    'Account',
    'Category',
    'Transfer Destination',
    'Payment Method',
    'Notes',
  ]

  const rows = transactions.map((tx) => [
    tx.transactionDate,
    tx.type.toUpperCase(),
    (tx.amountMinor / 100).toFixed(2),
    tx.description,
    tx.payee || '',
    tx.accountName || '',
    tx.categoryName || '',
    tx.transferDestinationAccountName || '',
    tx.paymentMethod || '',
    tx.notes || '',
  ])

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Parses and validates an uploaded CSV file into structured Transaction objects.
 */
export function parseTransactionsFromCsv(
  csvText: string,
  userId: string,
  accounts: Account[],
  categories: Category[]
): {
  valid: Transaction[]
  errors: string[]
} {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    return { valid: [], errors: ['CSV file contains no data rows.'] }
  }

  // Parse header
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim())
  const dateIdx = headers.findIndex((h) => h.includes('date'))
  const typeIdx = headers.findIndex((h) => h.includes('type'))
  const amountIdx = headers.findIndex((h) => h.includes('amount'))
  const descIdx = headers.findIndex((h) => h.includes('desc'))
  const payeeIdx = headers.findIndex((h) => h.includes('payee'))
  const accountIdx = headers.findIndex((h) => h === 'account' || h === 'source account')
  const categoryIdx = headers.findIndex((h) => h.includes('category'))
  const destinationAccountIdx = headers.findIndex(
    (h) =>
      h.includes('destination account') ||
      h.includes('transfer destination') ||
      h.includes('to account')
  )

  if ([dateIdx, typeIdx, amountIdx, descIdx, accountIdx].includes(-1)) {
    return {
      valid: [],
      errors: [
        'Missing required CSV headers. Expected: Date, Type, Amount, Description, and Account.',
      ],
    }
  }

  const valid: Transaction[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const rawCells = parseCsvLine(lines[i])
    if (rawCells.length < 3) continue

    const dateVal = rawCells[dateIdx]?.trim()
    const typeVal = rawCells[typeIdx]?.trim().toLowerCase() as TransactionType
    const amountVal = rawCells[amountIdx]?.trim()
    const descVal = rawCells[descIdx]?.trim()
    const accountName = rawCells[accountIdx]?.trim()
    const destinationAccountName = rawCells[destinationAccountIdx]?.trim()
    const categoryName = rawCells[categoryIdx]?.trim()

    if (!dateVal || !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      errors.push(`Row ${i + 1}: Invalid date format (expected YYYY-MM-DD), got "${dateVal}".`)
      continue
    }

    if (!['income', 'expense', 'transfer'].includes(typeVal)) {
      errors.push(
        `Row ${i + 1}: Invalid transaction type "${typeVal}" (must be income, expense, or transfer).`
      )
      continue
    }

    const amountMinor = parseToMinorUnits(amountVal)
    if (amountMinor <= 0) {
      errors.push(`Row ${i + 1}: Invalid or zero amount "${amountVal}".`)
      continue
    }

    if (!descVal) {
      errors.push(`Row ${i + 1}: Description cannot be empty.`)
      continue
    }

    const account = accounts.find(
      (item) => item.name.toLowerCase() === accountName?.toLowerCase()
    )
    if (!account) {
      errors.push(`Row ${i + 1}: Account "${accountName}" was not found in your accounts.`)
      continue
    }

    const destinationAccount =
      typeVal === 'transfer'
        ? accounts.find(
            (item) => item.name.toLowerCase() === destinationAccountName?.toLowerCase()
          )
        : undefined
    if (typeVal === 'transfer' && !destinationAccount) {
      errors.push(
        `Row ${i + 1}: Transfer destination account "${destinationAccountName}" was not found.`
      )
      continue
    }

    const category =
      categoryName && typeVal !== 'transfer'
        ? categories.find(
            (item) =>
              item.type === typeVal && item.name.toLowerCase() === categoryName.toLowerCase()
          )
        : undefined
    if (categoryName && typeVal !== 'transfer' && !category) {
      errors.push(`Row ${i + 1}: Category "${categoryName}" was not found for ${typeVal}.`)
      continue
    }

    const newTx: Transaction = {
      id: `imp-${Date.now()}-${i}`,
      userId,
      accountId: account.id,
      accountName: account.name,
      categoryId: category?.id || null,
      categoryName: category?.name,
      type: typeVal,
      amountMinor,
      currency: account.currency,
      transactionDate: dateVal,
      description: descVal,
      payee: rawCells[payeeIdx]?.trim() || undefined,
      transferDestinationAccountId: destinationAccount?.id,
      transferDestinationAccountName: destinationAccount?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    valid.push(newTx)
  }

  return { valid, errors }
}

/**
 * Parses a single CSV line with support for quotes and escaped quotes
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cell += '"'
        i++ // Skip escaped quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cell)
      cell = ''
    } else {
      cell += char
    }
  }
  result.push(cell)
  return result
}

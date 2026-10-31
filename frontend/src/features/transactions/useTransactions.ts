import { useState, useMemo, useCallback } from 'react'
import type { Transaction, TransactionType } from '@/types'

// Initial ledger seed records in integer minor units (paisa)
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    userId: 'usr-1',
    accountId: 'acc-2',
    accountName: 'Prime Bank Current',
    categoryId: 'cat-salary',
    categoryName: 'Professional Retainer',
    type: 'income',
    amountMinor: 6000000, // ৳60,000.00
    currency: 'BDT',
    transactionDate: '2026-11-01',
    description: 'Monthly Software Architecture Retainer',
    payee: 'TechCorp Solutions',
    paymentMethod: 'Bank Transfer',
    notes: 'Invoiced on 25 Oct, cleared via BEFTN.',
    tags: ['retainer', 'client', 'consulting'],
    createdAt: '2026-11-01T09:30:00Z',
    updatedAt: '2026-11-01T09:30:00Z',
  },
  {
    id: 'tx-102',
    userId: 'usr-1',
    accountId: 'acc-3',
    accountName: 'bKash Primary MFS',
    categoryId: 'cat-bills',
    categoryName: 'Utilities & Subscriptions',
    type: 'expense',
    amountMinor: 150000, // ৳1,500.00
    currency: 'BDT',
    transactionDate: '2026-11-01',
    description: 'Residential Fiber Broadband',
    payee: 'Carnival Internet',
    paymentMethod: 'bKash MFS',
    notes: 'Static IP addon included.',
    tags: ['internet', 'utility'],
    createdAt: '2026-11-01T10:15:00Z',
    updatedAt: '2026-11-01T10:15:00Z',
  },
  {
    id: 'tx-103',
    userId: 'usr-1',
    accountId: 'acc-2',
    accountName: 'Prime Bank Current',
    categoryId: null,
    type: 'transfer',
    amountMinor: 500000, // ৳5,000.00
    currency: 'BDT',
    transactionDate: '2026-10-31',
    description: 'Bank to bKash Top-up',
    transferGroupId: 'trf-9982',
    transferDestinationAccountId: 'acc-3',
    transferDestinationAccountName: 'bKash Primary MFS',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly liquidity allocation for mobile expenses.',
    tags: ['transfer', 'rebalance'],
    createdAt: '2026-10-31T18:00:00Z',
    updatedAt: '2026-10-31T18:00:00Z',
  },
  {
    id: 'tx-104',
    userId: 'usr-1',
    accountId: 'acc-1',
    accountName: 'Cash Vault',
    categoryId: 'cat-food',
    categoryName: 'Groceries & Dining',
    type: 'expense',
    amountMinor: 428000, // ৳4,280.00
    currency: 'BDT',
    transactionDate: '2026-10-30',
    description: 'Weekly Bazaar & Fresh Produce',
    payee: 'Shwapno Super Shop',
    paymentMethod: 'Cash',
    notes: 'Household groceries and staples.',
    tags: ['household', 'food'],
    createdAt: '2026-10-30T16:20:00Z',
    updatedAt: '2026-10-30T16:20:00Z',
  },
  {
    id: 'tx-105',
    userId: 'usr-1',
    accountId: 'acc-4',
    accountName: 'Nagad Wallet',
    categoryId: 'cat-transport',
    categoryName: 'Transportation & Fuel',
    type: 'expense',
    amountMinor: 85000, // ৳850.00
    currency: 'BDT',
    transactionDate: '2026-10-29',
    description: 'Fuel Refill & Express Highway Toll',
    payee: 'Padma Oil Filling Station',
    paymentMethod: 'Nagad',
    tags: ['fuel', 'transport'],
    createdAt: '2026-10-29T14:10:00Z',
    updatedAt: '2026-10-29T14:10:00Z',
  },
  {
    id: 'tx-106',
    userId: 'usr-1',
    accountId: 'acc-2',
    accountName: 'Prime Bank Current',
    categoryId: 'cat-invest',
    categoryName: 'Savings & Goals',
    type: 'expense',
    amountMinor: 1500000, // ৳15,000.00
    currency: 'BDT',
    transactionDate: '2026-10-28',
    description: 'Monthly Emergency Fund Deposit',
    payee: 'National Savings Certificate (Sanchaypatra)',
    paymentMethod: 'Bank Transfer',
    tags: ['savings', 'emergency-fund'],
    createdAt: '2026-10-28T11:00:00Z',
    updatedAt: '2026-10-28T11:00:00Z',
  },
  {
    id: 'tx-107',
    userId: 'usr-1',
    accountId: 'acc-1',
    accountName: 'Cash Vault',
    categoryId: 'cat-food',
    categoryName: 'Groceries & Dining',
    type: 'expense',
    amountMinor: 185000, // ৳1,850.00
    currency: 'BDT',
    transactionDate: '2026-10-26',
    description: 'Dinner with colleagues',
    payee: 'Star Kabab & Restaurant',
    paymentMethod: 'Cash',
    tags: ['dining'],
    createdAt: '2026-10-26T20:45:00Z',
    updatedAt: '2026-10-26T20:45:00Z',
  },
  {
    id: 'tx-108',
    userId: 'usr-1',
    accountId: 'acc-2',
    accountName: 'Prime Bank Current',
    categoryId: 'cat-salary',
    categoryName: 'Professional Retainer',
    type: 'income',
    amountMinor: 2500000, // ৳25,000.00
    currency: 'BDT',
    transactionDate: '2026-10-25',
    description: 'Advisory Consultation Fee',
    payee: 'Apex Financial Services',
    paymentMethod: 'Bank Transfer',
    tags: ['advisory', 'freelance'],
    createdAt: '2026-10-25T15:00:00Z',
    updatedAt: '2026-10-25T15:00:00Z',
  },
]

export interface TransactionFilterState {
  search: string
  type: 'all' | TransactionType
  account: string
  category: string
  datePreset: 'all' | 'this_month' | 'last_month'
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [filters, setFilters] = useState<TransactionFilterState>({
    search: '',
    type: 'all',
    account: 'all',
    category: 'all',
    datePreset: 'all',
  })

  const [sortField, setSortField] = useState<'transactionDate' | 'amountMinor' | 'description'>('transactionDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Unique lists for dropdowns
  const availableAccounts = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((tx) => {
      if (tx.accountName) set.add(tx.accountName)
      if (tx.transferDestinationAccountName) set.add(tx.transferDestinationAccountName)
    })
    return Array.from(set)
  }, [transactions])

  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((tx) => {
      if (tx.categoryName) set.add(tx.categoryName)
    })
    return Array.from(set)
  }, [transactions])

  // Filter and Sort Pipeline
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filters.type !== 'all' && tx.type !== filters.type) return false

      // Account filter
      if (
        filters.account !== 'all' &&
        tx.accountName !== filters.account &&
        tx.transferDestinationAccountName !== filters.account
      ) {
        return false
      }

      // Category filter
      if (filters.category !== 'all' && tx.categoryName !== filters.category) return false

      // Date Preset Filter
      if (filters.datePreset === 'this_month') {
        if (!tx.transactionDate.startsWith('2026-11')) return false
      } else if (filters.datePreset === 'last_month') {
        if (!tx.transactionDate.startsWith('2026-10')) return false
      }

      // Search query (payee, description, notes, tags)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchDesc = tx.description.toLowerCase().includes(query)
        const matchPayee = tx.payee?.toLowerCase().includes(query) || false
        const matchNotes = tx.notes?.toLowerCase().includes(query) || false
        const matchTags = tx.tags?.some((t) => t.toLowerCase().includes(query)) || false
        if (!matchDesc && !matchPayee && !matchNotes && !matchTags) return false
      }

      return true
    })
  }, [transactions, filters])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let comparison = 0
      if (sortField === 'transactionDate') {
        comparison = a.transactionDate.localeCompare(b.transactionDate)
      } else if (sortField === 'amountMinor') {
        comparison = a.amountMinor - b.amountMinor
      } else if (sortField === 'description') {
        comparison = a.description.localeCompare(b.description)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredTransactions, sortField, sortOrder])

  // Summary Metrics for the filtered set (strict financial rules: transfers excluded from income/expense)
  const metrics = useMemo(() => {
    let inflowMinor = 0
    let outflowMinor = 0
    let transferVolumeMinor = 0

    filteredTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        inflowMinor += tx.amountMinor
      } else if (tx.type === 'expense') {
        outflowMinor += tx.amountMinor
      } else if (tx.type === 'transfer') {
        transferVolumeMinor += tx.amountMinor
      }
    })

    return {
      count: filteredTransactions.length,
      inflowMinor,
      outflowMinor,
      transferVolumeMinor,
      netCashFlowMinor: inflowMinor - outflowMinor,
    }
  }, [filteredTransactions])

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize))
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedTransactions.slice(start, start + pageSize)
  }, [sortedTransactions, page, pageSize])

  // CRUD actions
  const createTransaction = useCallback((newTx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions((prev) => [transaction, ...prev])
    return transaction
  }, [])

  const updateTransaction = useCallback((id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? { ...tx, ...updatedFields, updatedAt: new Date().toISOString() }
          : tx
      )
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    let deletedItem: Transaction | null = null
    setTransactions((prev) => {
      deletedItem = prev.find((tx) => tx.id === id) || null
      return prev.filter((tx) => tx.id !== id)
    })
    return deletedItem
  }, [])

  const restoreTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev])
  }, [])

  const bulkImportTransactions = useCallback((newItems: Transaction[]) => {
    setTransactions((prev) => [...newItems, ...prev])
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      account: 'all',
      category: 'all',
      datePreset: 'all',
    })
    setPage(1)
  }, [])

  const toggleSort = useCallback((field: 'transactionDate' | 'amountMinor' | 'description') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    setPage(1)
  }, [sortField])

  return {
    transactions,
    filteredTransactions,
    paginatedTransactions,
    metrics,
    filters,
    setFilters,
    resetFilters,
    sortField,
    sortOrder,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    availableAccounts,
    availableCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    bulkImportTransactions,
  }
}


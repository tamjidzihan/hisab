import { useState, useMemo, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { LEDGER_UPDATED_EVENT } from '@/lib/ledgerEvents'
import type { Transaction, TransactionType } from '@/types'

export interface TransactionFilterState {
  search: string
  type: 'all' | TransactionType
  account: string
  category: string
  datePreset: 'all' | 'this_month' | 'last_month'
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
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

  // Fetch transactions from backend
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get<{ success: boolean; data: { transactions: any[] } }>('/transactions?limit=250')
      if (res.data?.data?.transactions && Array.isArray(res.data.data.transactions)) {
        const mapped: Transaction[] = res.data.data.transactions.map((tx: any) => ({
          id: tx.id,
          userId: tx.userId,
          accountId: tx.accountId,
          accountName: tx.account?.name || tx.accountName || undefined,
          categoryId: tx.categoryId,
          categoryName: tx.category?.name || tx.categoryName || undefined,
          categoryColor: tx.category?.color || tx.categoryColor || undefined,
          type: tx.type,
          amountMinor: Number(tx.amountMinor),
          currency: tx.currency || 'BDT',
          transactionDate: tx.transactionDate,
          description: tx.description,
          payee: tx.payee || undefined,
          paymentMethod: tx.paymentMethod || undefined,
          transferGroupId: tx.transferGroupId || null,
          transferDestinationAccountId: tx.transferDestinationAccountId || null,
          transferDestinationAccountName: tx.transferDestinationAccountName || undefined,
          notes: tx.notes || undefined,
          tags: Array.isArray(tx.tags) ? tx.tags : typeof tx.tags === 'string' ? JSON.parse(tx.tags || '[]') : [],
          createdAt: tx.createdAt || new Date().toISOString(),
          updatedAt: tx.updatedAt || new Date().toISOString(),
        }))
        setTransactions(mapped)
      } else {
        setTransactions([])
      }
    } catch {
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
    window.addEventListener(LEDGER_UPDATED_EVENT, fetchTransactions)
    return () => window.removeEventListener(LEDGER_UPDATED_EVENT, fetchTransactions)
  }, [fetchTransactions])

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
      const currentYearMonth = new Date().toISOString().slice(0, 7)
      if (filters.datePreset === 'this_month') {
        if (!tx.transactionDate.startsWith(currentYearMonth)) return false
      } else if (filters.datePreset === 'last_month') {
        const d = new Date()
        d.setMonth(d.getMonth() - 1)
        const lastYearMonth = d.toISOString().slice(0, 7)
        if (!tx.transactionDate.startsWith(lastYearMonth)) return false
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
    const tempId = `tx-${Date.now()}`
    const transaction: Transaction = {
      ...newTx,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions((prev) => [transaction, ...prev])

    // Asynchronously sync to backend
    apiClient.post('/transactions', {
      type: newTx.type,
      amountMinor: newTx.amountMinor,
      transactionDate: newTx.transactionDate,
      description: newTx.description,
      payee: newTx.payee,
      paymentMethod: newTx.paymentMethod,
      notes: newTx.notes,
      accountId: newTx.accountId,
      categoryId: newTx.categoryId,
      toAccountId: newTx.transferDestinationAccountId,
    }).then((res) => {
      if (res.data?.data?.transaction?.id) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: res.data.data.transaction.id } : t))
        )
      }
    }).catch(() => {
      // Local transaction retained
    })

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

    apiClient.patch(`/transactions/${id}`, updatedFields).catch(() => {})
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    let deletedItem: Transaction | null = null
    setTransactions((prev) => {
      deletedItem = prev.find((tx) => tx.id === id) || null
      return prev.filter((tx) => tx.id !== id)
    })

    apiClient.delete(`/transactions/${id}`).catch(() => {})

    return deletedItem
  }, [])

  const restoreTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev])
    apiClient.post('/transactions', {
      type: tx.type,
      amountMinor: tx.amountMinor,
      transactionDate: tx.transactionDate,
      description: tx.description,
      payee: tx.payee,
      paymentMethod: tx.paymentMethod,
      notes: tx.notes,
      accountId: tx.accountId,
      categoryId: tx.categoryId,
      toAccountId: tx.transferDestinationAccountId,
    }).catch(() => {})
  }, [])

  const bulkImportTransactions = useCallback((newItems: Transaction[]) => {
    setTransactions((prev) => [...newItems, ...prev])
    newItems.forEach((tx) => {
      apiClient.post('/transactions', {
        type: tx.type,
        amountMinor: tx.amountMinor,
        transactionDate: tx.transactionDate,
        description: tx.description,
        payee: tx.payee,
        paymentMethod: tx.paymentMethod,
        notes: tx.notes,
        accountId: tx.accountId,
        categoryId: tx.categoryId,
        toAccountId: tx.transferDestinationAccountId,
      }).catch(() => {})
    })
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
    isLoading,
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
    refreshTransactions: fetchTransactions,
  }
}

import { useState, useMemo, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type { Account, Category } from '@/types'

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    userId: 'usr-1',
    name: 'Cash Vault',
    type: 'cash',
    currency: 'BDT',
    openingBalanceMinor: 500000, // ৳5,000.00
    currentBalanceMinor: 842000, // ৳8,420.00
    isArchived: false,
  },
  {
    id: 'acc-2',
    userId: 'usr-1',
    name: 'Prime Bank Current',
    type: 'bank',
    currency: 'BDT',
    openingBalanceMinor: 10000000, // ৳100,000.00
    currentBalanceMinor: 12450000, // ৳124,500.00
    accountNumberMasked: '•••• 4892',
    isArchived: false,
  },
  {
    id: 'acc-3',
    userId: 'usr-1',
    name: 'bKash Primary MFS',
    type: 'mobile_wallet',
    currency: 'BDT',
    openingBalanceMinor: 250000, // ৳2,500.00
    currentBalanceMinor: 1685000, // ৳16,850.00
    accountNumberMasked: '017••••1234',
    isArchived: false,
  },
  {
    id: 'acc-4',
    userId: 'usr-1',
    name: 'Nagad Wallet',
    type: 'mobile_wallet',
    currency: 'BDT',
    openingBalanceMinor: 100000, // ৳1,000.00
    currentBalanceMinor: 430000, // ৳4,300.00
    accountNumberMasked: '018••••5678',
    isArchived: false,
  },
  {
    id: 'acc-5',
    userId: 'usr-1',
    name: 'Standard Chartered Titanium',
    type: 'card',
    currency: 'BDT',
    openingBalanceMinor: 0,
    currentBalanceMinor: -1280000, // -৳12,800.00 (credit balance)
    accountNumberMasked: '•••• 3108',
    isArchived: false,
  },
]

const INITIAL_CATEGORIES: Category[] = [
  // Expense Categories
  {
    id: 'cat-food',
    userId: null,
    name: 'Groceries & Dining',
    type: 'expense',
    color: '#059669',
    icon: 'Utensils',
    isArchived: false,
  },
  {
    id: 'cat-bills',
    userId: null,
    name: 'Utilities & Subscriptions',
    type: 'expense',
    color: '#d97706',
    icon: 'Zap',
    isArchived: false,
  },
  {
    id: 'cat-transport',
    userId: null,
    name: 'Transportation & Fuel',
    type: 'expense',
    color: '#2563eb',
    icon: 'Car',
    isArchived: false,
  },
  {
    id: 'cat-housing',
    userId: null,
    name: 'Housing & Rent',
    type: 'expense',
    color: '#161d26',
    icon: 'Home',
    isArchived: false,
  },
  {
    id: 'cat-health',
    userId: null,
    name: 'Health & Medical',
    type: 'expense',
    color: '#dc2626',
    icon: 'Activity',
    isArchived: false,
  },
  {
    id: 'cat-personal',
    userId: null,
    name: 'Personal Discretionary',
    type: 'expense',
    color: '#64748b',
    icon: 'ShoppingBag',
    isArchived: false,
  },
  {
    id: 'cat-education',
    userId: null,
    name: 'Education & Learning',
    type: 'expense',
    color: '#7c3aed',
    icon: 'BookOpen',
    isArchived: false,
  },
  // Income Categories
  {
    id: 'cat-salary',
    userId: null,
    name: 'Professional Retainer',
    type: 'income',
    color: '#059669',
    icon: 'Briefcase',
    isArchived: false,
  },
  {
    id: 'cat-consulting',
    userId: 'usr-1',
    name: 'Advisory Consultation',
    type: 'income',
    color: '#2563eb',
    icon: 'MessageSquare',
    isArchived: false,
  },
  {
    id: 'cat-invest',
    userId: null,
    name: 'Investment Dividends',
    type: 'income',
    color: '#d97706',
    icon: 'TrendingUp',
    isArchived: false,
  },
]

export function useAccountsAndCategories() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [activeTab, setActiveTab] = useState<'accounts' | 'categories'>('accounts')
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'expense' | 'income'>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch accounts and categories from backend
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [accRes, catRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: { accounts: any[] } }>('/accounts').catch(() => null),
        apiClient.get<{ success: boolean; data: { categories: any[] } }>('/categories').catch(() => null),
      ])

      if (accRes?.data?.data?.accounts && accRes.data.data.accounts.length > 0) {
        setAccounts(accRes.data.data.accounts.map((a: any) => ({
          id: a.id,
          userId: a.userId,
          name: a.name,
          type: a.type,
          currency: a.currency || 'BDT',
          openingBalanceMinor: Number(a.openingBalanceMinor),
          currentBalanceMinor: Number(a.currentBalanceMinor ?? a.openingBalanceMinor),
          accountNumberMasked: a.accountNumber ? `•••• ${a.accountNumber.slice(-4)}` : undefined,
          isArchived: Boolean(a.isArchived),
        })))
      }

      if (catRes?.data?.data?.categories && catRes.data.data.categories.length > 0) {
        setCategories(catRes.data.data.categories.map((c: any) => ({
          id: c.id,
          userId: c.userId,
          name: c.name,
          type: c.type,
          color: c.color,
          icon: c.icon,
          isArchived: Boolean(c.isArchived),
        })))
      }
    } catch {
      // Retain fallback defaults
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Total liquidity metrics
  const liquiditySummary = useMemo(() => {
    let totalLiquidityMinor = 0
    let bankLiquidityMinor = 0
    let mfsLiquidityMinor = 0
    let cashLiquidityMinor = 0
    let creditLiabilityMinor = 0

    accounts.forEach((acc) => {
      if (acc.isArchived) return
      totalLiquidityMinor += acc.currentBalanceMinor
      if (acc.type === 'bank') bankLiquidityMinor += acc.currentBalanceMinor
      if (acc.type === 'mobile_wallet') mfsLiquidityMinor += acc.currentBalanceMinor
      if (acc.type === 'cash') cashLiquidityMinor += acc.currentBalanceMinor
      if (acc.type === 'card' && acc.currentBalanceMinor < 0) {
        creditLiabilityMinor += Math.abs(acc.currentBalanceMinor)
      }
    })

    return {
      totalLiquidityMinor,
      bankLiquidityMinor,
      mfsLiquidityMinor,
      cashLiquidityMinor,
      creditLiabilityMinor,
      activeAccountCount: accounts.filter((a) => !a.isArchived).length,
    }
  }, [accounts])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (cat.isArchived) return false
      if (categoryTypeFilter !== 'all' && cat.type !== categoryTypeFilter) return false
      return true
    })
  }, [categories, categoryTypeFilter])

  // Account CRUD
  const createAccount = useCallback(
    (newAcc: Omit<Account, 'id' | 'currentBalanceMinor' | 'isArchived'>) => {
      const tempId = `acc-${Date.now()}`
      const account: Account = {
        ...newAcc,
        id: tempId,
        currentBalanceMinor: newAcc.openingBalanceMinor,
        isArchived: false,
      }
      setAccounts((prev) => [...prev, account])

      apiClient.post('/accounts', {
        name: newAcc.name,
        type: newAcc.type,
        currency: newAcc.currency,
        openingBalanceMinor: newAcc.openingBalanceMinor,
        accountNumber: newAcc.accountNumberMasked,
      }).then((res) => {
        if (res.data?.data?.account?.id) {
          setAccounts((prev) =>
            prev.map((a) => (a.id === tempId ? { ...a, id: res.data.data.account.id } : a))
          )
        }
      }).catch(() => {})

      return account
    },
    []
  )

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    )

    apiClient.patch(`/accounts/${id}`, updates).catch(() => {})
  }, [])

  const archiveAccount = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isArchived: true } : acc))
    )

    apiClient.patch(`/accounts/${id}`, { isArchived: true }).catch(() => {})
  }, [])

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id))
    apiClient.delete(`/accounts/${id}`).catch(() => {})
  }, [])

  // Execute an inter-account transfer
  const executeTransfer = useCallback(
    (sourceId: string, destId: string, amountMinor: number) => {
      if (sourceId === destId || amountMinor <= 0) return false

      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === sourceId) {
            return {
              ...acc,
              currentBalanceMinor: acc.currentBalanceMinor - amountMinor,
            }
          }
          if (acc.id === destId) {
            return {
              ...acc,
              currentBalanceMinor: acc.currentBalanceMinor + amountMinor,
            }
          }
          return acc
        })
      )

      apiClient.post('/transactions', {
        type: 'transfer',
        amountMinor,
        accountId: sourceId,
        toAccountId: destId,
        transactionDate: new Date().toISOString().slice(0, 10),
        description: 'Inter-vault transfer',
      }).catch(() => {})

      return true
    },
    []
  )

  // Category CRUD
  const createCategory = useCallback((newCat: Omit<Category, 'id' | 'isArchived'>) => {
    const tempId = `cat-${Date.now()}`
    const category: Category = {
      ...newCat,
      id: tempId,
      isArchived: false,
    }
    setCategories((prev) => [...prev, category])

    apiClient.post('/categories', {
      name: newCat.name,
      type: newCat.type,
      color: newCat.color,
      icon: newCat.icon,
    }).then((res) => {
      if (res.data?.data?.category?.id) {
        setCategories((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: res.data.data.category.id } : c))
        )
      }
    }).catch(() => {})

    return category
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    )

    apiClient.patch(`/categories/${id}`, updates).catch(() => {})
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    apiClient.delete(`/categories/${id}`).catch(() => {})
  }, [])

  return {
    accounts,
    categories,
    isLoading,
    filteredCategories,
    activeTab,
    setActiveTab,
    categoryTypeFilter,
    setCategoryTypeFilter,
    liquiditySummary,
    createAccount,
    updateAccount,
    archiveAccount,
    deleteAccount,
    executeTransfer,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshData: fetchData,
  }
}


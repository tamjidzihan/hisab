import { useState, useMemo, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type { Account, Category } from '@/types'

export function useAccountsAndCategories() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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

      if (accRes?.data?.data?.accounts && Array.isArray(accRes.data.data.accounts)) {
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
      } else {
        setAccounts([])
      }

      if (catRes?.data?.data?.categories && Array.isArray(catRes.data.data.categories)) {
        setCategories(catRes.data.data.categories.map((c: any) => ({
          id: c.id,
          userId: c.userId,
          name: c.name,
          type: c.type,
          color: c.color,
          icon: c.icon,
          isArchived: Boolean(c.isArchived),
        })))
      } else {
        setCategories([])
      }
    } catch {
      setAccounts([])
      setCategories([])
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

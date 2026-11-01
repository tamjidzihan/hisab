import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { apiClient } from '@/lib/api'
import { CURRENCY_SYMBOLS } from '@/lib/formatters'
import { notifyLedgerUpdated } from '@/lib/ledgerEvents'
import type { Account, Category, TransactionType } from '@/types'
import { TourProvider, useTourGuide } from '@/features/tour/TourContext'
import { FirstTimeWelcomeModal } from '@/features/tour/FirstTimeWelcomeModal'
import { InteractiveTourOverlay } from '@/features/tour/InteractiveTourOverlay'
import { SiteDirectoryModal } from '@/features/tour/SiteDirectoryModal'

const parseAmountMinor = (value: string): number | null => {
  const normalized = value.trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null

  const [whole, fraction = ''] = normalized.split('.')
  const amount = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  if (amount <= 0n || amount > BigInt(Number.MAX_SAFE_INTEGER)) return null
  return Number(amount)
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message
    if (typeof message === 'string') return message
  }
  return 'The transaction could not be saved. Please try again.'
}

const AppShellInner: React.FC = () => {
  const { openGuideModal } = useTourGuide()
  const queryClient = useQueryClient()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [optionsError, setOptionsError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [payee, setPayee] = useState('')
  const [transactionDate, setTransactionDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [accountId, setAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const activeAccounts = accounts.filter((account) => !account.isArchived)
  const activeCategories = categories.filter(
    (category) => !category.isArchived && category.type === type
  )
  const selectedAccount = activeAccounts.find((account) => account.id === accountId)
  const compatibleDestinationAccounts = activeAccounts.filter(
    (account) => account.id !== accountId && account.currency === selectedAccount?.currency
  )
  const closeQuickLog = () => {
    if (!isSubmitting) setQuickLogModalOpen(false)
  }

  useEffect(() => {
    if (!quickLogModalOpen) return

    let isCurrent = true
    setIsLoadingOptions(true)
    setOptionsError('')
    setFormError('')

    const loadOptions = async () => {
      try {
        const [accountsResponse, categoriesResponse] = await Promise.all([
          apiClient.get<{ success: boolean; data: { accounts: Account[] } }>('/accounts'),
          apiClient.get<{ success: boolean; data: { categories: Category[] } }>('/categories'),
        ])
        if (!isCurrent) return

        const loadedAccounts = accountsResponse.data.data.accounts.filter(
          (account) => !account.isArchived
        )
        const defaultAccount = loadedAccounts[0]
        setAccounts(loadedAccounts)
        setCategories(categoriesResponse.data.data.categories)
        setAccountId(defaultAccount?.id ?? '')
        setToAccountId(
          loadedAccounts.find(
            (account) =>
              account.id !== defaultAccount?.id &&
              account.currency === defaultAccount?.currency
          )?.id ?? ''
        )
        setType('expense')
        setAmount('')
        setDescription('')
        setPayee('')
        setTransactionDate(format(new Date(), 'yyyy-MM-dd'))
        setCategoryId('')
        setPaymentMethod('Cash')
        setNotes('')
      } catch (error) {
        console.error('Failed to load Quick Log accounts and categories.', error)
        if (isCurrent) setOptionsError(getErrorMessage(error))
      } finally {
        if (isCurrent) setIsLoadingOptions(false)
      }
    }

    void loadOptions()
    return () => {
      isCurrent = false
    }
  }, [quickLogModalOpen])

  const handleQuickLogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    setFormError('')

    const amountMinor = parseAmountMinor(amount)
    const destinationAccount = activeAccounts.find((account) => account.id === toAccountId)

    if (amountMinor === null) {
      setFormError('Enter an amount greater than zero with no more than two decimal places.')
      return
    }
    if (!transactionDate || !description.trim()) {
      setFormError('Enter a transaction date and description before posting.')
      return
    }
    if (!selectedAccount) {
      setFormError('Create or select an account before posting this transaction.')
      return
    }
    if (type === 'transfer' && (!destinationAccount || destinationAccount.id === selectedAccount.id)) {
      setFormError('Choose a destination account different from the source account.')
      return
    }
    if (
      type === 'transfer' &&
      destinationAccount &&
      destinationAccount.currency !== selectedAccount.currency
    ) {
      setFormError('Transfers are only available between accounts using the same currency.')
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.post('/transactions', {
        type,
        amountMinor,
        transactionDate,
        description: description.trim(),
        payee: payee.trim() || undefined,
        paymentMethod: type === 'transfer' ? 'Internal Transfer' : paymentMethod,
        notes: notes.trim() || undefined,
        accountId: selectedAccount.id,
        categoryId: type === 'transfer' ? undefined : categoryId || undefined,
        toAccountId: type === 'transfer' ? destinationAccount?.id : undefined,
      })

      notifyLedgerUpdated()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(
        type === 'transfer'
          ? `${CURRENCY_SYMBOLS[selectedAccount.currency] ?? selectedAccount.currency} ${amount} transferred from ${selectedAccount.name} to ${destinationAccount?.name}.`
          : `${type === 'income' ? 'Income' : 'Expense'} of ${CURRENCY_SYMBOLS[selectedAccount.currency] ?? selectedAccount.currency} ${amount} posted to ${selectedAccount.name}.`
      )
      setQuickLogModalOpen(false)
    } catch (error) {
      console.error('Failed to post Quick Log transaction.', error)
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#161d26] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenTourGuide={openGuideModal}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickLog={() => setQuickLogModalOpen(true)}
          onOpenTourGuide={openGuideModal}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Quick Log Transaction Modal */}
      <Modal
        isOpen={quickLogModalOpen}
        onClose={closeQuickLog}
        title="Quick Log Transaction"
        description="Post income, an expense, or a transfer to your ledger."
        maxWidth="lg"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeQuickLog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="quick-log-form"
              variant="primary"
              size="sm"
              disabled={
                isLoadingOptions ||
                Boolean(optionsError) ||
                activeAccounts.length === 0 ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Posting…' : 'Post to Ledger'}
            </Button>
          </>
        }
      >
        <form
          id="quick-log-form"
          onSubmit={handleQuickLogSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#161d26]">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['expense', 'Expense'],
                ['income', 'Income'],
                ['transfer', 'Transfer'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={type === value}
                  onClick={() => {
                    setType(value)
                    setCategoryId('')
                    setFormError('')
                  }}
                  className={`min-h-9 rounded-[4px] border px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] ${
                    type === value
                      ? value === 'expense'
                        ? 'border-[#dc2626] bg-white text-[#dc2626]'
                        : value === 'income'
                          ? 'border-[#059669] bg-white text-[#059669]'
                          : 'border-[#2563eb] bg-white text-[#2563eb]'
                      : 'border-[#d2d9e4] bg-[#f8fafc] text-[#64748b] hover:bg-white hover:text-[#161d26]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label={type === 'transfer' ? 'Source Account / Vault' : 'Account / Vault'}
              value={accountId}
              onChange={(event) => {
                const nextAccount = activeAccounts.find(
                  (account) => account.id === event.target.value
                )
                setAccountId(event.target.value)
                const currentDestination = activeAccounts.find(
                  (account) => account.id === toAccountId
                )
                if (
                  currentDestination?.id === nextAccount?.id ||
                  currentDestination?.currency !== nextAccount?.currency
                ) {
                  setToAccountId(
                    activeAccounts.find(
                      (account) =>
                        account.id !== nextAccount?.id &&
                        account.currency === nextAccount?.currency
                    )?.id ?? ''
                  )
                }
              }}
              disabled={isLoadingOptions || activeAccounts.length === 0}
              options={
                activeAccounts.length
                  ? activeAccounts.map((account) => ({ value: account.id, label: account.name }))
                  : [
                      {
                        value: '',
                        label: isLoadingOptions ? 'Loading accounts…' : 'No accounts available',
                      },
                    ]
              }
            />
            <Input
              label={`Amount (${selectedAccount?.currency ?? 'BDT'})`}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              prefixElement={
                <span className="font-mono">
                  {CURRENCY_SYMBOLS[selectedAccount?.currency ?? 'BDT'] ??
                    selectedAccount?.currency ??
                    '৳'}
                </span>
              }
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          {type === 'transfer' ? (
            <Select
              label="Destination Account / Vault"
              value={toAccountId}
              onChange={(event) => setToAccountId(event.target.value)}
              disabled={isLoadingOptions || compatibleDestinationAccounts.length === 0}
              helperText={
                activeAccounts.length < 2
                  ? 'A transfer requires at least two active accounts.'
                  : compatibleDestinationAccounts.length === 0
                    ? `No other active account uses ${selectedAccount?.currency ?? 'this currency'}.`
                  : undefined
              }
              options={[
                { value: '', label: 'Select destination account', disabled: true },
                ...activeAccounts
                  .filter((account) => account.id !== accountId)
                  .map((account) => ({
                    value: account.id,
                    label: `${account.name} (${account.currency})`,
                    disabled: account.currency !== selectedAccount?.currency,
                  })),
              ]}
            />
          ) : (
            <Select
              label="Category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={isLoadingOptions}
              options={[
                { value: '', label: 'No category' },
                ...activeCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Description"
              placeholder="e.g. Groceries, monthly salary"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
            <Input
              label="Transaction Date"
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              required
            />
          </div>

          {type !== 'transfer' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Payee / Merchant (optional)"
                placeholder="Person or business"
                value={payee}
                onChange={(event) => setPayee(event.target.value)}
              />
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                options={[
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Bank Transfer', label: 'Bank transfer' },
                  { value: 'Debit Card', label: 'Debit card' },
                  { value: 'Credit Card', label: 'Credit card' },
                  { value: 'bKash MFS', label: 'bKash' },
                  { value: 'Nagad MFS', label: 'Nagad' },
                ]}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quick-log-notes"
              className="text-xs font-semibold uppercase tracking-wider text-[#161d26]"
            >
              Notes (optional)
            </label>
            <textarea
              id="quick-log-notes"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional details for your records"
              className="w-full resize-y rounded-[4px] border border-[#d2d9e4] bg-white px-3 py-2 text-sm text-[#161d26] placeholder:text-[#64748b] focus:border-[#161d26] focus:outline-none focus:ring-1 focus:ring-[#161d26]"
            />
          </div>

          {optionsError && (
            <p className="text-sm text-[#dc2626]" role="alert">
              {optionsError} Close this form and try again.
            </p>
          )}
          {!isLoadingOptions && !optionsError && activeAccounts.length === 0 && (
            <p className="text-sm text-[#64748b]" role="status">
              Create an account in Accounts &amp; Vaults before logging a transaction.
            </p>
          )}
          {formError && (
            <p className="text-sm text-[#dc2626]" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>

      {/* Tour Guide Components */}
      <FirstTimeWelcomeModal />
      <InteractiveTourOverlay />
      <SiteDirectoryModal />
    </div>
  )
}

export const AppShell: React.FC = () => {
  return (
    <TourProvider>
      <AppShellInner />
    </TourProvider>
  )
}

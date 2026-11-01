import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { Select } from '@/components/common/Select'
import { apiClient } from '@/lib/api'
import { CURRENCY_SYMBOLS } from '@/lib/formatters'
import { notifyLedgerUpdated } from '@/lib/ledgerEvents'
import type { Account, Category, TransactionType } from '@/types'

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

export const QuickLogTransaction: React.FC = () => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
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

  const closeModal = () => {
    if (!isSubmitting) setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
    if (
      type === 'transfer' &&
      (!destinationAccount || destinationAccount.id === selectedAccount.id)
    ) {
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
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to post Quick Log transaction.', error)
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        data-tour-target="quick-log"
        size="sm"
        variant="primary"
        onClick={() => setIsOpen(true)}
        leftIcon={<Plus className="w-3.5 h-3.5" />}
        className="text-xs font-semibold"
      >
        <span className="hidden sm:inline">Quick Log</span>
        <span className="sm:hidden">Log</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Quick Log New Transaction"
        description="Records are permanently posted in integer minor units (paisa)."
        tourTarget="quick-log-modal"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeModal}
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
        <form id="quick-log-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#161d26] block mb-1.5">
              Classification
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#f4f6f9] border border-[#d2d9e4] rounded-[4px]">
              {([
                ['expense', 'Outflow (Expense)'],
                ['income', 'Inflow (Income)'],
                ['transfer', 'Transfer (Linked)'],
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
                  className={`py-1.5 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] ${type === value
                    ? value === 'expense'
                      ? 'bg-white text-[#dc2626] shadow-2xs border border-[#d2d9e4]'
                      : value === 'income'
                        ? 'bg-white text-[#059669] shadow-2xs border border-[#d2d9e4]'
                        : 'bg-white text-[#2563eb] shadow-2xs border border-[#d2d9e4]'
                    : 'text-[#64748b] hover:text-[#161d26]'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <Input
              label="Transaction Date"
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Description / Purpose"
              placeholder="e.g. Monthly Broadband, Groceries, Client Retainer"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
            {type !== 'transfer' && (
              <Input
                label="Payee / Merchant / Entity"
                placeholder="e.g. Shwapno, Carnival, TechCorp"
                value={payee}
                onChange={(event) => setPayee(event.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label={type === 'transfer' ? 'Source Vault' : 'Account Vault'}
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
            {type === 'transfer' ? (
              <Select
                label="Destination Vault"
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
          </div>

          {type !== 'transfer' && (
            <Select
              label="Payment Instrument / Method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              options={[
                { value: 'Bank Transfer', label: 'Bank Transfer / BEFTN / NPSB' },
                { value: 'bKash MFS', label: 'bKash Mobile Financial Service' },
                { value: 'Nagad MFS', label: 'Nagad Mobile Financial Service' },
                { value: 'Debit Card', label: 'Debit Card' },
                { value: 'Credit Card', label: 'Credit Card' },
                { value: 'Cash', label: 'Cash Currency' },
              ]}
            />
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quick-log-notes"
              className="text-xs font-semibold uppercase tracking-wider text-[#161d26]"
            >
              Auditing Notes / Reference (Optional)
            </label>
            <textarea
              id="quick-log-notes"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional context, receipt number, or tax deduction notes..."
              className="w-full px-3 py-2 bg-white text-[#161d26] text-xs rounded-[4px] border border-[#d2d9e4] focus:outline-none focus:border-[#161d26] focus:ring-1 focus:ring-[#161d26] transition-colors resize-none"
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
    </>
  )
}

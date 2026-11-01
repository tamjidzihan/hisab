import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { AccountCard } from './components/AccountCard'
import { AccountModal } from './components/AccountModal'
import { TransferModal } from './components/TransferModal'
import { CategoryCard } from './components/CategoryCard'
import { CategoryModal } from './components/CategoryModal'
import { useAccountsAndCategories } from './useAccountsAndCategories'
import { formatCurrency } from '@/lib/formatters'
import {
  Landmark,
  Plus,
  ArrowRightLeft,
  Building,
  Smartphone,
  Wallet,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import type { Account, Category } from '@/types'

export const AccountsPage: React.FC = () => {
  const {
    accounts,
    filteredCategories,
    activeTab,
    setActiveTab,
    categoryTypeFilter,
    setCategoryTypeFilter,
    liquiditySummary,
    createAccount,
    updateAccount,
    archiveAccount,
    executeTransfer,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAccountsAndCategories()

  // Modal Dialog States
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [transferSourceAccount, setTransferSourceAccount] = useState<Account | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Account Handlers
  const handleOpenCreateAccount = () => {
    setEditingAccount(null)
    setAccountModalOpen(true)
  }

  const handleOpenEditAccount = (acc: Account) => {
    setEditingAccount(acc)
    setAccountModalOpen(true)
  }

  const handleSaveAccount = (
    data: Omit<Account, 'id' | 'currentBalanceMinor' | 'isArchived'>
  ) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, data)
      toast.success(`Account vault "${data.name}" updated.`)
    } else {
      createAccount(data)
      toast.success(`Established new vault "${data.name}".`)
    }
  }

  const handleInitiateTransfer = (sourceAcc?: Account) => {
    setTransferSourceAccount(sourceAcc || null)
    setTransferModalOpen(true)
  }

  const handleExecuteTransfer = (sourceId: string, destId: string, amountMinor: number) => {
    const success = executeTransfer(sourceId, destId, amountMinor)
    if (success) {
      const source = accounts.find((a) => a.id === sourceId)
      const dest = accounts.find((a) => a.id === destId)
      toast.success(
        `Transferred ${formatCurrency(amountMinor)} from ${source?.name} to ${dest?.name}.`
      )
    } else {
      toast.error('Unable to execute transfer. Please verify account balances.')
    }
  }

  const handleArchiveAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id)
    archiveAccount(id)
    toast(`Archived account "${acc?.name}".`)
  }

  // Category Handlers
  const handleOpenCreateCategory = () => {
    setEditingCategory(null)
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setCategoryModalOpen(true)
  }

  const handleSaveCategory = async (data: Omit<Category, 'id' | 'isArchived'>) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data)
      toast.success(`Category "${data.name}" updated.`)
    } else {
      await createCategory(data)
      toast.success(`Category "${data.name}" added to classifications.`)
    }
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id)
    toast('Category removed.')
  }

  const activeAccounts = accounts.filter((a) => !a.isArchived)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            Accounts & Classification Categories
          </h1>
          <p className="text-xs text-[#64748b]">
            Financial vault liquidity management, opening baselines, and taxonomy.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'accounts' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInitiateTransfer()}
                leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                className="text-xs h-9"
              >
                Transfer Funds
              </Button>
              <Button
                data-tour-target="accounts-create"
                variant="primary"
                size="sm"
                onClick={handleOpenCreateAccount}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs h-9 font-semibold"
              >
                Establish Vault
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateCategory}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs h-9 font-semibold"
            >
              Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Top Liquidity Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Liquidity */}
        <Card className="border-l-[3px] border-l-[#161d26]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
            <span className="uppercase text-[10px] tracking-wider font-semibold">
              Total Net Liquidity
            </span>
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
            {formatCurrency(liquiditySummary.totalLiquidityMinor)}
          </div>
          <p className="text-[10px] text-[#64748b] font-mono mt-1">
            Across {liquiditySummary.activeAccountCount} active vaults
          </p>
        </Card>

        {/* Bank Reserves */}
        <Card className="border-l-[3px] border-l-[#2563eb]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
            <span className="uppercase text-[10px] tracking-wider font-semibold">
              Bank Reserves
            </span>
            <Building className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
            {formatCurrency(liquiditySummary.bankLiquidityMinor)}
          </div>
          <p className="text-[10px] text-[#64748b] font-mono mt-1">
            Commercial banking institutions
          </p>
        </Card>

        {/* Mobile Financial Services */}
        <Card className="border-l-[3px] border-l-[#d97706]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
            <span className="uppercase text-[10px] tracking-wider font-semibold">
              MFS Balances
            </span>
            <Smartphone className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
            {formatCurrency(liquiditySummary.mfsLiquidityMinor)}
          </div>
          <p className="text-[10px] text-[#64748b] font-mono mt-1">
            bKash and Nagad mobile wallets
          </p>
        </Card>

        {/* Physical Cash on Hand */}
        <Card className="border-l-[3px] border-l-[#059669]">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-mono mb-1">
            <span className="uppercase text-[10px] tracking-wider font-semibold">
              Cash Currency
            </span>
            <Wallet className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#161d26] tabular-nums tracking-tight">
            {formatCurrency(liquiditySummary.cashLiquidityMinor)}
          </div>
          <p className="text-[10px] text-[#64748b] font-mono mt-1">
            Physical cash on hand
          </p>
        </Card>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d2d9e4]">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'accounts'
              ? 'border-[#161d26] text-[#161d26]'
              : 'border-transparent text-[#64748b] hover:text-[#161d26]'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Account Vaults ({activeAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-[#161d26] text-[#161d26]'
              : 'border-transparent text-[#64748b] hover:text-[#161d26]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Classification Categories ({filteredCategories.length})</span>
        </button>
      </div>

      {/* TAB 1: Account Vaults Grid */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleOpenEditAccount}
                onTransfer={handleInitiateTransfer}
                onArchive={handleArchiveAccount}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Categories Management Grid */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={categoryTypeFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setCategoryTypeFilter('all')}
              className="text-xs h-7 px-3"
            >
              All Categories
            </Button>
            <Button
              size="sm"
              variant={categoryTypeFilter === 'expense' ? 'primary' : 'outline'}
              onClick={() => setCategoryTypeFilter('expense')}
              className="text-xs h-7 px-3"
            >
              Outflow (Expense)
            </Button>
            <Button
              size="sm"
              variant={categoryTypeFilter === 'income' ? 'primary' : 'outline'}
              onClick={() => setCategoryTypeFilter('income')}
              className="text-xs h-7 px-3"
            >
              Inflow (Income)
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onEdit={handleOpenEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onSave={handleSaveAccount}
        initialAccount={editingAccount}
      />

      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleExecuteTransfer}
        accounts={accounts}
        defaultSourceAccount={transferSourceAccount}
      />

      <CategoryModal
        key={categoryModalOpen ? editingCategory?.id ?? 'new' : 'closed'}
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
      />
    </div>
  )
}

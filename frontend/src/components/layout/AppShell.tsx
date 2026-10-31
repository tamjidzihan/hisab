import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { TourProvider, useTourGuide } from '@/features/tour/TourContext'
import { FirstTimeWelcomeModal } from '@/features/tour/FirstTimeWelcomeModal'
import { InteractiveTourOverlay } from '@/features/tour/InteractiveTourOverlay'
import { SiteDirectoryModal } from '@/features/tour/SiteDirectoryModal'

const AppShellInner: React.FC = () => {
  const { openGuideModal } = useTourGuide()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false)

  // Quick Log form state
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }

    toast.success(`Logged ${type}: ৳${amount} for ${description || 'Uncategorized'}`)
    setQuickLogModalOpen(false)
    setAmount('')
    setDescription('')
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
        onClose={() => setQuickLogModalOpen(false)}
        title="Quick Log Transaction"
        description="Rapid ledger entry adhering to integer minor unit accounting."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickLogModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleQuickLogSubmit}
            >
              Post to Ledger
            </Button>
          </>
        }
      >
        <form onSubmit={handleQuickLogSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Transaction Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'expense', label: 'Expense (Outflow)' },
                { value: 'income', label: 'Income (Inflow)' },
                { value: 'transfer', label: 'Transfer (Linked)' },
              ]}
            />
            <Input
              label="Amount (BDT)"
              type="number"
              step="0.01"
              placeholder="0.00"
              prefixElement={<span className="font-mono">৳</span>}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Payee / Description"
            placeholder="e.g. Grocery, Electricity bill, Freelance"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Account Vault"
              options={[
                { value: 'cash', label: 'Cash Wallet' },
                { value: 'bank', label: 'Bank Account' },
                { value: 'bkash', label: 'bKash MFS' },
                { value: 'nagad', label: 'Nagad MFS' },
              ]}
            />
            <Select
              label="Category"
              options={[
                { value: 'food', label: 'Food & Dining' },
                { value: 'bills', label: 'Utilities & Bills' },
                { value: 'transport', label: 'Transportation' },
                { value: 'salary', label: 'Salary / Income' },
                { value: 'general', label: 'General / Other' },
              ]}
            />
          </div>
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

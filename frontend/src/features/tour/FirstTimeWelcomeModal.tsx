import React from 'react'
import { Compass, SlidersHorizontal, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { useTourGuide } from './TourContext'

export const FirstTimeWelcomeModal: React.FC = () => {
  const { isWelcomeOpen, closeWelcomeModal, startTour } = useTourGuide()

  return (
    <Modal
      isOpen={isWelcomeOpen}
      onClose={closeWelcomeModal}
      title="Welcome to Hisab"
      description="Architectural personal finance tracking with draftsman-level precision."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={closeWelcomeModal} className="text-xs text-[#64748b]">
            Explore on My Own
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={startTour}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            Start Guided Tour (2 min)
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Architectural Emblem Banner */}
        <div className="p-4 bg-[#f8fafc] border border-[#d2d9e4] rounded-[4px] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[4px] bg-[#161d26] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Compass className="w-6 h-6 text-[#f59e0b]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#161d26] font-mono uppercase tracking-wider">
              The Draftsman&apos;s Ledger
            </h4>
            <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
              Hisab replaces noisy, gamified finance feeds with a quiet, disciplined financial instrument designed around mathematical integrity and integer minor units (paisa).
            </p>
          </div>
        </div>

        {/* 3 Pillars of Hisab */}
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-2.5 rounded-[4px] border border-[#e5eaf0] bg-white">
            <div className="w-7 h-7 rounded-[3px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#161d26] block">
                1. Rapid Daily Logging
              </span>
              <span className="text-[11px] text-[#64748b] leading-tight block">
                Post outflows and inflows in seconds. Transfers between your own vaults are strictly isolated so income and expenses are never skewed.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-[4px] border border-[#e5eaf0] bg-white">
            <div className="w-7 h-7 rounded-[3px] bg-[#fffbeb] text-[#d97706] flex items-center justify-center shrink-0 mt-0.5">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#161d26] block">
                2. Dimension Calipers & Ceilings
              </span>
              <span className="text-[11px] text-[#64748b] leading-tight block">
                Visual budget bars feature physical notches: an 80% amber warning notch and 100% hard limit to safeguard monthly savings.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-[4px] border border-[#e5eaf0] bg-white">
            <div className="w-7 h-7 rounded-[3px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#161d26] block">
                3. Total Data Sovereignty
              </span>
              <span className="text-[11px] text-[#64748b] leading-tight block">
                Zero third-party trackers. Instant offline CSV and full JSON disaster recovery archives ensure you own your financial ledger.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  BookOpen,
  MapPin,
  ExternalLink,
  Compass,
  CheckCircle2,
  X,
} from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { HOW_TO_TOPICS } from './tourSteps'
import { useTourGuide } from './TourContext'

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'daily', label: 'Daily Logging' },
  { id: 'accounts', label: 'Accounts & Vaults' },
  { id: 'budgets', label: 'Budgets & Calipers' },
  { id: 'transactions', label: 'Transactions & CSV' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'goals', label: 'Savings Goals' },
  { id: 'settings', label: 'Settings & Vault' },
]

export const SiteDirectoryModal: React.FC = () => {
  const { isGuideModalOpen, closeGuideModal, restartTour } = useTourGuide()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTopics = useMemo(() => {
    return HOW_TO_TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'all' || topic.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        topic.question.toLowerCase().includes(query) ||
        topic.whereToFind.toLowerCase().includes(query) ||
        topic.steps.some((s) => s.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  return (
    <Modal
      isOpen={isGuideModalOpen}
      onClose={closeGuideModal}
      title="Hisab Guide & System Directory"
      description="Quick operational reference: How to log, where features live, and financial invariants."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={restartTour}
            leftIcon={<Compass className="w-3.5 h-3.5 text-[#d97706]" />}
            className="text-xs"
          >
            Start Interactive Walkthrough
          </Button>

          <Button variant="primary" size="sm" onClick={closeGuideModal} className="text-xs">
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search guides (e.g. transfer, CSV, budget, currency, goal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs bg-white border border-[#d2d9e4] rounded-[4px] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#161d26] focus:ring-1 focus:ring-[#161d26] font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#161d26] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-[3px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#161d26] text-white border-[#161d26] font-semibold'
                  : 'bg-[#f8fafc] text-[#64748b] border-[#d2d9e4] hover:text-[#161d26]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Topics List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748b] border border-dashed border-[#d2d9e4] rounded-[4px]">
              <p>No how-to topics match &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-2 font-mono font-semibold text-[#161d26] hover:underline cursor-pointer"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 bg-[#fafbfd] border border-[#d2d9e4] rounded-[4px] space-y-2.5 hover:border-[#cbd5e1] transition-colors"
              >
                {/* Topic Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[#161d26] shrink-0 mt-0.5" />
                    <h4 className="text-xs font-bold text-[#161d26]">
                      {topic.question}
                    </h4>
                  </div>

                  <Link
                    to={topic.route}
                    onClick={closeGuideModal}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#059669] hover:underline shrink-0 font-semibold"
                  >
                    <span>Open Surface</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Where to Find It */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono bg-white p-1.5 rounded-[3px] border border-[#e5eaf0] text-[#64748b]">
                  <MapPin className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                  <span className="font-semibold text-[#161d26]">Location:</span>
                  <span className="truncate">{topic.whereToFind}</span>
                </div>

                {/* Step Instructions */}
                <div className="pl-6 space-y-1">
                  {topic.steps.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                      <span className="font-mono text-[10px] text-[#64748b] font-bold shrink-0 mt-0.5">
                        {idx + 1}.
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </div>
                  ))}
                </div>

                {/* Note / Invariant */}
                {topic.note && (
                  <div className="flex items-start gap-1.5 text-[11px] p-2 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[3px] text-[#065f46]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span>{topic.note}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

import React from 'react'
import {
  Plus,
  LayoutDashboard,
  Landmark,
  SlidersHorizontal,
  Receipt,
  BarChart3,
  Target,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  MapPin,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { TOUR_STEPS } from './tourSteps'
import { useTourGuide } from './TourContext'

const ICON_MAP = {
  Plus,
  LayoutDashboard,
  Landmark,
  SlidersHorizontal,
  Receipt,
  BarChart3,
  Target,
  Settings,
}

export const InteractiveTourOverlay: React.FC = () => {
  const { isTourActive, currentStepIndex, nextStep, prevStep, skipTour } = useTourGuide()

  if (!isTourActive) return null

  const step = TOUR_STEPS[currentStepIndex]
  const IconComponent = ICON_MAP[step.iconName] || Compass
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1
  const progressPercent = ((currentStepIndex + 1) / TOUR_STEPS.length) * 100

  return (
    <div
      role="region"
      aria-label="Interactive Tour Guide"
      className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-3 sm:p-6"
    >
      {/* Dimmed backdrop with clicking to avoid trapping */}
      <div
        className="absolute inset-0 bg-[#161d26]/30 backdrop-blur-[1px] pointer-events-auto"
        onClick={skipTour}
        aria-hidden="true"
      />

      {/* Floating Tour Guide Card */}
      <div className="relative pointer-events-auto w-full max-w-lg bg-white border-2 border-[#161d26] rounded-[6px] shadow-[0_16px_36px_rgba(22,29,38,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top 3px Precision Drafting Caliper Line */}
        <div className="h-1 bg-[#e2e8f0] relative w-full overflow-hidden">
          <div
            className="h-full bg-[#161d26] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header with Step Tracker */}
        <div className="px-5 py-3 border-b border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-[3px] bg-[#161d26] text-white flex items-center justify-center">
              <IconComponent className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161d26]">
              Walkthrough Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#64748b]">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-[2px] transition-colors ${
                  idx === currentStepIndex
                    ? 'bg-[#161d26]'
                    : idx < currentStepIndex
                    ? 'bg-[#059669]'
                    : 'bg-[#d2d9e4]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Step Title & Subtitle */}
          <div>
            <h3 className="text-base font-bold text-[#161d26] tracking-tight">
              {step.title}
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">{step.subtitle}</p>
          </div>

          {/* Where to Find It */}
          <div className="p-2.5 bg-[#f8fafc] border border-[#d2d9e4] rounded-[4px] flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748b] block font-semibold">
                Where to find it
              </span>
              <span className="font-semibold text-[#161d26] font-mono text-[11px]">
                {step.location}
              </span>
            </div>
          </div>

          {/* How to Use It */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748b] font-semibold block">
              How to use it
            </span>
            <ul className="space-y-1.5 text-xs text-[#334155]">
              {step.howTo.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#f1f5f9] text-[#161d26] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Architect's Financial Invariant */}
          <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-[4px] flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#92400e] block tracking-wider">
                Architect&apos;s Rule
              </span>
              <p className="text-[#78350f] text-[11px] leading-relaxed mt-0.5">
                {step.architectRule}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer with Navigation Controls */}
        <div className="px-5 py-3.5 border-t border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="text-xs text-[#64748b] hover:text-[#161d26]"
          >
            Skip Tour
          </Button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Previous
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={nextStep}
              rightIcon={
                isLastStep ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />
              }
              className="text-xs font-semibold px-4"
            >
              {isLastStep ? 'Complete Walkthrough' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


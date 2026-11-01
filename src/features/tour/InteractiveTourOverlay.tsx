import React, { useEffect, useState } from 'react'
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
  const step = TOUR_STEPS[currentStepIndex]
  const [spotlight, setSpotlight] = useState<{
    target: string
    rect: DOMRect
    isQuickLogModal: boolean
  } | null>(null)
  const targetRect = spotlight?.target === step.target ? spotlight.rect : null
  const isQuickLogModalSpotlight = spotlight?.isQuickLogModal === true

  useEffect(() => {
    if (!isTourActive) return

    let intervalId: number | undefined
    let resizeObserver: ResizeObserver | undefined
    let target: HTMLElement | null = null

    const updateTargetRect = () => {
      const quickLogModal =
        step.target === 'quick-log'
          ? document.querySelector<HTMLElement>('[data-tour-target="quick-log-modal"]')
          : null
      const nextTarget =
        quickLogModal ??
        document.querySelector<HTMLElement>(`[data-tour-target="${step.target}"]`)

      if (nextTarget !== target) {
        target = nextTarget
        resizeObserver?.disconnect()
        if (!target) {
          setSpotlight(null)
          return
        }

        if (!quickLogModal) {
          target.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
        resizeObserver = new ResizeObserver(updateTargetRect)
        resizeObserver.observe(target)
      }

      if (!target) return

      setSpotlight({
        target: step.target,
        rect: target.getBoundingClientRect(),
        isQuickLogModal: target === quickLogModal,
      })

      if (!quickLogModal && intervalId) {
        window.clearInterval(intervalId)
        intervalId = undefined
      }
    }

    const mutationObserver = new MutationObserver(updateTargetRect)
    intervalId = window.setInterval(updateTargetRect, 100)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', updateTargetRect)
    window.addEventListener('scroll', updateTargetRect, true)

    return () => {
      if (intervalId) window.clearInterval(intervalId)
      resizeObserver?.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', updateTargetRect)
      window.removeEventListener('scroll', updateTargetRect, true)
    }
  }, [isTourActive, step.target])

  if (!isTourActive) return null

  const IconComponent = ICON_MAP[step.iconName] || Compass
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1
  const progressPercent = ((currentStepIndex + 1) / TOUR_STEPS.length) * 100

  return (
    <div
      role="region"
      aria-label={`Guided tour: step ${currentStepIndex + 1} of ${TOUR_STEPS.length}`}
      aria-live="polite"
      className="fixed inset-0 z-[60] pointer-events-none"
    >
      {targetRect ? (
        <div
          aria-hidden="true"
          className="fixed z-[61] rounded-[6px] border-2 border-[#d97706] shadow-[0_0_0_9999px_rgba(22,29,38,0.48),0_0_0_5px_rgba(217,119,6,0.22)] transition-[top,left,width,height] duration-200 ease-out"
          style={{
            top: Math.max(4, targetRect.top - 6),
            left: Math.max(4, targetRect.left - 6),
            width: Math.min(window.innerWidth - 8, targetRect.width + 12),
            height: Math.min(window.innerHeight - 8, targetRect.height + 12),
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div className="fixed inset-0 z-[61] bg-[#161d26]/40" aria-hidden="true" />
      )}

      <div
        hidden={isQuickLogModalSpotlight}
        className="fixed z-[62] bottom-3 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[min(28rem,calc(100vw-3rem))] pointer-events-auto bg-white border border-[#161d26] rounded-[6px] shadow-[0_16px_36px_rgba(22,29,38,0.22)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
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
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
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
        <div className="p-4 sm:p-5 space-y-3 max-h-[68vh] overflow-y-auto">
          {/* Step Title & Subtitle */}
          <div>
            <h3 className="text-base font-bold text-[#161d26] tracking-tight">
              {step.title}
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">{step.subtitle}</p>
          </div>

          <div className="p-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-[4px] flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#78350f] block font-semibold">
                Look for the highlighted area
              </span>
              <span className="font-semibold text-[#161d26] text-[11px]">{step.location}</span>
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

          {/* Key product rule */}
          <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-[4px] flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#78350f] block tracking-wider">
                Good to know
              </span>
              <p className="text-[#713f12] text-[11px] leading-relaxed mt-0.5">
                {step.architectRule}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer with Navigation Controls */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#e5eaf0] bg-[#fafbfd] flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="text-xs text-[#64748b] hover:text-[#161d26]"
          >
            Exit tour
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
                Back
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
              {isLastStep ? 'Finish tour' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

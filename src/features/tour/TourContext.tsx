import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { TOUR_STEPS } from './tourSteps'
import type { TourContextValue } from './types'

const TOUR_STORAGE_KEY = 'hisab_tour_has_seen'

const TourContext = createContext<TourContextValue | undefined>(undefined)

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)

  // Check if first-time user on mount
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(TOUR_STORAGE_KEY)
      if (!hasSeen) {
        // Delay slightly for smooth page entrance
        const timer = setTimeout(() => {
          setIsWelcomeOpen(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const startTour = useCallback(() => {
    setIsWelcomeOpen(false)
    setIsGuideModalOpen(false)
    setCurrentStepIndex(0)
    setIsTourActive(true)
    navigate(TOUR_STEPS[0].route)
  }, [navigate])

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const nextIndex = prev + 1
      if (nextIndex < TOUR_STEPS.length) {
        navigate(TOUR_STEPS[nextIndex].route)
        return nextIndex
      } else {
        // Completed all steps
        setIsTourActive(false)
        try {
          localStorage.setItem(TOUR_STORAGE_KEY, 'true')
        } catch {}
        toast.success("Tour Completed: You're ready to master your personal finance ledger!")
        return prev
      }
    })
  }, [navigate])

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0)
      navigate(TOUR_STEPS[prevIndex].route)
      return prevIndex
    })
  }, [navigate])

  const skipTour = useCallback(() => {
    setIsTourActive(false)
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    } catch {}
    toast.info('Tour skipped. Reopen anytime from the top bar or sidebar guide.')
  }, [])

  const openGuideModal = useCallback(() => {
    setIsGuideModalOpen(true)
  }, [])

  const closeGuideModal = useCallback(() => {
    setIsGuideModalOpen(false)
  }, [])

  const openWelcomeModal = useCallback(() => {
    setIsWelcomeOpen(true)
  }, [])

  const closeWelcomeModal = useCallback(() => {
    setIsWelcomeOpen(false)
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    } catch {}
  }, [])

  const restartTour = useCallback(() => {
    setIsGuideModalOpen(false)
    setIsWelcomeOpen(false)
    setCurrentStepIndex(0)
    setIsTourActive(true)
    navigate(TOUR_STEPS[0].route)
  }, [navigate])

  const value: TourContextValue = {
    isWelcomeOpen,
    isTourActive,
    currentStepIndex,
    isGuideModalOpen,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    openGuideModal,
    closeGuideModal,
    openWelcomeModal,
    closeWelcomeModal,
    restartTour,
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

export function useTourGuide(): TourContextValue {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTourGuide must be used within a TourProvider')
  }
  return context
}


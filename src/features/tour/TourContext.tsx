import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/features/auth/AuthContext'
import { TOUR_STEPS } from './tourSteps'
import type { TourContextValue } from './types'

const USER_TOUR_STORAGE_KEY = 'hisab_tour_has_seen:'

const TourContext = createContext<TourContextValue | undefined>(undefined)

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)
  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    let isCurrent = true
    let welcomeTimer: ReturnType<typeof setTimeout> | undefined
    const storageKey = `${USER_TOUR_STORAGE_KEY}${userId}`
    setIsWelcomeOpen(false)

    const loadTourProgress = async () => {
      let hasSeenLocally = false
      try {
        hasSeenLocally = localStorage.getItem(storageKey) === 'true'
      } catch (error) {
        console.error('Failed to read local tour progress.', error)
      }

      try {
        const response = await apiClient.get<{ success: boolean; data: { completed: boolean } }>('/settings/tour')
        let completed = response.data.data.completed

        if (!completed && hasSeenLocally) {
          await apiClient.patch('/settings/tour', { completed: true })
          completed = true
        }

        if (!isCurrent) return

        if (completed) {
          try {
            localStorage.setItem(storageKey, 'true')
          } catch (error) {
            console.error('Failed to cache tour progress locally.', error)
          }
        } else {
          welcomeTimer = setTimeout(() => setIsWelcomeOpen(true), 800)
        }
      } catch (error) {
        console.error('Failed to load or migrate tour progress.', error)
        toast.error('Could not sync your tour progress. Please try again later.')
        if (!isCurrent) return
        setIsWelcomeOpen(!hasSeenLocally)
      }
    }

    void loadTourProgress()
    return () => {
      isCurrent = false
      if (welcomeTimer) clearTimeout(welcomeTimer)
    }
  }, [userId])

  const saveTourProgress = useCallback(async () => {
    if (!userId) return

    try {
      await apiClient.patch('/settings/tour', { completed: true })
      try {
        localStorage.setItem(`${USER_TOUR_STORAGE_KEY}${userId}`, 'true')
      } catch (error) {
        console.error('Failed to cache tour progress locally.', error)
      }
    } catch (error) {
      console.error('Failed to save tour progress.', error)
      toast.error('Your tour progress could not be saved. Check your connection and try again.')
    }
  }, [userId])

  const completeTour = useCallback(() => {
    void saveTourProgress()
  }, [saveTourProgress])

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
        completeTour()
        toast.success("Tour Completed: You're ready to master your personal finance ledger!")
        return prev
      }
    })
  }, [completeTour, navigate])

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0)
      navigate(TOUR_STEPS[prevIndex].route)
      return prevIndex
    })
  }, [navigate])

  const skipTour = useCallback(() => {
    setIsTourActive(false)
    completeTour()
    toast.info('Tour skipped. Reopen anytime from the top bar or sidebar guide.')
  }, [completeTour])

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
    completeTour()
  }, [completeTour])

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

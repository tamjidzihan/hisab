export interface TourStep {
  id: string
  title: string
  subtitle: string
  location: string
  route: string
  howTo: string[]
  architectRule: string
  iconName: 'Plus' | 'LayoutDashboard' | 'Landmark' | 'SlidersHorizontal' | 'Receipt' | 'BarChart3' | 'Target' | 'Settings'
}

export interface HowToTopic {
  id: string
  category: 'daily' | 'accounts' | 'budgets' | 'transactions' | 'analytics' | 'goals' | 'settings'
  question: string
  whereToFind: string
  route: string
  steps: string[]
  note?: string
}

export interface TourContextValue {
  isWelcomeOpen: boolean
  isTourActive: boolean
  currentStepIndex: number
  isGuideModalOpen: boolean
  startTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  openGuideModal: () => void
  closeGuideModal: () => void
  openWelcomeModal: () => void
  closeWelcomeModal: () => void
  restartTour: () => void
}


import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TourProvider, useTourGuide } from '@/features/tour/TourContext'
import { FirstTimeWelcomeModal } from '@/features/tour/FirstTimeWelcomeModal'
import { InteractiveTourOverlay } from '@/features/tour/InteractiveTourOverlay'
import { SiteDirectoryModal } from '@/features/tour/SiteDirectoryModal'

const AppShellInner: React.FC = () => {
  const { openGuideModal } = useTourGuide()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#161d26] flex flex-col md:flex-row antialiased">
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenTourGuide={openGuideModal}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenTourGuide={openGuideModal}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <FirstTimeWelcomeModal />
      <InteractiveTourOverlay />
      <SiteDirectoryModal />
    </div>
  )
}

export const AppShell: React.FC = () => (
  <TourProvider>
    <AppShellInner />
  </TourProvider>
)

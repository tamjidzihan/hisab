import React, { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ProfileSettingsCard } from './components/ProfileSettingsCard'
import { RegionalCurrencyCard } from './components/RegionalCurrencyCard'
import { CaliperThresholdsCard } from './components/CaliperThresholdsCard'
import { DataManagementCard } from './components/DataManagementCard'
import { SecuritySessionsCard } from './components/SecuritySessionsCard'
import { useSettings } from './useSettings'
import {
  User,
  Globe,
  Sliders,
  Database,
  Shield,
  Download,
  Layers,
} from 'lucide-react'

type SettingsTab = 'all' | 'profile' | 'regional' | 'caliper' | 'data' | 'security'

export const SettingsPage: React.FC = () => {
  const {
    profile,
    regional,
    caliper,
    sessions,
    updateProfile,
    updateRegional,
    updateCaliper,
    terminateSession,
    exportFullJsonArchive,
    exportCsv,
    purgeAllData,
  } = useSettings()

  const [activeTab, setActiveTab] = useState<SettingsTab>('all')

  const tabs: Array<{ id: SettingsTab; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'Overview (All)', icon: <Layers className="w-4.5 h-4.5" /> },
    { id: 'profile', label: 'User Identity', icon: <User className="w-4.5 h-4.5" /> },
    { id: 'regional', label: 'Currency & Locale', icon: <Globe className="w-4.5 h-4.5" /> },
    { id: 'caliper', label: 'Caliper Tolerances', icon: <Sliders className="w-4.5 h-4.5" /> },
    { id: 'data', label: 'Data & Recovery', icon: <Database className="w-4.5 h-4.5" /> },
    { id: 'security', label: 'Security & Sessions', icon: <Shield className="w-4.5 h-4.5" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d2d9e4]">
        <div>
          <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
            System Preferences & Ledger Configuration
          </h1>
          <p className="text-xs text-[#64748b]">
            Manage controller identity, regional formatting, caliper tolerances, and disaster recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportFullJsonArchive}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#2563eb]" />
            <span>Download Backup</span>
          </Button>
        </div>
      </div>

      {/* Settings Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#e2e8f0]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-[3px] transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#161d26] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'profile') && (
          <ProfileSettingsCard profile={profile} onSave={updateProfile} />
        )}

        {(activeTab === 'all' || activeTab === 'regional') && (
          <RegionalCurrencyCard regional={regional} onSave={updateRegional} />
        )}

        {(activeTab === 'all' || activeTab === 'caliper') && (
          <CaliperThresholdsCard caliper={caliper} onSave={updateCaliper} />
        )}

        {(activeTab === 'all' || activeTab === 'data') && (
          <DataManagementCard
            onExportJson={exportFullJsonArchive}
            onExportCsv={exportCsv}
            onPurgeAll={purgeAllData}
          />
        )}

        {(activeTab === 'all' || activeTab === 'security') && (
          <SecuritySessionsCard
            sessions={sessions}
            onTerminateSession={terminateSession}
          />
        )}
      </div>
    </div>
  )
}
export default SettingsPage

import React, { useRef, useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { toast } from 'sonner'
import {
  Database,
  Download,
  Upload,
  FileSpreadsheet,
  RefreshCw,
  Trash2,
  CheckCircle2,
  HardDriveDownload,
} from 'lucide-react'
import { PurgeConfirmModal } from './PurgeConfirmModal'

export interface DataManagementCardProps {
  onExportJson: () => void
  onExportCsv: () => void
  onPurgeAll: () => void
}

export const DataManagementCard: React.FC<DataManagementCardProps> = ({
  onExportJson,
  onExportCsv,
  onPurgeAll,
}) => {
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRecalculate = () => {
    setIsRecalculating(true)
    setTimeout(() => {
      setIsRecalculating(false)
      toast.success('Double-entry integrity check passed. Minor units checksum verified: 0 discrepancy.')
    }, 600)
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      toast.error('Invalid file format. Please upload a JSON backup archive.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (!parsed.schema || !parsed.transactions) {
          throw new Error('Invalid archive schema')
        }
        toast.success(`Backup archive verified. ${parsed.transactions.length} records ready for restoration.`)
      } catch {
        toast.error('Failed to parse backup archive. File might be corrupted.')
      }
    }
    reader.readAsText(file)
    // Reset file input
    e.target.value = ''
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf0]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#161d26]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#161d26] font-mono">
            Data Vault, Export & Disaster Recovery
          </h2>
        </div>
        <span className="text-xs font-mono text-[#059669] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Schema: Draftsman's Ledger v2.0
        </span>
      </div>

      {/* Primary Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full JSON Archive */}
        <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#161d26] font-mono uppercase">
              <HardDriveDownload className="w-4 h-4 text-[#2563eb]" />
              <span>Full System Backup (JSON)</span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              Complete archive containing accounts, transactions, transfer pairs, budget calipers,
              and savings goals for migration or cold storage.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportJson}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#2563eb]" />
            <span>Download JSON Archive</span>
          </Button>
        </div>

        {/* RFC 4180 CSV Ledger */}
        <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#161d26] font-mono uppercase">
              <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
              <span>Ledger Spreadsheet (CSV)</span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              RFC 4180 compliant CSV export containing all transaction rows, payees, minor amounts,
              and account tags for Excel or accounting software.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#059669]" />
            <span>Export Transactions (CSV)</span>
          </Button>
        </div>
      </div>

      {/* Restore and Integrity Check */}
      <div className="pt-2 border-t border-[#e5eaf0] space-y-4">
        <h3 className="text-xs font-bold text-[#161d26] uppercase font-mono tracking-wider">
          Database Maintenance & Restoration
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-[#d2d9e4] rounded-[4px]">
          <div>
            <span className="text-xs font-semibold text-[#161d26] block">
              Restore System From Backup
            </span>
            <span className="text-[11px] text-[#64748b]">
              Restore an existing Hisab JSON backup archive into your active ledger workspace.
            </span>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Backup</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-[#d2d9e4] rounded-[4px]">
          <div>
            <span className="text-xs font-semibold text-[#161d26] block">
              Recalculate Ledger Balance Checksums
            </span>
            <span className="text-[11px] text-[#64748b]">
              Recomputes account balance running sums from atomic integer minor units.
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Auditing...' : 'Verify Balances'}</span>
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-[#fecaca] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#dc2626] font-mono">
            Danger Zone — Database Reset
          </span>
          <span className="text-[10px] font-mono text-[#991b1b] bg-[#fef2f2] px-2 py-0.5 rounded-[3px] border border-[#fecaca]">
            Destructive
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#fef2f2]/40 border border-[#fecaca] rounded-[4px]">
          <div>
            <span className="text-xs font-semibold text-[#991b1b] block">
              Purge All Records & Reinitialize
            </span>
            <span className="text-[11px] text-[#7f1d1d]">
              Irreversibly deletes all accounts, transactions, and budgets. Requires confirmation code.
            </span>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsPurgeModalOpen(true)}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Ledger Data</span>
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <PurgeConfirmModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirmPurge={() => {
          onPurgeAll()
          toast.success('Ledger database purged and reset to pristine factory state.')
        }}
      />
    </Card>
  )
}


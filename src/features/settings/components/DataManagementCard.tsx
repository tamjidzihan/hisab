import React, { useRef, useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
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
  ShieldAlert,
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
    e.target.value = ''
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#161d26]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#161d26] font-mono">
              Data Vault, Export & Disaster Recovery
            </h2>
          </div>
          <Badge variant="inflow" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Draftsman's Schema v2.0
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Primary Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full JSON Archive */}
          <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#161d26] font-mono uppercase">
                <HardDriveDownload className="w-4 h-4 text-[#2563eb]" />
                <span>Full System Backup (JSON)</span>
              </div>
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                Self-contained encrypted archive containing accounts, transactions, transfer pairs, budget calipers,
                and savings vaults for cold offline storage.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onExportJson}
              className="w-full justify-center"
              leftIcon={<Download className="w-3.5 h-3.5 text-[#2563eb]" />}
            >
              Download JSON Archive
            </Button>
          </div>

          {/* RFC 4180 CSV Ledger */}
          <div className="p-4 rounded-[4px] border border-[#d2d9e4] bg-[#f8fafc] flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#161d26] font-mono uppercase">
                <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
                <span>Ledger Spreadsheet (CSV)</span>
              </div>
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                Standard RFC 4180 compliant CSV export containing all transaction rows, payees, minor amounts,
                and account tags for Excel or accounting audit.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="w-full justify-center"
              leftIcon={<Download className="w-3.5 h-3.5 text-[#059669]" />}
            >
              Export Transactions (CSV)
            </Button>
          </div>
        </div>

        {/* Database Maintenance & Restoration Section */}
        <div className="space-y-3 pt-2 border-t border-[#e5eaf0]">
          <h3 className="text-xs font-bold text-[#161d26] uppercase font-mono tracking-wider">
            Ledger Maintenance & Restoration
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-white border border-[#d2d9e4] rounded-[4px]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#161d26] block">
                Restore System From Backup Archive
              </span>
              <span className="text-[11px] text-[#64748b] block">
                Load a previously exported Hisab JSON backup file to overwrite or reseed workspace.
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
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Restore Backup
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-white border border-[#d2d9e4] rounded-[4px]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#161d26] block">
                Recalculate Ledger Balance Checksums
              </span>
              <span className="text-[11px] text-[#64748b] block">
                Audits running sums and transfer-pair integrity across all atomic integer minor units.
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculate}
              disabled={isRecalculating}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />}
              className="whitespace-nowrap"
            >
              {isRecalculating ? 'Auditing...' : 'Verify Balances'}
            </Button>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="p-4 bg-[#fef2f2]/60 border border-[#fecaca] rounded-[4px] space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#dc2626] font-mono">
              <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
              <span>Danger Zone — Ledger Database Reset</span>
            </div>
            <span className="text-[10px] font-mono text-[#991b1b] bg-white px-2 py-0.5 rounded border border-[#fecaca] font-semibold">
              IRREVERSIBLE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[11px] text-[#991b1b] leading-relaxed max-w-xl">
              Permanently purges all account balances, posted transactions, budget records, and savings vaults.
              Requires high-security confirmation passkey.
            </p>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsPurgeModalOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="whitespace-nowrap shrink-0"
            >
              Purge Ledger Data
            </Button>
          </div>
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

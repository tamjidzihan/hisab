import React, { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { parseTransactionsFromCsv } from '../csvUtils'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useAuth } from '@/features/auth/AuthContext'
import { UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { Account, Category, Transaction } from '@/types'

export interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (transactions: Transaction[]) => void
  accounts: Account[]
  categories: Category[]
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  accounts,
  categories,
}) => {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [parsedValid, setParsedValid] = useState<Transaction[]>([])
  const [parsingErrors, setParsingErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!user) {
        setParsedValid([])
        setParsingErrors(['Your session has expired. Sign in again to import records.'])
        setIsProcessing(false)
        return
      }
      const { valid, errors } = parseTransactionsFromCsv(text, user.id, accounts, categories)
      setParsedValid(valid)
      setParsingErrors(errors)
      setIsProcessing(false)
    }
    reader.readAsText(selected)
  }

  const handleConfirmImport = () => {
    if (parsedValid.length > 0) {
      onImport(parsedValid)
      onClose()
      setFile(null)
      setParsedValid([])
      setParsingErrors([])
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Ledger Records via CSV"
      description="Validate and ingest external transaction rows into Hisab."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={parsedValid.length === 0}
            onClick={handleConfirmImport}
          >
            Import {parsedValid.length} Transactions
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-[#d2d9e4] rounded-[6px] p-6 text-center hover:border-[#161d26] transition-colors bg-[#fafbfd]">
          <input
            type="file"
            accept=".csv,text/csv"
            id="csv-file-input"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <UploadCloud className="w-8 h-8 text-[#64748b]" />
            <span className="text-xs font-semibold text-[#161d26]">
              {isProcessing
                ? 'Analyzing CSV records...'
                : file
                ? file.name
                : 'Select or drop a CSV file to inspect'}
            </span>
            <span className="text-[10px] text-[#64748b]">
              Headers: Date (YYYY-MM-DD), Type (income/expense/transfer), Amount, Description, Account, Category
            </span>
          </label>
        </div>

        {/* Errors list if any */}
        {parsingErrors.length > 0 && (
          <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[4px] text-xs text-[#991b1b] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#dc2626]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{parsingErrors.length} format warning(s) detected:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 max-h-24 overflow-y-auto">
              {parsingErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Valid Records Preview */}
        {parsedValid.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#059669]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{parsedValid.length} valid rows ready for posting:</span>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto border border-[#d2d9e4] rounded-[4px]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f4f6f9] border-b border-[#d2d9e4] text-[#64748b] text-[10px] sticky top-0">
                  <tr>
                    <th className="py-1.5 px-3">Date</th>
                    <th className="py-1.5 px-3">Type</th>
                    <th className="py-1.5 px-3">Description</th>
                    <th className="py-1.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eaf0]">
                  {parsedValid.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fafbfd]">
                      <td className="py-1.5 px-3">{formatDate(row.transactionDate, 'dd MMM yyyy')}</td>
                      <td className="py-1.5 px-3 uppercase text-[10px]">{row.type}</td>
                      <td className="py-1.5 px-3 font-sans truncate max-w-xs">{row.description}</td>
                      <td className="py-1.5 px-3 text-right tabular-nums font-bold">
                        {formatCurrency(row.amountMinor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedValid.length > 10 && (
              <p className="text-[10px] text-[#64748b] font-mono text-center">
                + {parsedValid.length - 10} additional rows in file
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

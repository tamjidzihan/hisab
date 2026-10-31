import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { toast } from 'sonner'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
    setSubmitted(true)
    toast.success('Recovery protocol initiated.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Recover Ledger Access
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Provide your registered email address to receive an emergency master vault recovery token.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[4px] space-y-3">
          <div className="flex items-center gap-2 text-[#065f46] font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>Recovery Protocol Dispatched</span>
          </div>
          <p className="text-xs text-[#065f46] leading-relaxed">
            If an account is associated with <span className="font-mono font-semibold">{email}</span>, master recovery instructions have been transmitted. Please check your inbox and security spam filters.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161d26] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Vault Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            id="forgot-email"
            autoComplete="email"
            autoFocus
            placeholder="name@household.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefixElement={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<KeyRound className="w-4 h-4" />}
            className="w-full justify-center h-10 font-semibold tracking-wide text-xs"
          >
            Dispatch Recovery Token
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748b] hover:text-[#161d26] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}


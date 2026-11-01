import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Building2, Eye, EyeOff, ShieldCheck, Check, AlertCircle } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { useAuth } from './AuthContext'

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [baseCurrency, setBaseCurrency] = useState('BDT')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time password validation metrics
  const hasMinLength = password.length >= 8
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword

  const strengthScore = [hasMinLength, hasNumberOrSymbol, hasUppercase].filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please provide your account controller name.')
      return
    }

    if (!email.trim()) {
      setError('Please provide a valid email address.')
      return
    }

    if (!hasMinLength) {
      setError('Master password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Master passwords do not match.')
      return
    }

    if (!acceptTerms) {
      setError('You must acknowledge the Financial Privacy Agreement.')
      return
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        householdName: householdName.trim() || `${name.trim()}'s Ledger`,
        baseCurrency,
        password,
        confirmPassword,
        acceptTerms,
      })
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Vault creation failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Surface Heading */}
      <div>
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Construct Ledger Vault
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Establish a new personal or household financial ledger with dimensional discipline.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[4px] text-xs text-[#991b1b] font-medium"
        >
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Household */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Controller Name"
            type="text"
            id="signup-name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!householdName || householdName.endsWith("'s Ledger")) {
                setHouseholdName(e.target.value ? `${e.target.value.trim()}'s Ledger` : '')
              }
            }}
            prefixElement={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Household / Vault"
            type="text"
            id="signup-household"
            placeholder="e.g. Household Ledger"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            prefixElement={<Building2 className="w-4 h-4" />}
          />
        </div>

        {/* Email & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Email Address"
              type="email"
              id="signup-email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefixElement={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          <div>
            <Select
              label="Base Currency"
              id="signup-currency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              options={[
                { value: 'BDT', label: 'BDT (৳ Taka)' },
                { value: 'USD', label: 'USD ($ Dollar)' },
                { value: 'EUR', label: 'EUR (€ Euro)' },
                { value: 'GBP', label: 'GBP (£ Pound)' },
                { value: 'INR', label: 'INR (₹ Rupee)' },
              ]}
            />
          </div>
        </div>

        {/* Master Password */}
        <div className="space-y-1.5">
          <Input
            label="Master Password"
            type={showPassword ? 'text' : 'password'}
            id="signup-password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefixElement={<Lock className="w-4 h-4" />}
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#64748b] hover:text-[#161d26] transition-colors cursor-pointer p-0.5"
                aria-label={showPassword ? 'Hide master password' : 'Show master password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            required
          />

          {/* Password Caliper Strength Gauge */}
          {password.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1 flex-1 rounded-[2px] transition-all duration-300 ${
                    strengthScore >= 1
                      ? strengthScore === 1
                        ? 'bg-[#dc2626]'
                        : strengthScore === 2
                        ? 'bg-[#d97706]'
                        : 'bg-[#059669]'
                      : 'bg-[#e2e8f0]'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-[2px] transition-all duration-300 ${
                    strengthScore >= 2
                      ? strengthScore === 2
                        ? 'bg-[#d97706]'
                        : 'bg-[#059669]'
                      : 'bg-[#e2e8f0]'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-[2px] transition-all duration-300 ${
                    strengthScore === 3 ? 'bg-[#059669]' : 'bg-[#e2e8f0]'
                  }`}
                />
              </div>

              {/* Requirement Checklist */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#64748b]">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-[#059669]' : ''}`}>
                  {hasMinLength ? <Check className="w-3 h-3" /> : '•'} 8+ Chars
                </span>
                <span className={`flex items-center gap-1 ${hasUppercase ? 'text-[#059669]' : ''}`}>
                  {hasUppercase ? <Check className="w-3 h-3" /> : '•'} Uppercase
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    hasNumberOrSymbol ? 'text-[#059669]' : ''
                  }`}
                >
                  {hasNumberOrSymbol ? <Check className="w-3 h-3" /> : '•'} Number/Symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Master Password */}
        <div>
          <Input
            label="Confirm Master Password"
            type={showPassword ? 'text' : 'password'}
            id="signup-confirm-password"
            autoComplete="new-password"
            placeholder="Repeat master password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefixElement={<Lock className="w-4 h-4" />}
            suffixElement={
              confirmPassword.length > 0 ? (
                passwordsMatch ? (
                  <Check className="w-4 h-4 text-[#059669]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#dc2626]" />
                )
              ) : undefined
            }
            required
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-[#dc2626] font-mono mt-1">
              Passwords do not match.
            </p>
          )}
        </div>

        {/* Privacy Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-[3px] border-[#d2d9e4] text-[#161d26] focus:ring-[#161d26] cursor-pointer"
            />
            <span className="text-[11px] text-[#64748b] leading-tight">
              I acknowledge that my financial ledger records are stored locally with integer minor unit precision and are strictly isolated to my vault session.
            </span>
          </label>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          className="w-full justify-center h-10 font-semibold tracking-wide text-xs mt-2"
        >
          Construct Ledger Vault
        </Button>
      </form>

      {/* Switch to Sign In */}
      <div className="pt-4 border-t border-[#e5eaf0] text-center text-xs">
        <span className="text-[#64748b]">Already hold a ledger vault? </span>
        <Link
          to="/login"
          className="font-semibold text-[#161d26] hover:underline cursor-pointer"
        >
          Sign In to Vault
        </Link>
      </div>
    </div>
  )
}

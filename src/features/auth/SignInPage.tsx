import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from './AuthContext'

export const SignInPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect destination after successful login
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please provide your registered email address.')
      return
    }

    if (!password) {
      setError('Please enter your master vault password.')
      return
    }

    try {
      await login({ email: email.trim(), password, rememberMe })
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Please check your credentials.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Surface Heading */}
      <div>
        <h1 className="text-xl font-bold text-[#161d26] tracking-tight">
          Unlock Ledger Vault
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Enter your master credentials to decrypt and access your accounts.
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

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          id="signin-email"
          name="email"
          autoComplete="email"
          autoFocus
          placeholder="name@household.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixElement={<Mail className="w-4 h-4" />}
          required
        />

        <div className="space-y-1">
          <Input
            label="Master Password"
            type={showPassword ? 'text' : 'password'}
            id="signin-password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
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
        </div>

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-[3px] border-[#d2d9e4] text-[#161d26] focus:ring-[#161d26] cursor-pointer"
            />
            <span className="text-[#64748b] font-mono text-[11px]">Remember this workstation</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-mono text-[#64748b] hover:text-[#161d26] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full justify-center h-10 font-semibold tracking-wide text-xs"
        >
          Authorize & Unlock Ledger
        </Button>
      </form>

      {/* Switch to Registration */}
      <div className="pt-4 border-t border-[#e5eaf0] text-center text-xs">
        <span className="text-[#64748b]">Don't hold a ledger vault yet? </span>
        <Link
          to="/register"
          className="font-semibold text-[#161d26] hover:underline cursor-pointer"
        >
          Construct Account
        </Link>
      </div>
    </div>
  )
}


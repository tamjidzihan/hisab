import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import type { AuthUser, LoginCredentials, RegisterCredentials, AuthContextValue } from './types'

const STORAGE_KEY = 'hisab_session_user'
const TOKEN_KEY = 'hisab_auth_token'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as AuthUser
      }
      return null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sync user state with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to sync auth state with localStorage', e)
    }
  }, [user])

  // Hydrate session from backend on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        apiClient
          .get<{ success: boolean; data: { user: AuthUser } }>('/auth/me')
          .then((res) => {
            if (res.data?.data?.user) {
              setUser(res.data.data.user)
            }
          })
          .catch(() => {
            try {
              localStorage.removeItem(TOKEN_KEY)
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // noop
            }
            setUser(null)
          })
      }
    } catch {
      setUser(null)
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please provide both email and master password.')
      }

      const response = await apiClient.post('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      })

      if (response.data?.data?.user) {
        const apiUser = response.data.data.user
        if (response.data.data.token) {
          try {
            localStorage.setItem(TOKEN_KEY, response.data.data.token)
          } catch {
            // noop
          }
        }
        setUser(apiUser)
        toast.success(`Vault Unlocked: Welcome back, ${apiUser.name}`)
        return
      }

      throw new Error('Failed to authenticate with ledger server.')
    } catch (apiError: any) {
      const msg = apiError.response?.data?.message || apiError.message || 'Invalid email or master password.'
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    try {
      if (!credentials.acceptTerms) {
        throw new Error('Please acknowledge the Financial Privacy Agreement.')
      }

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Master passwords do not match.')
      }

      if (credentials.password.length < 8) {
        throw new Error('Master password must be at least 8 characters long.')
      }

      const response = await apiClient.post('/auth/register', {
        name: credentials.name.trim(),
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        householdName: credentials.householdName?.trim(),
        baseCurrency: credentials.baseCurrency,
      })

      if (response.data?.data?.user) {
        const apiUser = response.data.data.user
        if (response.data.data.token) {
          try {
            localStorage.setItem(TOKEN_KEY, response.data.data.token)
          } catch {
            // noop
          }
        }
        setUser(apiUser)
        toast.success(`Ledger Vault Constructed: Welcome, ${apiUser.name}`)
        return
      }

      throw new Error('Failed to register account with ledger server.')
    } catch (apiError: any) {
      const msg = apiError.response?.data?.message || apiError.message || 'Registration failed.'
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    try {
      apiClient.post('/auth/logout').catch(() => {
        // Ignore network errors on logout
      })
    } finally {
      setUser(null)
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        // noop
      }
      toast.info('Ledger Vault Locked. Session terminated.')
    }
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

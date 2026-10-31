import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from './queryClient'
import { AuthProvider } from '@/features/auth/AuthContext'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'ds-toast',
            style: {
              background: 'var(--color-vellum, #ffffff)',
              color: 'var(--color-graphite, #161d26)',
              border: '1px solid var(--color-border-steel, #d2d9e4)',
              borderRadius: '4px',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(22, 29, 38, 0.08)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

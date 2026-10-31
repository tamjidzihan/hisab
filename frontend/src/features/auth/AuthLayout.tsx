import React from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import { ShieldCheck, Compass, Lock } from 'lucide-react'
import { useAuth } from './AuthContext'

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth()

  // If already authenticated, redirect to primary ledger dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] bg-[radial-gradient(#d2d9e4_1px,transparent_1px)] [background-size:20px_20px] flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 antialiased selection:bg-[#161d26] selection:text-white">
      {/* Top Ledger Header / Brand Mark */}
      <header className="w-full max-w-md flex items-center justify-between py-4">
        <Link
          to="/login"
          className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#161d26] rounded-[4px]"
        >
          {/* Draftsman's Compass/Caliper Icon Badge */}
          <div className="w-9 h-9 rounded-[4px] bg-[#161d26] text-white flex items-center justify-center shadow-2xs group-hover:bg-[#25303f] transition-colors">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base tracking-widest text-[#161d26] uppercase">
                HISAB
              </span>
              <span className="px-1.5 py-0.2 bg-[#e2e8f0] text-[#475569] text-[9px] font-mono font-semibold rounded-[2px] uppercase">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-[#64748b] font-mono uppercase tracking-wider">
              The Draftsman's Ledger
            </span>
          </div>
        </Link>

        {/* Security Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-mono">
          <Lock className="w-3.5 h-3.5 text-[#059669]" />
          <span className="text-[11px] font-medium hidden sm:inline">Encrypted Vault</span>
        </div>
      </header>

      {/* Main Dynamic Viewport (SignIn / SignUp / ForgotPassword) */}
      <main className="w-full max-w-md my-auto py-6">
        <div className="bg-white border border-[#d2d9e4] rounded-[6px] shadow-[0_8px_30px_rgba(22,29,38,0.06)] overflow-hidden">
          {/* Top 2px Precision Accent Rule */}
          <div className="h-0.5 bg-[#161d26] w-full" aria-hidden="true" />
          
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Architectural Ledger Footer */}
      <footer className="w-full max-w-md py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#64748b]" />
          <span>Integer Minor Unit Precision (Paisa)</span>
          <span>•</span>
          <span>Client Isolated</span>
        </div>
        <p className="text-[10px] text-[#94a3b8] mt-1 font-mono">
          © {new Date().getFullYear()} Hisab Finance Tracker. Architecture of Personal Capital.
        </p>
      </footer>
    </div>
  )
}


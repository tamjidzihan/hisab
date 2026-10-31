import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { SignInPage } from '@/features/auth/SignInPage'
import { SignUpPage } from '@/features/auth/SignUpPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { TransactionsPage } from '@/features/transactions/TransactionsPage'
import { AccountsPage } from '@/features/accounts/AccountsPage'
import { BudgetsPage } from '@/features/budgets/BudgetsPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { GoalsPage } from '@/features/goals/GoalsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { NotFoundPage } from '@/features/common/NotFoundPage'

export const router = createBrowserRouter([
  // Public Authentication Routes
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <SignInPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'register', element: <SignUpPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  // Protected Ledger Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'accounts', element: <AccountsPage /> },
          { path: 'budgets', element: <BudgetsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  // 404 Catch-All
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

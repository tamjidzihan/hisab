import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { TransactionsPage } from '@/features/transactions/TransactionsPage'
import { AccountsPage } from '@/features/accounts/AccountsPage'
import { BudgetsPage } from '@/features/budgets/BudgetsPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { GoalsPage } from '@/features/goals/GoalsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { NotFoundPage } from '@/features/common/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'transactions',
        element: <TransactionsPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'budgets',
        element: <BudgetsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])


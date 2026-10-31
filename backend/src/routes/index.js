const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const transactionsRoutes = require('./transactions.routes')
const accountsRoutes = require('./accounts.routes')
const categoriesRoutes = require('./categories.routes')
const budgetsRoutes = require('./budgets.routes')
const goalsRoutes = require('./goals.routes')
const analyticsRoutes = require('./analytics.routes')
const settingsRoutes = require('./settings.routes')

// Health / Status Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Hisab Ledger v2.0',
    timestamp: new Date().toISOString(),
  })
})

// Feature Endpoints
router.use('/auth', authRoutes)
router.use('/transactions', transactionsRoutes)
router.use('/accounts', accountsRoutes)
router.use('/categories', categoriesRoutes)
router.use('/budgets', budgetsRoutes)
router.use('/goals', goalsRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/settings', settingsRoutes)

module.exports = router


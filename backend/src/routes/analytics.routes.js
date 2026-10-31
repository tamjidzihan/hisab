const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analytics.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/summary', analyticsController.getSummary)
router.get('/dashboard', analyticsController.getDashboard)
router.get('/monthly-trend', analyticsController.getMonthlyTrend)
router.get('/category-breakdown', analyticsController.getCategoryBreakdown)
router.get('/budget-performance', analyticsController.getBudgetPerformance)
router.get('/top-expenses', analyticsController.getTopExpenses)

module.exports = router


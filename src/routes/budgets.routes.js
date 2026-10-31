const express = require('express')
const router = express.Router()
const budgetsController = require('../controllers/budgets.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/', budgetsController.getBudgets)
router.post('/', budgetsController.createOrUpdateBudget)
router.delete('/:id', budgetsController.deleteBudget)

module.exports = router


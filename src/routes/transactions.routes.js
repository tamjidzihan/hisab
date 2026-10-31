const express = require('express')
const router = express.Router()
const transactionsController = require('../controllers/transactions.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/', transactionsController.getTransactions)
router.post('/', transactionsController.createTransaction)
router.get('/export', transactionsController.exportTransactions)
router.get('/:id', transactionsController.getTransactionById)
router.patch('/:id', transactionsController.updateTransaction)
router.delete('/:id', transactionsController.deleteTransaction)

module.exports = router


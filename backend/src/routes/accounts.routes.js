const express = require('express')
const router = express.Router()
const accountsController = require('../controllers/accounts.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/', accountsController.getAccounts)
router.post('/', accountsController.createAccount)
router.patch('/:id', accountsController.updateAccount)
router.delete('/:id', accountsController.deleteAccount)

module.exports = router


const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middlewares/auth')
const { authLimiter } = require('../middlewares/rateLimiter')

router.post('/register', authLimiter, authController.register)
router.post('/login', authLimiter, authController.login)
router.post('/logout', authController.logout)
router.get('/me', authenticate, authController.me)
router.post('/forgot-password', authLimiter, authController.forgotPassword)

module.exports = router


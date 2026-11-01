const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settings.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/profile', settingsController.getProfile)
router.patch('/profile', settingsController.updateProfile)
router.get('/tour', settingsController.getTourProgress)
router.patch('/tour', settingsController.updateTourProgress)
router.get('/sessions', settingsController.getSessions)
router.delete('/sessions/:id', settingsController.terminateSession)
router.post('/export', settingsController.exportFullBackup)

module.exports = router

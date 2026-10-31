const express = require('express')
const router = express.Router()
const goalsController = require('../controllers/goals.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/', goalsController.getGoals)
router.post('/', goalsController.createGoal)
router.patch('/:id', goalsController.updateGoal)
router.post('/:id/contributions', goalsController.addContribution)
router.delete('/:id', goalsController.deleteGoal)

module.exports = router


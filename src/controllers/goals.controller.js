const { SavingsGoal, SavingsGoalContribution, Account } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/goals
const getGoals = async (req, res, next) => {
  try {
    const userId = req.user.id
    const goals = await SavingsGoal.findAll({
      where: { userId },
      include: [
        {
          model: SavingsGoalContribution,
          as: 'contributions',
          include: [{ model: Account, as: 'account', attributes: ['name'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    const goalsWithProgress = goals.map((g) => {
      const currentMinor = g.contributions.reduce(
        (sum, c) => sum + Number(c.amountMinor),
        0
      )
      const targetMinor = Number(g.targetAmountMinor)
      const percentage = targetMinor > 0 ? (currentMinor / targetMinor) * 100 : 0

      return {
        ...g.toJSON(),
        currentAmountMinor: currentMinor,
        percentage: parseFloat(percentage.toFixed(1)),
      }
    })

    return successResponse(res, { goals: goalsWithProgress })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/goals
const createGoal = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, targetAmountMinor, targetDate, color, category, initialContributionMinor, accountId } = req.body

    if (!name || !targetAmountMinor) {
      return errorResponse(res, 'Goal name and target amount are required.', 400)
    }

    const goal = await SavingsGoal.create({
      userId,
      name: name.trim(),
      targetAmountMinor: parseInt(targetAmountMinor, 10),
      targetDate: targetDate || null,
      color: color || '#059669',
      category: category || 'General Wealth',
      status: 'active',
    })

    if (initialContributionMinor && parseInt(initialContributionMinor, 10) > 0) {
      await SavingsGoalContribution.create({
        goalId: goal.id,
        userId,
        amountMinor: parseInt(initialContributionMinor, 10),
        contributionDate: new Date().toISOString().slice(0, 10),
        accountId: accountId || null,
        note: 'Opening seed contribution',
      })
    }

    const populated = await SavingsGoal.findByPk(goal.id, {
      include: [{ model: SavingsGoalContribution, as: 'contributions' }],
    })

    return successResponse(res, { goal: populated }, 201)
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/goals/:id/contributions
const addContribution = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { amountMinor, accountId, note } = req.body

    if (!amountMinor || parseInt(amountMinor, 10) <= 0) {
      return errorResponse(res, 'Valid contribution amount is required.', 400)
    }

    const goal = await SavingsGoal.findOne({ where: { id, userId } })
    if (!goal) {
      return errorResponse(res, 'Savings goal not found.', 404)
    }

    const contribution = await SavingsGoalContribution.create({
      goalId: goal.id,
      userId,
      amountMinor: parseInt(amountMinor, 10),
      contributionDate: new Date().toISOString().slice(0, 10),
      accountId: accountId || null,
      note: note || 'Ledger savings allocation',
    })

    return successResponse(res, { contribution }, 201)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/v1/goals/:id
const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { name, targetAmountMinor, targetDate, color, category, status } = req.body

    const goal = await SavingsGoal.findOne({ where: { id, userId } })
    if (!goal) {
      return errorResponse(res, 'Savings goal not found.', 404)
    }

    if (name) goal.name = name.trim()
    if (targetAmountMinor !== undefined) goal.targetAmountMinor = parseInt(targetAmountMinor, 10)
    if (targetDate !== undefined) goal.targetDate = targetDate
    if (color) goal.color = color
    if (category) goal.category = category
    if (status) goal.status = status

    await goal.save()

    const populated = await SavingsGoal.findByPk(goal.id, {
      include: [{ model: SavingsGoalContribution, as: 'contributions' }],
    })

    return successResponse(res, { goal: populated })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/goals/:id
const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const goal = await SavingsGoal.findOne({ where: { id, userId } })
    if (!goal) {
      return errorResponse(res, 'Savings goal not found.', 404)
    }

    await goal.destroy()
    return successResponse(res, { message: 'Savings goal removed.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  addContribution,
  deleteGoal,
}


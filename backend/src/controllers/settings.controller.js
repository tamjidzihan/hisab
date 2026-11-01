const { User, TourProgress, Account, Category, Transaction, Budget, SavingsGoal, Session } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/settings/profile
const getProfile = async (req, res) => {
  const user = req.user
  return successResponse(res, {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      householdName: user.householdName,
      baseCurrency: user.baseCurrency,
      role: user.role,
      joinedDate: user.createdAt.toISOString().slice(0, 10),
    },
  })
}

// PATCH /api/v1/settings/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user
    const { name, householdName, baseCurrency } = req.body

    if (name) user.name = name.trim()
    if (householdName) user.householdName = householdName.trim()
    if (baseCurrency) user.baseCurrency = baseCurrency.trim()

    await user.save()

    return successResponse(res, {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        householdName: user.householdName,
        baseCurrency: user.baseCurrency,
        role: user.role,
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/settings/tour
const getTourProgress = async (req, res, next) => {
  try {
    const progress = await TourProgress.findByPk(req.user.id)
    return successResponse(res, {
      completed: progress?.completed ?? false,
    })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/v1/settings/tour
const updateTourProgress = async (req, res, next) => {
  try {
    const { completed } = req.body
    if (typeof completed !== 'boolean') {
      return errorResponse(res, 'The completed field must be a boolean.', 400)
    }

    const [progress] = await TourProgress.findOrCreate({
      where: { userId: req.user.id },
      defaults: { completed },
    })

    if (progress.completed !== completed) {
      progress.completed = completed
      progress.completedAt = completed ? new Date() : null
      await progress.save()
    } else if (completed && !progress.completedAt) {
      progress.completedAt = new Date()
      await progress.save()
    }

    return successResponse(res, {
      completed: progress.completed,
      completedAt: progress.completedAt,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/settings/sessions
const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id
    const sessions = await Session.findAll({
      where: { userId },
      order: [['lastActive', 'DESC']],
    })
    return successResponse(res, { sessions })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/settings/sessions/:id
const terminateSession = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const session = await Session.findOne({ where: { id, userId } })
    if (!session) {
      return errorResponse(res, 'Session not found.', 404)
    }

    if (session.isCurrent) {
      return errorResponse(res, 'Cannot terminate active current workstation session.', 400)
    }

    await session.destroy()
    return successResponse(res, { message: 'Session connection terminated.' })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/settings/export
const exportFullBackup = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = req.user

    const [accounts, categories, transactions, budgets, goals] = await Promise.all([
      Account.findAll({ where: { userId } }),
      Category.findAll({ where: { userId } }),
      Transaction.findAll({ where: { userId }, order: [['transactionDate', 'ASC']] }),
      Budget.findAll({ where: { userId } }),
      SavingsGoal.findAll({ where: { userId } }),
    ])

    const backupPayload = {
      version: '2.0.0',
      schema: "Draftsman's Ledger Architecture",
      exportedAt: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email,
        householdName: user.householdName,
        baseCurrency: user.baseCurrency,
      },
      vaultsCount: accounts.length,
      transactionsCount: transactions.length,
      accounts,
      categories,
      transactions,
      budgets,
      savingsGoals: goals,
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=hisab-vault-backup-${new Date().toISOString().slice(0, 10)}.json`
    )
    return res.status(200).json(backupPayload)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getTourProgress,
  updateTourProgress,
  getSessions,
  terminateSession,
  exportFullBackup,
}

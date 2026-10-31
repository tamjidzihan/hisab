const { Op } = require('sequelize')
const { Budget, Category, Transaction } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/budgets?month=YYYY-MM
const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user.id
    const monthQuery = req.query.month || new Date().toISOString().slice(0, 7)
    const monthStart = `${monthQuery}-01`

    // Calculate month end date
    const [year, monthNum] = monthQuery.split('-').map(Number)
    const nextMonthDate = new Date(Date.UTC(year, monthNum, 1))
    const monthEnd = nextMonthDate.toISOString().slice(0, 10)

    const budgets = await Budget.findAll({
      where: { userId, month: monthStart },
      include: [{ model: Category, as: 'category' }],
    })

    // Server-side aggregation: calculate actual posted expenses in that month
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (b) => {
        const spent = await Transaction.sum('amountMinor', {
          where: {
            userId,
            categoryId: b.categoryId,
            type: 'expense',
            status: 'posted',
            transactionDate: {
              [Op.gte]: monthStart,
              [Op.lt]: monthEnd,
            },
          },
        })

        const spentMinor = Number(spent || 0)
        const limitMinor = Number(b.limitMinor)
        const remainingMinor = limitMinor - spentMinor
        const percentageUsed = limitMinor > 0 ? (spentMinor / limitMinor) * 100 : 0

        return {
          ...b.toJSON(),
          spentMinor,
          remainingMinor,
          percentageUsed: parseFloat(percentageUsed.toFixed(1)),
          isWarning: percentageUsed >= b.alertThreshold && percentageUsed < 100,
          isOverLimit: percentageUsed >= 100,
        }
      })
    )

    return successResponse(res, {
      month: monthQuery,
      budgets: budgetsWithSpent,
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/budgets
const createOrUpdateBudget = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { categoryId, month, limitMinor, alertThreshold } = req.body

    if (!categoryId || !month || !limitMinor) {
      return errorResponse(res, 'categoryId, month (YYYY-MM), and limitMinor are required.', 400)
    }

    const monthStart = month.length === 7 ? `${month}-01` : month

    let budget = await Budget.findOne({
      where: { userId, categoryId, month: monthStart },
    })

    if (budget) {
      budget.limitMinor = parseInt(limitMinor, 10)
      if (alertThreshold) budget.alertThreshold = parseInt(alertThreshold, 10)
      await budget.save()
    } else {
      budget = await Budget.create({
        userId,
        categoryId,
        month: monthStart,
        limitMinor: parseInt(limitMinor, 10),
        alertThreshold: alertThreshold ? parseInt(alertThreshold, 10) : 80,
      })
    }

    const populated = await Budget.findByPk(budget.id, {
      include: [{ model: Category, as: 'category' }],
    })

    return successResponse(res, { budget: populated }, 201)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/budgets/:id
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const budget = await Budget.findOne({ where: { id, userId } })
    if (!budget) {
      return errorResponse(res, 'Budget not found.', 404)
    }

    await budget.destroy()
    return successResponse(res, { message: 'Budget ceiling removed.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
}


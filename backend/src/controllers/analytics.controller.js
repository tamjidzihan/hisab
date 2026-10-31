const { Op } = require('sequelize')
const {
  Transaction,
  Category,
  Budget,
  Account,
  RecurringTransaction,
  SavingsGoal,
  SavingsGoalContribution,
} = require('../models')
const { successResponse } = require('../utils/response')

// GET /api/v1/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { from, to } = req.query

    const dateFilter = {}
    if (from && to) {
      dateFilter.transactionDate = { [Op.between]: [from, to] }
    } else if (from) {
      dateFilter.transactionDate = { [Op.gte]: from }
    } else if (to) {
      dateFilter.transactionDate = { [Op.lte]: to }
    }

    const incomeSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'income',
        status: 'posted',
        ...dateFilter,
      },
    })

    const expenseSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        ...dateFilter,
      },
    })

    const totalIncomeMinor = Number(incomeSum || 0)
    const totalExpenseMinor = Number(expenseSum || 0)
    const netCashFlowMinor = totalIncomeMinor - totalExpenseMinor
    const savingsRate =
      totalIncomeMinor > 0 ? ((totalIncomeMinor - totalExpenseMinor) / totalIncomeMinor) * 100 : 0

    return successResponse(res, {
      totalIncomeMinor,
      totalExpenseMinor,
      netCashFlowMinor,
      savingsRate: parseFloat(savingsRate.toFixed(1)),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/analytics/dashboard?month=YYYY-MM
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id
    const month = req.query.month || new Date().toISOString().slice(0, 7)
    const [year, monthNum] = month.split('-').map(Number)

    const monthStart = `${month}-01`
    const nextMonthDate = new Date(Date.UTC(year, monthNum, 1))
    const monthEnd = nextMonthDate.toISOString().slice(0, 10)

    const prevMonthDate = new Date(Date.UTC(year, monthNum - 2, 1))
    const prevMonthKey = prevMonthDate.toISOString().slice(0, 7)
    const prevMonthStart = `${prevMonthKey}-01`
    const prevMonthEnd = monthStart

    // 1. Current Month Totals
    const currentIncomeSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'income',
        status: 'posted',
        transactionDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
      },
    })

    const currentExpenseSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        transactionDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
      },
    })

    const prevIncomeSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'income',
        status: 'posted',
        transactionDate: { [Op.gte]: prevMonthStart, [Op.lt]: prevMonthEnd },
      },
    })

    const prevExpenseSum = await Transaction.sum('amountMinor', {
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        transactionDate: { [Op.gte]: prevMonthStart, [Op.lt]: prevMonthEnd },
      },
    })

    const totalIncomeMinor = Number(currentIncomeSum || 0)
    const totalExpenseMinor = Number(currentExpenseSum || 0)
    const netCashFlowMinor = totalIncomeMinor - totalExpenseMinor
    const savingsRate =
      totalIncomeMinor > 0 ? parseFloat((((totalIncomeMinor - totalExpenseMinor) / totalIncomeMinor) * 100).toFixed(1)) : null

    // 2. Accounts with dynamic balances
    const accounts = await Account.findAll({
      where: { userId, isArchived: false },
      order: [['createdAt', 'ASC']],
    })

    const accountsWithBalances = await Promise.all(
      accounts.map(async (acc) => {
        const txs = await Transaction.findAll({
          where: { accountId: acc.id, userId, status: 'posted' },
          attributes: ['type', 'amountMinor', 'description'],
        })

        let currentBalanceMinor = BigInt(acc.openingBalanceMinor)
        for (const tx of txs) {
          const amt = BigInt(tx.amountMinor)
          if (tx.type === 'income') {
            currentBalanceMinor += amt
          } else if (tx.type === 'expense') {
            currentBalanceMinor -= amt
          } else if (tx.type === 'transfer') {
            if (tx.description && tx.description.toLowerCase().startsWith('transfer from')) {
              currentBalanceMinor += amt
            } else {
              currentBalanceMinor -= amt
            }
          }
        }

        return {
          id: acc.id,
          userId: acc.userId,
          name: acc.name,
          type: acc.type,
          currency: acc.currency,
          openingBalanceMinor: Number(acc.openingBalanceMinor),
          currentBalanceMinor: Number(currentBalanceMinor),
          accountNumberMasked: acc.accountNumber ? `•••• ${acc.accountNumber.slice(-4)}` : undefined,
          isArchived: acc.isArchived,
        }
      })
    )

    // 3. Budgets with spent
    const budgets = await Budget.findAll({
      where: { userId, month: monthStart },
      include: [{ model: Category, as: 'category' }],
    })

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (b) => {
        const spent = await Transaction.sum('amountMinor', {
          where: {
            userId,
            categoryId: b.categoryId,
            type: 'expense',
            status: 'posted',
            transactionDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
          },
        })
        const spentMinor = Number(spent || 0)
        return {
          id: b.id,
          userId: b.userId,
          categoryId: b.categoryId,
          categoryName: b.category?.name || 'General',
          categoryColor: b.category?.color || '#059669',
          month: b.month,
          limitMinor: Number(b.limitMinor),
          spentMinor,
          alertThreshold: parseFloat(b.alertThreshold) || 0.8,
        }
      })
    )

    // 4. Recent Transactions (latest 10)
    const recentTxRows = await Transaction.findAll({
      where: { userId },
      include: [
        { model: Account, as: 'account', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
      ],
      order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']],
      limit: 10,
    })

    const recentTransactions = recentTxRows.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      accountId: tx.accountId,
      accountName: tx.account?.name || 'Account Vault',
      categoryId: tx.categoryId,
      categoryName: tx.category?.name || undefined,
      type: tx.type,
      amountMinor: Number(tx.amountMinor),
      currency: tx.currency || 'BDT',
      transactionDate: tx.transactionDate,
      description: tx.description,
      payee: tx.payee,
      paymentMethod: tx.paymentMethod,
      transferGroupId: tx.transferGroupId,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    }))

    // 5. Upcoming Recurring
    let upcomingRecurring = []
    try {
      const recRows = await RecurringTransaction.findAll({
        where: { userId, isActive: true },
        limit: 5,
        order: [['nextOccurrence', 'ASC']],
      })
      upcomingRecurring = recRows.map((r) => ({
        id: r.id,
        userId: r.userId,
        name: r.name,
        amountMinor: Number(r.amountMinor),
        type: r.type,
        frequency: r.frequency,
        nextOccurrence: r.nextOccurrence,
        isActive: r.isActive,
      }))
    } catch {
      // safe fallback if RecurringTransaction table is optional
    }

    // 6. Active Goals
    const goalRows = await SavingsGoal.findAll({
      where: { userId, status: 'active' },
      include: [{ model: SavingsGoalContribution, as: 'contributions' }],
      order: [['targetDate', 'ASC']],
    })

    const activeGoals = goalRows.map((g) => {
      const currentAmountMinor = (g.contributions || []).reduce(
        (sum, c) => sum + Number(c.amountMinor),
        0
      )
      return {
        id: g.id,
        userId: g.userId,
        name: g.name,
        targetAmountMinor: Number(g.targetAmountMinor),
        currentAmountMinor,
        targetDate: g.targetDate,
        status: g.status,
      }
    })

    // 7. Monthly Cash Flow Trend (last 6 months)
    const monthlyCashFlowTrend = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(year, monthNum - 1 - i, 1))
      const mKey = d.toISOString().slice(0, 7)
      const mStart = `${mKey}-01`
      const nDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
      const mEnd = nDate.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-US', { month: 'short' })

      const inc = await Transaction.sum('amountMinor', {
        where: {
          userId,
          type: 'income',
          status: 'posted',
          transactionDate: { [Op.gte]: mStart, [Op.lt]: mEnd },
        },
      })
      const exp = await Transaction.sum('amountMinor', {
        where: {
          userId,
          type: 'expense',
          status: 'posted',
          transactionDate: { [Op.gte]: mStart, [Op.lt]: mEnd },
        },
      })

      monthlyCashFlowTrend.push({
        month: label,
        incomeMinor: Number(inc || 0),
        expenseMinor: Number(exp || 0),
      })
    }

    // 8. Spending by Category for this month
    const expenses = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        transactionDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
      },
      include: [{ model: Category, as: 'category' }],
    })

    const catMap = {}
    let monthExpenseTotal = 0
    for (const tx of expenses) {
      const cId = tx.categoryId || 'uncat'
      const cName = tx.category?.name || 'Uncategorized'
      const cColor = tx.category?.color || '#64748b'
      const amt = Number(tx.amountMinor)
      monthExpenseTotal += amt
      if (!catMap[cId]) {
        catMap[cId] = { categoryName: cName, categoryColor: cColor, spentMinor: 0 }
      }
      catMap[cId].spentMinor += amt
    }

    const spendingByCategory = Object.values(catMap).map((c) => ({
      ...c,
      percentage: monthExpenseTotal > 0 ? parseFloat(((c.spentMinor / monthExpenseTotal) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.spentMinor - a.spentMinor)

    return successResponse(res, {
      periodMonth: month,
      totalIncomeMinor,
      totalExpenseMinor,
      netCashFlowMinor,
      savingsRate,
      previousMonthIncomeMinor: Number(prevIncomeSum || 0),
      previousMonthExpenseMinor: Number(prevExpenseSum || 0),
      accounts: accountsWithBalances,
      budgets: budgetsWithSpent,
      recentTransactions,
      upcomingRecurring,
      activeGoals,
      monthlyCashFlowTrend,
      spendingByCategory,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/analytics/monthly-trend?months=12
const getMonthlyTrend = async (req, res, next) => {
  try {
    const userId = req.user.id
    const monthsCount = parseInt(req.query.months, 10) || 12

    // Build list of months YYYY-MM
    const months = []
    const now = new Date()
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1))
      months.push({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth(),
        key: d.toISOString().slice(0, 7),
        label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      })
    }

    const trend = await Promise.all(
      months.map(async (m) => {
        const monthStart = `${m.key}-01`
        const nextMonth = new Date(Date.UTC(m.year, m.month + 1, 1)).toISOString().slice(0, 10)

        const incomeSum = await Transaction.sum('amountMinor', {
          where: {
            userId,
            type: 'income',
            status: 'posted',
            transactionDate: { [Op.gte]: monthStart, [Op.lt]: nextMonth },
          },
        })

        const expenseSum = await Transaction.sum('amountMinor', {
          where: {
            userId,
            type: 'expense',
            status: 'posted',
            transactionDate: { [Op.gte]: monthStart, [Op.lt]: nextMonth },
          },
        })

        const incomeMinor = Number(incomeSum || 0)
        const expenseMinor = Number(expenseSum || 0)
        const netMinor = incomeMinor - expenseMinor
        const savingsRate =
          incomeMinor > 0 ? ((incomeMinor - expenseMinor) / incomeMinor) * 100 : 0

        return {
          month: m.key,
          label: m.label,
          incomeMinor,
          expenseMinor,
          netMinor,
          savingsRate: parseFloat(savingsRate.toFixed(1)),
        }
      })
    )

    return successResponse(res, { trend })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/analytics/category-breakdown?from=...&to=...
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { from, to } = req.query

    const dateFilter = {}
    if (from && to) {
      dateFilter.transactionDate = { [Op.between]: [from, to] }
    }

    const expenses = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        ...dateFilter,
      },
      include: [{ model: Category, as: 'category' }],
    })

    const categoryMap = {}
    let totalExpenseMinor = 0

    for (const tx of expenses) {
      const catId = tx.categoryId || 'uncategorized'
      const catName = tx.category?.name || 'Uncategorized'
      const catColor = tx.category?.color || '#64748b'
      const amt = Number(tx.amountMinor)

      totalExpenseMinor += amt

      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          categoryId: catId,
          categoryName: catName,
          categoryColor: catColor,
          spentMinor: 0,
        }
      }
      categoryMap[catId].spentMinor += amt
    }

    const categories = Object.values(categoryMap).map((cat) => {
      const percentage = totalExpenseMinor > 0 ? (cat.spentMinor / totalExpenseMinor) * 100 : 0
      return {
        ...cat,
        percentage: parseFloat(percentage.toFixed(1)),
      }
    })

    // Sort descending by spend
    categories.sort((a, b) => b.spentMinor - a.spentMinor)

    return successResponse(res, {
      totalExpenseMinor,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/analytics/top-expenses?limit=10&from=...&to=...
const getTopExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { limit = 10, from, to } = req.query

    const dateFilter = {}
    if (from && to) {
      dateFilter.transactionDate = { [Op.between]: [from, to] }
    }

    const topExpenses = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        status: 'posted',
        ...dateFilter,
      },
      include: [{ model: Category, as: 'category', attributes: ['name', 'color'] }],
      order: [['amountMinor', 'DESC']],
      limit: parseInt(limit, 10),
    })

    const formatted = topExpenses.map((t) => ({
      id: t.id,
      description: t.description,
      payee: t.payee,
      categoryName: t.category?.name || 'Uncategorized',
      categoryColor: t.category?.color || '#64748b',
      date: t.transactionDate,
      amountMinor: Number(t.amountMinor),
    }))

    return successResponse(res, { topExpenses: formatted })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/analytics/budget-performance?month=YYYY-MM
const getBudgetPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id
    const month = req.query.month || new Date().toISOString().slice(0, 7)
    const [year, monthNum] = month.split('-').map(Number)

    const monthStart = `${month}-01`
    const nextMonthDate = new Date(Date.UTC(year, monthNum, 1))
    const monthEnd = nextMonthDate.toISOString().slice(0, 10)

    const budgets = await Budget.findAll({
      where: { userId, month: monthStart },
      include: [{ model: Category, as: 'category' }],
    })

    const performance = await Promise.all(
      budgets.map(async (b) => {
        const spent = await Transaction.sum('amountMinor', {
          where: {
            userId,
            categoryId: b.categoryId,
            type: 'expense',
            status: 'posted',
            transactionDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
          },
        })
        const spentMinor = Number(spent || 0)
        const limitMinor = Number(b.limitMinor)
        const percentageUsed = limitMinor > 0 ? (spentMinor / limitMinor) * 100 : 0

        return {
          categoryName: b.category?.name || 'General',
          categoryColor: b.category?.color || '#059669',
          budgetLimitMinor: limitMinor,
          actualSpentMinor: spentMinor,
          percentageUsed: parseFloat(percentageUsed.toFixed(1)),
        }
      })
    )

    return successResponse(res, { performance })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSummary,
  getDashboard,
  getMonthlyTrend,
  getCategoryBreakdown,
  getBudgetPerformance,
  getTopExpenses,
}


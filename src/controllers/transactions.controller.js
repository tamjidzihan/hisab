const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { sequelize, Transaction, Account, Category } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/transactions
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id
    const {
      from,
      to,
      type,
      categoryId,
      accountId,
      search,
      page = 1,
      limit = 50,
      sortBy = 'transactionDate',
      sortOrder = 'DESC',
    } = req.query

    const where = { userId }

    if (from && to) {
      where.transactionDate = { [Op.between]: [from, to] }
    } else if (from) {
      where.transactionDate = { [Op.gte]: from }
    } else if (to) {
      where.transactionDate = { [Op.lte]: to }
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (accountId && accountId !== 'all') {
      where.accountId = accountId
    }

    if (search) {
      where[Op.or] = [
        { description: { [Op.like]: `%${search}%` } },
        { payee: { [Op.like]: `%${search}%` } },
      ]
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: Account, as: 'account', attributes: ['id', 'name', 'type', 'color', 'icon'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'type', 'color', 'icon'] },
      ],
      order: [[sortBy, orderDirection]],
      limit: parseInt(limit, 10),
      offset,
    })

    return successResponse(res, {
      transactions: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10)),
      },
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/transactions
const createTransaction = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const userId = req.user.id
    const {
      type,
      amountMinor,
      transactionDate,
      description,
      payee,
      paymentMethod,
      notes,
      accountId,
      categoryId,
      toAccountId, // For transfers
    } = req.body

    if (!type || !amountMinor || !transactionDate || !accountId) {
      await t.rollback()
      return errorResponse(res, 'Type, amountMinor, transactionDate, and accountId are required.', 400)
    }

    // Verify source account belongs to user
    const sourceAccount = await Account.findOne({ where: { id: accountId, userId }, transaction: t })
    if (!sourceAccount) {
      await t.rollback()
      return errorResponse(res, 'Source account vault not found.', 404)
    }

    if (type === 'transfer') {
      if (!toAccountId) {
        await t.rollback()
        return errorResponse(res, 'Destination account vault is required for transfers.', 400)
      }

      if (accountId === toAccountId) {
        await t.rollback()
        return errorResponse(res, 'Source and destination accounts must be different.', 400)
      }

      const destAccount = await Account.findOne({ where: { id: toAccountId, userId }, transaction: t })
      if (!destAccount) {
        await t.rollback()
        return errorResponse(res, 'Destination account vault not found.', 404)
      }

      if (sourceAccount.currency !== destAccount.currency) {
        await t.rollback()
        return errorResponse(res, 'Transfers require source and destination accounts to use the same currency.', 400)
      }

      const transferGroupId = uuidv4()

      // Outflow leg from source vault
      const outLeg = await Transaction.create(
        {
          userId,
          accountId,
          categoryId: null,
          type: 'transfer',
          amountMinor,
          currency: sourceAccount.currency,
          transactionDate,
          description: `Transfer to ${destAccount.name}: ${description || 'Internal transfer'}`,
          payee: destAccount.name,
          paymentMethod: 'Internal Transfer',
          notes,
          transferGroupId,
          status: 'posted',
        },
        { transaction: t }
      )

      // Inflow leg to destination vault
      const inLeg = await Transaction.create(
        {
          userId,
          accountId: toAccountId,
          categoryId: null,
          type: 'transfer',
          amountMinor,
          currency: sourceAccount.currency,
          transactionDate,
          description: `Transfer from ${sourceAccount.name}: ${description || 'Internal transfer'}`,
          payee: sourceAccount.name,
          paymentMethod: 'Internal Transfer',
          notes,
          transferGroupId,
          status: 'posted',
        },
        { transaction: t }
      )

      await t.commit()
      return successResponse(res, { transaction: outLeg, reciprocalLeg: inLeg }, 201)
    } else {
      // Standard income or expense
      const record = await Transaction.create(
        {
          userId,
          accountId,
          categoryId: categoryId || null,
          type,
          amountMinor,
          currency: sourceAccount.currency,
          transactionDate,
          description: description || 'Uncategorized Entry',
          payee,
          paymentMethod: paymentMethod || 'Cash',
          notes,
          status: 'posted',
        },
        { transaction: t }
      )

      await t.commit()

      const populated = await Transaction.findByPk(record.id, {
        include: [
          { model: Account, as: 'account' },
          { model: Category, as: 'category' },
        ],
      })

      return successResponse(res, { transaction: populated }, 201)
    }
  } catch (error) {
    await t.rollback()
    next(error)
  }
}

// GET /api/v1/transactions/:id
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const transaction = await Transaction.findOne({
      where: { id, userId },
      include: [
        { model: Account, as: 'account' },
        { model: Category, as: 'category' },
      ],
    })

    if (!transaction) {
      return errorResponse(res, 'Transaction not found.', 404)
    }

    return successResponse(res, { transaction })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/v1/transactions/:id
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const updates = req.body

    const transaction = await Transaction.findOne({ where: { id, userId } })
    if (!transaction) {
      return errorResponse(res, 'Transaction not found.', 404)
    }

    // Never allow updating userId or transferGroupId directly
    delete updates.userId
    delete updates.transferGroupId

    await transaction.update(updates)

    const populated = await Transaction.findByPk(id, {
      include: [
        { model: Account, as: 'account' },
        { model: Category, as: 'category' },
      ],
    })

    return successResponse(res, { transaction: populated })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/transactions/:id
const deleteTransaction = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { id } = req.params
    const userId = req.user.id

    const transaction = await Transaction.findOne({ where: { id, userId }, transaction: t })
    if (!transaction) {
      await t.rollback()
      return errorResponse(res, 'Transaction not found.', 404)
    }

    // If it is part of a transfer pair, delete both legs
    if (transaction.transferGroupId) {
      await Transaction.destroy({
        where: { transferGroupId: transaction.transferGroupId, userId },
        transaction: t,
      })
    } else {
      await transaction.destroy({ transaction: t })
    }

    await t.commit()
    return successResponse(res, { message: 'Transaction successfully removed from ledger.' })
  } catch (error) {
    await t.rollback()
    next(error)
  }
}

// GET /api/v1/transactions/export
const exportTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id
    const transactions = await Transaction.findAll({
      where: { userId },
      include: [
        { model: Account, as: 'account', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
      ],
      order: [['transactionDate', 'DESC']],
    })

    const headers = [
      'Date',
      'Type',
      'Amount (BDT)',
      'Account',
      'Category',
      'Payee',
      'Description',
      'Payment Method',
    ]

    const rows = transactions.map((tx) => [
      tx.transactionDate,
      tx.type.toUpperCase(),
      (Number(tx.amountMinor) / 100).toFixed(2),
      tx.account?.name || 'Unknown Vault',
      tx.category?.name || 'Uncategorized',
      `"${(tx.payee || '').replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.paymentMethod || '',
    ])

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=hisab-ledger-${new Date().toISOString().slice(0, 10)}.csv`)
    return res.status(200).send(csvString)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactions,
}

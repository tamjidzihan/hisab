const { Account, Transaction } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')
const { calculateAccountBalances } = require('../utils/accountBalances')

// GET /api/v1/accounts
const getAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const accounts = await Account.findAll({
      where: { userId, isArchived: false },
      order: [['createdAt', 'ASC']],
    })

    const transactions = await Transaction.findAll({
      where: { userId, status: 'posted' },
      attributes: ['id', 'accountId', 'type', 'amountMinor', 'description', 'transferGroupId', 'createdAt'],
    })
    const balances = calculateAccountBalances(accounts, transactions)
    const accountsWithBalances = accounts.map((account) => ({
      ...account.toJSON(),
      currentBalanceMinor: Number(balances.get(account.id)),
    }))

    return successResponse(res, { accounts: accountsWithBalances })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/accounts
const createAccount = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, type, currency, openingBalanceMinor, accountNumber, institution, color, icon } = req.body

    if (!name || !type) {
      return errorResponse(res, 'Account name and vault type are required.', 400)
    }

    const account = await Account.create({
      userId,
      name: name.trim(),
      type,
      currency: currency || 'BDT',
      openingBalanceMinor: openingBalanceMinor ? parseInt(openingBalanceMinor, 10) : 0,
      accountNumber,
      institution,
      color: color || '#161d26',
      icon: icon || 'Wallet',
    })

    return successResponse(res, {
      account: {
        ...account.toJSON(),
        currentBalanceMinor: Number(account.openingBalanceMinor),
      },
    }, 201)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/v1/accounts/:id
const updateAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const updates = req.body

    const account = await Account.findOne({ where: { id, userId } })
    if (!account) {
      return errorResponse(res, 'Account vault not found.', 404)
    }

    delete updates.userId
    delete updates.id

    await account.update(updates)
    return successResponse(res, { account })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/accounts/:id
const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const account = await Account.findOne({ where: { id, userId } })
    if (!account) {
      return errorResponse(res, 'Account vault not found.', 404)
    }

    // Soft archive rather than hard delete to protect transaction ledger integrity
    account.isArchived = true
    await account.save()

    return successResponse(res, { message: 'Account vault archived successfully.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
}

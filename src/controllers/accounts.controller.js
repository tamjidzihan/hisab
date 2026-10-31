const { Account, Transaction } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/accounts
const getAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const accounts = await Account.findAll({
      where: { userId, isArchived: false },
      order: [['createdAt', 'ASC']],
    })

    // Compute derived balance for each account:
    // currentBalance = openingBalanceMinor + inflows - outflows
    const accountsWithBalances = await Promise.all(
      accounts.map(async (acc) => {
        const transactions = await Transaction.findAll({
          where: { accountId: acc.id, userId, status: 'posted' },
          attributes: ['type', 'amountMinor', 'description'],
        })

        let currentBalanceMinor = BigInt(acc.openingBalanceMinor)

        for (const tx of transactions) {
          const amt = BigInt(tx.amountMinor)
          if (tx.type === 'income') {
            currentBalanceMinor += amt
          } else if (tx.type === 'expense') {
            currentBalanceMinor -= amt
          } else if (tx.type === 'transfer') {
            // If transfer description indicates inbound vs outbound
            if (tx.description && tx.description.toLowerCase().startsWith('transfer from')) {
              currentBalanceMinor += amt
            } else {
              currentBalanceMinor -= amt
            }
          }
        }

        return {
          ...acc.toJSON(),
          currentBalanceMinor: Number(currentBalanceMinor),
        }
      })
    )

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


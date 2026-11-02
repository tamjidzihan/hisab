const test = require('node:test')
const assert = require('node:assert/strict')
const { calculateAccountBalances } = require('./accountBalances')

test('applies income and expenses to an account opening balance', () => {
  const balances = calculateAccountBalances(
    [{ id: 'cash', openingBalanceMinor: 10000 }],
    [
      { id: 'income', accountId: 'cash', type: 'income', amountMinor: 5000 },
      { id: 'expense', accountId: 'cash', type: 'expense', amountMinor: 1250 },
    ]
  )

  assert.equal(balances.get('cash'), 13750n)
})

test('uses directional transfer descriptions for legacy transfer entries', () => {
  const balances = calculateAccountBalances(
    [
      { id: 'cash', openingBalanceMinor: 0 },
      { id: 'bank', openingBalanceMinor: 0 },
    ],
    [
      {
        id: 'out',
        accountId: 'cash',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash Out From Cash',
        transferGroupId: 'pair',
      },
      {
        id: 'in',
        accountId: 'bank',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash in to Bank Account',
        transferGroupId: 'pair',
      },
    ]
  )

  assert.equal(balances.get('cash'), -500000n)
  assert.equal(balances.get('bank'), 500000n)
})

test('determines direction for paired legacy transfers without directional descriptions', () => {
  const balances = calculateAccountBalances(
    [
      { id: 'source', openingBalanceMinor: 1000000 },
      { id: 'destination', openingBalanceMinor: 0 },
    ],
    [
      {
        id: 'out',
        accountId: 'source',
        type: 'transfer',
        amountMinor: 250000,
        description: 'Inter-vault transfer',
        transferGroupId: 'pair',
        createdAt: '2026-11-02T10:00:00.000Z',
      },
      {
        id: 'in',
        accountId: 'destination',
        type: 'transfer',
        amountMinor: 250000,
        description: 'Inter-vault transfer',
        transferGroupId: 'pair',
        createdAt: '2026-11-02T10:00:01.000Z',
      },
    ]
  )

  assert.equal(balances.get('source'), 750000n)
  assert.equal(balances.get('destination'), 250000n)
})

test('handles legacy pairs where the same directional description was copied to both entries', () => {
  const balances = calculateAccountBalances(
    [
      { id: 'source', openingBalanceMinor: 1000000 },
      { id: 'destination', openingBalanceMinor: 0 },
    ],
    [
      {
        id: 'out',
        accountId: 'source',
        type: 'transfer',
        amountMinor: 250000,
        description: 'Cash in to Bank Account',
        transferGroupId: 'pair',
        createdAt: '2026-11-02T10:00:00.000Z',
      },
      {
        id: 'in',
        accountId: 'destination',
        type: 'transfer',
        amountMinor: 250000,
        description: 'Cash in to Bank Account',
        transferGroupId: 'pair',
        createdAt: '2026-11-02T10:00:01.000Z',
      },
    ]
  )

  assert.equal(balances.get('source'), 750000n)
  assert.equal(balances.get('destination'), 250000n)
})

test('preserves the reported balances and total liquidity for the user transfer scenario', () => {
  const balances = calculateAccountBalances(
    [
      { id: 'bank', openingBalanceMinor: 0 },
      { id: 'wallet', openingBalanceMinor: 0 },
      { id: 'money-bag', openingBalanceMinor: 0 },
    ],
    [
      {
        id: 'salary',
        accountId: 'bank',
        type: 'income',
        amountMinor: 2223400,
      },
      {
        id: 'freelance',
        accountId: 'wallet',
        type: 'income',
        amountMinor: 500000,
      },
      {
        id: 'bank-out',
        accountId: 'bank',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash Out From Bank',
        transferGroupId: 'bank-money-bag',
      },
      {
        id: 'money-bag-in',
        accountId: 'money-bag',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash in to Money Bag',
        transferGroupId: 'bank-money-bag',
      },
      {
        id: 'wallet-out',
        accountId: 'wallet',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash Out From Bkash',
        transferGroupId: 'wallet-money-bag',
      },
      {
        id: 'money-bag-in-again',
        accountId: 'money-bag',
        type: 'transfer',
        amountMinor: 500000,
        description: 'Cash in to Money Bag',
        transferGroupId: 'wallet-money-bag',
      },
    ]
  )

  assert.equal(balances.get('bank'), 1723400n)
  assert.equal(balances.get('wallet'), 0n)
  assert.equal(balances.get('money-bag'), 1000000n)
  assert.equal(
    balances.get('bank') + balances.get('wallet') + balances.get('money-bag'),
    2723400n
  )
})

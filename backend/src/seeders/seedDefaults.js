const { v4: uuidv4 } = require('uuid')
const { sequelize, User, Account, Category, Transaction, Budget, SavingsGoal, SavingsGoalContribution, Session } = require('../models')
const { hashPassword } = require('../utils/password')

const seedDatabase = async () => {
  console.log('--- Initializing Hisab Ledger Seeder ---')

  // Sync schema
  await sequelize.sync({ force: true })
  console.log('✓ Database schema synchronized successfully.')

  // 1. Seed System Default Categories
  const categoriesData = [
    { name: 'Housing & Rent', type: 'expense', color: '#161d26', icon: 'Home' },
    { name: 'Groceries & Dining', type: 'expense', color: '#059669', icon: 'Utensils' },
    { name: 'Utilities & Bills', type: 'expense', color: '#d97706', icon: 'Zap' },
    { name: 'Transportation & Fuel', type: 'expense', color: '#2563eb', icon: 'Car' },
    { name: 'Personal Discretionary', type: 'expense', color: '#64748b', icon: 'ShoppingBag' },
    { name: 'Health & Medical', type: 'expense', color: '#dc2626', icon: 'HeartPulse' },
    { name: 'Salary / Income', type: 'income', color: '#059669', icon: 'Briefcase' },
    { name: 'Freelance & Consulting', type: 'income', color: '#2563eb', icon: 'Laptop' },
    { name: 'Investments & Dividends', type: 'income', color: '#d97706', icon: 'TrendingUp' },
  ]

  const categories = await Category.bulkCreate(
    categoriesData.map((c) => ({
      ...c,
      userId: null, // System default
      isArchived: false,
    }))
  )
  console.log(`✓ Seeded ${categories.length} standard categories.`)

  // 2. Seed Default Demo Controller
  const passwordHash = await hashPassword('ledger2026!')
  const user = await User.create({
    id: 'usr-8921-bd',
    name: 'Zihan Chowdhury',
    email: 'zihan@hisab.local',
    passwordHash,
    householdName: 'Chowdhury Household Ledger',
    baseCurrency: 'BDT',
    role: 'Primary Account Controller',
    emailVerifiedAt: new Date(),
  })
  console.log(`✓ Seeded demo controller: ${user.name} (${user.email})`)

  // 3. Seed Account Vaults
  const cashVault = await Account.create({
    userId: user.id,
    name: 'Cash Wallet',
    type: 'cash',
    currency: 'BDT',
    openingBalanceMinor: 1500000, // ৳15,000.00
    color: '#059669',
    icon: 'Wallet',
  })

  const bankVault = await Account.create({
    userId: user.id,
    name: 'City Bank Priority Account',
    type: 'bank',
    currency: 'BDT',
    openingBalanceMinor: 18500000, // ৳185,000.00
    accountNumber: '****-9824',
    institution: 'City Bank PLC',
    color: '#161d26',
    icon: 'Landmark',
  })

  const bkashVault = await Account.create({
    userId: user.id,
    name: 'bKash MFS Personal',
    type: 'mobile_wallet',
    currency: 'BDT',
    openingBalanceMinor: 2450000, // ৳24,500.00
    accountNumber: '017****9210',
    institution: 'bKash Limited',
    color: '#dc2626',
    icon: 'Smartphone',
  })

  const nagadVault = await Account.create({
    userId: user.id,
    name: 'Nagad Digital Wallet',
    type: 'mobile_wallet',
    currency: 'BDT',
    openingBalanceMinor: 820000, // ৳8,200.00
    accountNumber: '018****4455',
    institution: 'Nagad Postal MFS',
    color: '#d97706',
    icon: 'Smartphone',
  })
  console.log('✓ Seeded 4 account vaults with verified opening balances.')

  // Map categories by name
  const catMap = {}
  categories.forEach((c) => {
    catMap[c.name] = c.id
  })

  // 4. Seed Transactions (in Integer Minor Units)
  const currentMonthKey = new Date().toISOString().slice(0, 7)
  const day = (d) => `${currentMonthKey}-${String(d).padStart(2, '0')}`

  // Salary
  await Transaction.create({
    userId: user.id,
    accountId: bankVault.id,
    categoryId: catMap['Salary / Income'],
    type: 'income',
    amountMinor: 8500000, // ৳85,000.00
    transactionDate: day(1),
    description: 'Executive Salary Disbursement',
    payee: 'TechCorp Engineering Ltd',
    paymentMethod: 'BEFTN Electronic Wire',
    status: 'posted',
  })

  // Rent
  await Transaction.create({
    userId: user.id,
    accountId: bankVault.id,
    categoryId: catMap['Housing & Rent'],
    type: 'expense',
    amountMinor: 2200000, // ৳22,000.00
    transactionDate: day(5),
    description: 'Apartment Monthly Rent',
    payee: 'Gulshan Residential Holdings',
    paymentMethod: 'Bank Transfer',
    status: 'posted',
  })

  // Groceries
  await Transaction.create({
    userId: user.id,
    accountId: bkashVault.id,
    categoryId: catMap['Groceries & Dining'],
    type: 'expense',
    amountMinor: 428000, // ৳4,280.00
    transactionDate: day(10),
    description: 'Monthly Supermarket Provisions',
    payee: 'Shwapno Super Shop',
    paymentMethod: 'bKash QR Merchant',
    status: 'posted',
  })

  // Utilities
  await Transaction.create({
    userId: user.id,
    accountId: bkashVault.id,
    categoryId: catMap['Utilities & Bills'],
    type: 'expense',
    amountMinor: 340000, // ৳3,400.00
    transactionDate: day(14),
    description: 'Electricity Consumption Bill',
    payee: 'DESCO Utility Authority',
    paymentMethod: 'bKash Bill Pay',
    status: 'posted',
  })

  // Fuel / Transport
  await Transaction.create({
    userId: user.id,
    accountId: cashVault.id,
    categoryId: catMap['Transportation & Fuel'],
    type: 'expense',
    amountMinor: 280000, // ৳2,800.00
    transactionDate: day(18),
    description: 'Octane Vehicle Refill',
    payee: 'Padma Oil Filling Station',
    paymentMethod: 'Cash',
    status: 'posted',
  })

  // Linked Transfer Pair (Bank -> bKash)
  const transferId = uuidv4()
  await Transaction.create({
    userId: user.id,
    accountId: bankVault.id,
    categoryId: null,
    type: 'transfer',
    amountMinor: 1000000, // ৳10,000.00
    transactionDate: day(8),
    description: 'Transfer to bKash MFS Personal',
    payee: 'bKash MFS Personal',
    paymentMethod: 'Bank to Wallet',
    transferGroupId: transferId,
    status: 'posted',
  })

  await Transaction.create({
    userId: user.id,
    accountId: bkashVault.id,
    categoryId: null,
    type: 'transfer',
    amountMinor: 1000000, // ৳10,000.00
    transactionDate: day(8),
    description: 'Transfer from City Bank Priority Account',
    payee: 'City Bank Priority Account',
    paymentMethod: 'Bank to Wallet',
    transferGroupId: transferId,
    status: 'posted',
  })
  console.log('✓ Seeded transactions with linked transfer pair.')

  // November Opening Ledger Transactions
  await Transaction.create({
    userId: user.id,
    accountId: bankVault.id,
    categoryId: catMap['Salary & Retainer'] || catMap['Consulting & Freelance'],
    type: 'income',
    amountMinor: 6000000, // ৳60,000.00
    transactionDate: '2026-11-01',
    description: 'Monthly Software Architecture Retainer',
    payee: 'TechCorp Solutions',
    paymentMethod: 'Bank Transfer',
    status: 'posted',
  })

  await Transaction.create({
    userId: user.id,
    accountId: bkashVault.id,
    categoryId: catMap['Utilities & Bills'],
    type: 'expense',
    amountMinor: 150000, // ৳1,500.00
    transactionDate: '2026-11-01',
    description: 'Residential Fiber Broadband',
    payee: 'Carnival Internet',
    paymentMethod: 'bKash MFS',
    status: 'posted',
  })

  await Transaction.create({
    userId: user.id,
    accountId: cashVault.id,
    categoryId: catMap['Groceries & Dining'],
    type: 'expense',
    amountMinor: 428000, // ৳4,280.00
    transactionDate: '2026-11-01',
    description: 'Weekly Bazaar & Fresh Produce',
    payee: 'Shwapno Super Shop',
    paymentMethod: 'Cash',
    status: 'posted',
  })

  // 5. Seed Monthly Budgets for both 2026-10 and 2026-11
  const budgetMonths = ['2026-10-01', '2026-11-01']
  for (const bMonth of budgetMonths) {
    await Budget.create({
      userId: user.id,
      categoryId: catMap['Groceries & Dining'],
      month: bMonth,
      limitMinor: 2000000, // ৳20,000.00
      alertThreshold: 80,
    })

    await Budget.create({
      userId: user.id,
      categoryId: catMap['Utilities & Bills'],
      month: bMonth,
      limitMinor: 1000000, // ৳10,000.00
      alertThreshold: 80,
    })

    await Budget.create({
      userId: user.id,
      categoryId: catMap['Transportation & Fuel'],
      month: bMonth,
      limitMinor: 800000, // ৳8,000.00
      alertThreshold: 80,
    })

    await Budget.create({
      userId: user.id,
      categoryId: catMap['Housing & Rent'],
      month: bMonth,
      limitMinor: 2500000, // ৳25,000.00
      alertThreshold: 80,
    })
  }
  console.log('✓ Seeded monthly budgets with 80% caliper alert notches for Oct & Nov.')

  // 6. Seed Savings Goals
  const emergencyGoal = await SavingsGoal.create({
    userId: user.id,
    name: '6-Month Emergency Liquidity Reserve',
    targetAmountMinor: 30000000, // ৳300,000.00
    targetDate: '2026-12-31',
    color: '#059669',
    category: 'Safety Reserve',
    status: 'active',
  })

  await SavingsGoalContribution.create({
    goalId: emergencyGoal.id,
    userId: user.id,
    amountMinor: 18500000, // ৳185,000.00
    contributionDate: day(1),
    accountId: bankVault.id,
    note: 'Baseline fund allocation',
  })

  const travelGoal = await SavingsGoal.create({
    userId: user.id,
    name: 'Annual Family Vacation Fund',
    targetAmountMinor: 12000000, // ৳120,000.00
    targetDate: '2026-11-20',
    color: '#2563eb',
    category: 'Family & Travel',
    status: 'active',
  })

  await SavingsGoalContribution.create({
    goalId: travelGoal.id,
    userId: user.id,
    amountMinor: 4800000, // ৳48,000.00
    contributionDate: day(2),
    accountId: bankVault.id,
    note: 'Monthly allocation',
  })
  console.log('✓ Seeded savings goals and verified contributions.')

  // 7. Seed Workstation Session
  await Session.create({
    userId: user.id,
    device: 'Windows 11 Workstation',
    browser: 'Chrome 130.0 / Desktop',
    location: 'Dhaka, Bangladesh',
    ipAddress: '103.114.98.24',
    isCurrent: true,
    lastActive: new Date(),
  })

  console.log('--- Seeding Completed Successfully! ---')
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err)
      process.exit(1)
    })
}

module.exports = seedDatabase


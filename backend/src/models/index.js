const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// 1. User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  householdName: {
    type: DataTypes.STRING,
    defaultValue: 'Personal Household Ledger',
  },
  baseCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'BDT',
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Primary Account Controller',
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})

// 2. Account Model
const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('cash', 'bank', 'mobile_wallet', 'card', 'other'),
    allowNull: false,
    defaultValue: 'cash',
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'BDT',
  },
  openingBalanceMinor: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#161d26',
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'Wallet',
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
})

// 3. Category Model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Null for system defaults
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#64748b',
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'Tag',
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
})

// 4. Transaction Model
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true, // Nullable for transfers
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'transfer'),
    allowNull: false,
  },
  amountMinor: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'BDT',
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payee: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transferGroupId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  receiptPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('posted', 'draft'),
    defaultValue: 'posted',
  },
})

// 5. Budget Model
const Budget = sequelize.define(
  'Budget',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    month: {
      type: DataTypes.DATEONLY,
      allowNull: false, // Stored as YYYY-MM-01
    },
    limitMinor: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    alertThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 80,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'categoryId', 'month'],
      },
    ],
  }
)

// 6. RecurringTransaction Model
const RecurringTransaction = sequelize.define('RecurringTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'transfer'),
    allowNull: false,
  },
  amountMinor: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payee: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    defaultValue: 'monthly',
  },
  interval: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  nextOccurrence: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

// 7. SavingsGoal Model
const SavingsGoal = sequelize.define('SavingsGoal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmountMinor: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  targetDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#059669',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active',
  },
})

// 8. SavingsGoalContribution Model
const SavingsGoalContribution = sequelize.define('SavingsGoalContribution', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  goalId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amountMinor: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  contributionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

// 9. Session Model
const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Dhaka, Bangladesh',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
})

// Establish Associations
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts', onDelete: 'CASCADE' })
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Category, { foreignKey: 'userId', as: 'categories', onDelete: 'CASCADE' })
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions', onDelete: 'CASCADE' })
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' })
Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' })

Category.hasMany(Transaction, { foreignKey: 'categoryId', as: 'transactions' })
Transaction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

User.hasMany(Budget, { foreignKey: 'userId', as: 'budgets', onDelete: 'CASCADE' })
Budget.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Category.hasMany(Budget, { foreignKey: 'categoryId', as: 'budgets' })
Budget.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

User.hasMany(SavingsGoal, { foreignKey: 'userId', as: 'savingsGoals', onDelete: 'CASCADE' })
SavingsGoal.belongsTo(User, { foreignKey: 'userId', as: 'user' })

SavingsGoal.hasMany(SavingsGoalContribution, {
  foreignKey: 'goalId',
  as: 'contributions',
  onDelete: 'CASCADE',
})
SavingsGoalContribution.belongsTo(SavingsGoal, { foreignKey: 'goalId', as: 'goal' })
SavingsGoalContribution.belongsTo(Account, { foreignKey: 'accountId', as: 'account' })
Account.hasMany(SavingsGoalContribution, { foreignKey: 'accountId', as: 'goalContributions' })

User.hasMany(Session, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' })
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  sequelize,
  User,
  Account,
  Category,
  Transaction,
  Budget,
  RecurringTransaction,
  SavingsGoal,
  SavingsGoalContribution,
  Session,
}


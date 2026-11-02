const { Sequelize } = require('sequelize')
const path = require('path')
const env = require('./env')

let sequelize

if (env.DB_DIALECT === 'mysql') {
  sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  })
} else {
  // SQLite mode
  const storagePath = path.isAbsolute(env.DB_STORAGE)
    ? env.DB_STORAGE
    : path.resolve(__dirname, '../../', env.DB_STORAGE)

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
    },
  })
}

module.exports = sequelize

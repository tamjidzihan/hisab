const app = require('./app')
const env = require('./config/env')
const { sequelize, User } = require('./models')
// const seedDefaults = require('./seeders/seedDefaults')

const startServer = async () => {
  try {
    console.log(`[Hisab Server]: Initializing database (${env.DB_DIALECT})...`)
    await sequelize.authenticate()
    console.log('[Hisab Server]: Database connection authenticated successfully.')

    // Sync database models
    await sequelize.sync()
    console.log('[Hisab Server]: Schema models synchronized.')

    // // Auto-seed if database is empty
    // const userCount = await User.count()
    // if (userCount === 0) {
    //   console.log('[Hisab Server]: No account controllers found. Performing initial database seed...')
    //   await seedDefaults()
    // }

    const server = app.listen(env.PORT, () => {
      console.log(`[Hisab Server]: The Draftsman's Ledger API listening at http://localhost:${env.PORT}`)
      console.log(`[Hisab Server]: API Base URL: http://localhost:${env.PORT}/api/v1`)
      console.log(`[Hisab Server]: Environment: ${env.NODE_ENV}`)
    })

    const shutdown = async () => {
      console.log('[Hisab Server]: Graceful shutdown initiated...')
      server.close(async () => {
        await sequelize.close()
        console.log('[Hisab Server]: Database connections closed. Process terminating.')
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (error) {
    console.error('[Hisab Server]: Fatal startup error:', error)
    process.exit(1)
  }
}

startServer()


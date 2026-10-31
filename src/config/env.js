const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',

  // Database
  DB_DIALECT: process.env.DB_DIALECT || 'sqlite',
  DB_STORAGE: process.env.DB_STORAGE || './database.sqlite',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_NAME: process.env.DB_NAME || 'hisab_finance_tracker',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  // Auth & Cookies
  JWT_SECRET: process.env.JWT_SECRET || 'hisab_master_draftsman_fallback_secret_key_2026',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'hisab_session',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || 'lax',

  // File Uploads
  MAX_RECEIPT_SIZE_MB: parseInt(process.env.MAX_RECEIPT_SIZE_MB, 10) || 5,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
}


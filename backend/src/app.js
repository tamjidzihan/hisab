const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const morgan = require('morgan')
const env = require('./config/env')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const { apiLimiter } = require('./middlewares/rateLimiter')

const app = express()

// Security HTTP headers
app.use(helmet())

// Enable compression
app.use(compression())

// CORS configuration supporting cookies and headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true)
      
      const allowedOrigins = [
        env.FRONTEND_ORIGIN,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:4173',
        'http://localhost:4174',
        'http://localhost:4180',
        'http://localhost:4181',
        'http://localhost:4182',
        'http://127.0.0.1:5173',
      ]

      if (allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
        return callback(null, true)
      }
      return callback(new Error('Blocked by CORS security policy.'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Global API rate limit
app.use('/api', apiLimiter)

// Mount API routes
app.use('/api/v1', routes)

// 404 Route Catch-All
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Hisab server.`,
  })
})

// Centralized Error Handler
app.use(errorHandler)

module.exports = app


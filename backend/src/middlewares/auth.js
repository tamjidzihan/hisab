const jwt = require('jsonwebtoken')
const env = require('../config/env')
const { User } = require('../models')
const { errorResponse } = require('../utils/response')

const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.[env.SESSION_COOKIE_NAME]

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1]
      }
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. No session token provided.', 401)
    }

    const decoded = jwt.verify(token, env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return errorResponse(res, 'Session invalid or user account removed.', 401)
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token expired. Please sign in again.', 401)
    }
    return errorResponse(res, 'Invalid authentication token.', 401)
  }
}

module.exports = {
  authenticate,
}


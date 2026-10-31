const { errorResponse } = require('../utils/response')

const errorHandler = (err, req, res, next) => {
  console.error('[Hisab API Error]:', err)

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => ({ field: e.path, message: e.message }))
    return errorResponse(res, 'Database validation error.', 400, messages)
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'A record with this identifier already exists.', 409)
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  return errorResponse(res, message, statusCode, err.errors || null)
}

module.exports = errorHandler


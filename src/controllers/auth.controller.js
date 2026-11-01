const jwt = require('jsonwebtoken')
const env = require('../config/env')
const { User, Session } = require('../models')
const { hashPassword, comparePassword } = require('../utils/password')
const { successResponse, errorResponse } = require('../utils/response')

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '30d' })
}

const setSessionCookie = (res, token) => {
  res.cookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })
}

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, householdName, baseCurrency } = req.body

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and master password are required.', 400)
    }

    if (password.length < 8) {
      return errorResponse(res, 'Master password must be at least 8 characters long.', 400)
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } })
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 409)
    }

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      householdName: householdName?.trim() || `${name.trim()}'s Household Ledger`,
      baseCurrency: baseCurrency || 'BDT',
    })

    const token = generateToken(user.id)
    setSessionCookie(res, token)

    // Record initial session
    await Session.create({
      userId: user.id,
      device: req.headers['user-agent'] || 'Web Browser',
      browser: 'Desktop / Web Client',
      ipAddress: req.ip || '127.0.0.1',
      isCurrent: true,
      lastActive: new Date(),
    })

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      householdName: user.householdName,
      baseCurrency: user.baseCurrency,
      role: user.role,
      joinedDate: user.createdAt.toISOString().slice(0, 10),
    }

    return successResponse(res, { user: userData, token }, 201)
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return errorResponse(res, 'Email and master password are required.', 400)
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      return errorResponse(res, 'Invalid email or master password.', 401)
    }

    const isMatch = await comparePassword(password, user.passwordHash)
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or master password.', 401)
    }

    const token = generateToken(user.id)
    setSessionCookie(res, token)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      householdName: user.householdName,
      baseCurrency: user.baseCurrency,
      role: user.role,
      joinedDate: user.createdAt.toISOString().slice(0, 10),
    }

    return successResponse(res, { user: userData, token })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/auth/logout
const logout = async (req, res) => {
  // clearCookie options must exactly mirror the options used when the cookie was set.
  // Mismatch on path/domain/secure/sameSite causes the browser to ignore the clear directive.
  res.clearCookie(env.SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
  })
  return successResponse(res, { message: 'Vault locked. Session successfully terminated.' })
}

// GET /api/v1/auth/me
const me = async (req, res) => {
  const user = req.user
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    householdName: user.householdName,
    baseCurrency: user.baseCurrency,
    role: user.role,
    joinedDate: user.createdAt.toISOString().slice(0, 10),
  }
  return successResponse(res, { user: userData })
}

// POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body
  // In production, dispatch nodemailer email. For now, acknowledge gracefully.
  return successResponse(res, {
    message: `If an account exists for ${email}, recovery instructions have been transmitted.`,
  })
}

module.exports = {
  register,
  login,
  logout,
  me,
  forgotPassword,
}


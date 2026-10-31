const { Op } = require('sequelize')
const { Category } = require('../models')
const { successResponse, errorResponse } = require('../utils/response')

// GET /api/v1/categories
const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { type } = req.query

    const where = {
      [Op.or]: [{ userId }, { userId: null }],
      isArchived: false,
    }

    if (type && (type === 'income' || type === 'expense')) {
      where.type = type
    }

    const categories = await Category.findAll({
      where,
      order: [
        ['type', 'ASC'],
        ['name', 'ASC'],
      ],
    })

    return successResponse(res, { categories })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/categories
const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, type, color, icon } = req.body

    if (!name || !type) {
      return errorResponse(res, 'Category name and type (income/expense) are required.', 400)
    }

    const category = await Category.create({
      userId,
      name: name.trim(),
      type,
      color: color || '#64748b',
      icon: icon || 'Tag',
    })

    return successResponse(res, { category }, 201)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/v1/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const updates = req.body

    const category = await Category.findOne({ where: { id, userId } })
    if (!category) {
      return errorResponse(res, 'Custom category not found or belongs to system defaults.', 404)
    }

    delete updates.userId
    delete updates.id

    await category.update(updates)
    return successResponse(res, { category })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const category = await Category.findOne({ where: { id, userId } })
    if (!category) {
      return errorResponse(res, 'Custom category not found or belongs to system defaults.', 404)
    }

    category.isArchived = true
    await category.save()

    return successResponse(res, { message: 'Category archived successfully.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}


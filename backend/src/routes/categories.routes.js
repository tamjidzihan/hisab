const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categories.controller')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)

router.get('/', categoriesController.getCategories)
router.post('/', categoriesController.createCategory)
router.patch('/:id', categoriesController.updateCategory)
router.delete('/:id', categoriesController.deleteCategory)

module.exports = router


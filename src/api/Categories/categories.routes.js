const router = require('express').Router()
const CategoriesController = require('./categories.controller')

router.get('/', CategoriesController.getCategories)
router.post('/create', CategoriesController.createCategories)
router.put('/edit/:id', CategoriesController.updateCategories)
router.delete('/delete/:id', CategoriesController.deleteCategories)

module.exports = router

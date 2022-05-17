const router = require('express').Router()
const bookRoutes = require('./books/book.routes')
const AuthRoutes = require('./Auth/Auth.routes')
const RackRoutes = require('./Rack/Rack.routes')
const categoriesRoutes = require('./Categories/categories.routes')
const authenticate = require('../helpers/verifyToken')

router.use('/auth', AuthRoutes)
router.use('/books', bookRoutes)
router.use('/rack', RackRoutes)
router.use('/categories', categoriesRoutes)

module.exports = router

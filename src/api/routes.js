const router = require('express').Router()
const bookRoutes = require('./books/book.routes')
const AuthRoutes = require('./Auth/Auth.routes')
const authenticate = require('../helpers/verifyToken')

router.use('/books',authenticate, bookRoutes)
router.use('/auth', AuthRoutes)

module.exports = router
const router = require('express').Router()
const bookRoutes = require('./books/book.routes')
const AuthRoutes = require('./Auth/Auth.routes')

router.use('/books', bookRoutes)
router.use('/auth', AuthRoutes)

module.exports = router
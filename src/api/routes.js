const router = require('express').Router()
const bookRoutes = require('./books/book.routes')
const AuthRoutes = require('./Auth/Auth.routes')
const RackRoutes = require('./Rack/Rack.routes')
const authenticate = require('../helpers/verifyToken')

router.use('/auth', AuthRoutes)
router.use('/books', bookRoutes)
router.use('/rack', RackRoutes)

module.exports = router

const router = require('express').Router()
const bookRoutes = require('./books/book.routes')
const AuthRoutes = require('./Auth/Auth.routes')
const RackRoutes = require('./Rack/Rack.routes')
const CategoriesRoutes = require('./Categories/categories.routes')
const MemberRoutes = require('./Member/member.routes')
const BorrowRoutes = require('./Borrows/borrow.routes')
const StockRoutes = require('./Stock/stock.routes')
const authenticate = require('../helpers/verifyToken')

router.use('/auth', AuthRoutes)
router.use('/books', bookRoutes)
router.use('/rack', RackRoutes)
router.use('/categories', CategoriesRoutes)
router.use('/members', MemberRoutes)
router.use('/borrow', BorrowRoutes)
router.use('/stock', StockRoutes)

module.exports = router

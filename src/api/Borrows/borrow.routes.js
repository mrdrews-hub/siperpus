const router = require('express').Router()
const BorrowController = require('./borrow.controller')

router.get('/', BorrowController.getBorrow)
router.get('/detail/:id', BorrowController.getDetails)
router.post('/create', BorrowController.createBorrow)
router.put('/edit/:id', BorrowController.updateBorrow)
router.put('/return/:id', BorrowController.returnBorrow)
router.delete('/delete/:id', BorrowController.deleteBorrow)

router.post('/tes', BorrowController.test)

module.exports = router

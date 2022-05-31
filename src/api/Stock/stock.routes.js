const router = require('express').Router()
const StockController = require('./stock.controller')

router.get('/', StockController.getStock)
// router.get('/find/:id', StockController.getRackDetail)
router.post('/add', StockController.addStock)
router.put('/edit/:id', StockController.editAddStock)
router.delete('/delete/:id', StockController.deleteStock)

module.exports = router

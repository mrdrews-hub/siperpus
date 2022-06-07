const router = require('express').Router()
const PenaltyController = require('./penalty.controller')

router.get('/', PenaltyController.getPenalties)
router.get('/:id', PenaltyController.getPenaltiesDetail)
router.post('/create', PenaltyController.createPenalties)
router.put('/edit/:id', PenaltyController.updatePenalties)
router.delete('/delete/:id', PenaltyController.deletePenalty)

module.exports = router
const router = require('express').Router()
const MemberController = require('./member.controller')

router.get('/', MemberController.getMember)
router.get('/detail/:id', MemberController.getDetailMember)
router.post('/create', MemberController.createMember)
router.put('/edit/:id', MemberController.updateMember)
router.delete('/delete/:id', MemberController.deleteMember)

module.exports = router

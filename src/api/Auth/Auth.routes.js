const router = require('express').Router()
const AuthController = require('./Auth.controller')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/', AuthController.allUsers)
router.delete('/:id', AuthController.deleteUser)
router.put('/edit', AuthController.editUser)

module.exports = router

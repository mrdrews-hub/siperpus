const router = require('express').Router()
const AuthController = require('./Auth.controller')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/', AuthController.allUsers)

module.exports = router

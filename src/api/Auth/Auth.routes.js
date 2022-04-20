const router = require('express').Router()
const AuthController = require('./Auth.controller')

router.get('/register', AuthController.register)

module.exports = router
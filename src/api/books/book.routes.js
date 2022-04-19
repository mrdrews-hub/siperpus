const router = require('express').Router()
const BookController = require('./book.controller')

router.route('/')
    .get(BookController.getBook)

module.exports = router
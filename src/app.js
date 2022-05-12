const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const APIroutes = require('./api/routes')

const app = express()
express.static('uploads')

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/api', APIroutes)

module.exports = app

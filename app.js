const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const APIroutes = require('./src/api/routes')
const config = require('./src/config/config')
const sequelize = require('./src/helpers/db')

const app = express()

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/api', APIroutes)

app.listen(config.port, async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Server is listening on port ' + config.port)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})

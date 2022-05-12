const app = require('./src/app')
const config = require('./src/config/config')
const sequelize = require('./src/models')

async function assertDatabaseConnectionOk () {
  try {
    await sequelize.authenticate()
    console.log('Database connection OK!')
  } catch (error) {
    console.log('Unable to connect to the database:')
    console.log(error.message)
    process.exit(1)
  }
}

async function init () {
  await assertDatabaseConnectionOk()

  app.listen(config.port, () => {
    console.log(`Express server started on ${config.port}.`)
  })
}

init()

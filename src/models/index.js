const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config/config')
const { bookRelation } = require('./relation')
const { seeder } = require('./seeders/Auth.seed')

const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: 'postgres',
  logging: false
})

const models = [
  require('./auth.model'),
  require('./book.model'),
  require('./rack.model')
]
for (const model of models) {
  model(sequelize, DataTypes)
}

bookRelation(sequelize, DataTypes)

// Get any model for sync purpose
const { Rack, Book } = sequelize.models
sequelize.sync()
// Rack.sync({ force: true })
module.exports = sequelize
// const models = {}

// models.Sequelize = Sequelize
// models.sequelize = sequelize

// models.Auth = require('./auth.model')(sequelize, DataTypes)
// models.Book = require('./book.model')(sequelize, DataTypes)

// module.exports = models

// function initModels () {
//   const Auth = _Auth(sequelize, DataTypes)
//   const Book = _Book(sequelize, DataTypes)
//   const Rack = _Rack(sequelize, DataTypes)

//   return {
//     Auth,
//     Book,
//     Rack
//   }
// }

// module.exports = initModels

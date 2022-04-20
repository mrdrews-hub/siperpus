const { Sequelize } = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize(config.db.name,config.db.username,config.db.password,{
    host: config.db.host,
    dialect: 'postgres',
    logging: false
})

module.exports = sequelize
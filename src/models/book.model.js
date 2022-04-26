const { DataTypes } = require('sequelize')
const sequelize = require('../helpers/db')

const Book = sequelize.define('Book', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Book

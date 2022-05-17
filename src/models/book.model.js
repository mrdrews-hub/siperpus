module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Book', {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(30)
    },
    years: {
      type: DataTypes.STRING(4)
    },
    isbn: {
      type: DataTypes.STRING
    },
    info: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    }
  })
}

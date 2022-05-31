module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Book', {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(30)
    },
    penerbit: {
      type: DataTypes.STRING
    },
    years: {
      type: DataTypes.STRING(4)
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1
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

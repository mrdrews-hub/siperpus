module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Categories', {
    categories: {
      type: DataTypes.STRING(30),
      unique: true
    },
    info: {
      type: DataTypes.TEXT
    }
  })
}

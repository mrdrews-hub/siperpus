module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Rack', {
    rack: {
      type: DataTypes.STRING(6),
      unique: true
    },
    info: {
      type: DataTypes.TEXT
    }
  })
}

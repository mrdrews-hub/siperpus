module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Penalty', {
      jenis: {
        type: DataTypes.STRING(30),
      },
      denda: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date().toISOString().substr(0, 10)
      }
    }, { timestamps: false })
  }
  
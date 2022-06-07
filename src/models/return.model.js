module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Return', {
      returnAt: {
        type: DataTypes.DATEONLY
      },
    }, { timestamps: false })
  }
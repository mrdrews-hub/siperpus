module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Borrowing', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, { timestamps: false })
}

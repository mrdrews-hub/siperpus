
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Auth', {
    username: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(35),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('root', 'admin'),
      defaultValue: 'admin'
    }
  })
}

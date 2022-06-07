module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Stock', {
    status: {
      type: DataTypes.ENUM,
      values: ['tambah', 'kurangi']
    },
    jumlah: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    info: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date().toISOString().substr(0, 10)
    }
  }, { timestamps: false })
}
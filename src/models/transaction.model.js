module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Transaction', {
    id_transaksi: {
      type: DataTypes.STRING,
      unique: true
    },
    tgl_pinjam: {
      type: DataTypes.DATEONLY,
      default: Date.now()
    },
    tgl_kembali: {
      type: DataTypes.DATEONLY
    },
    denda: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, { timestamps: false })
}
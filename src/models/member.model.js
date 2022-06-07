module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Member', {
    member_id: {
      type: DataTypes.STRING,
      unique: true
    },
    nisn: {
      type: DataTypes.STRING,
      unique: true
    },
    nama: {
      type: DataTypes.STRING
    },
    kelas: {
      type: DataTypes.STRING
    },
    alamat: {
      type: DataTypes.TEXT
    },
    tempat: {
      type: DataTypes.STRING
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY
    },
    no_hp: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING(6),
      defaultValue: 'member'
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date().toISOString().substr(0, 10)
    }
  }, { timestamps: false })
}

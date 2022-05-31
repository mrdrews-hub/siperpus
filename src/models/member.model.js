module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Member', {
    member_id: {
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
    no_hp: {
      type: DataTypes.STRING
    }
  })
}
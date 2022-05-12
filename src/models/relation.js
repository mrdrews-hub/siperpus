function bookRelation (sequelize, DataTypes) {
  const { Book, Rack } = sequelize.models

  Rack.hasMany(Book)
  Book.belongsTo(Rack)
}

module.exports = { bookRelation }

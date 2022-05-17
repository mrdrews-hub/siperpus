function bookRelation (sequelize, DataTypes) {
  const { Book, Rack, Categories } = sequelize.models

  Rack.hasMany(Book)
  Book.belongsTo(Rack)

  Categories.hasMany(Book)
  Book.belongsTo(Categories)
}

module.exports = { bookRelation }

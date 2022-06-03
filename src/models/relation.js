function bookRelation (sequelize, DataTypes) {
  const { Book, Rack, Categories, Borrowing, Transaction, Member, Stock } = sequelize.models
    Rack.hasMany(Book, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Book.belongsTo(Rack)

    Categories.hasMany(Book, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Book.belongsTo(Categories)

    Book.hasMany(Stock)
    Stock.belongsTo(Book)

    Book.belongsToMany(Transaction, { through: Borrowing }, {
      onDelete: 'RESTRICT'
    })
    Transaction.belongsToMany(Book, { through: Borrowing }, {
      onDelete: 'RESTRICT'
    })

    Book.hasMany(Borrowing, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Borrowing.belongsTo(Book)

    Transaction.hasMany(Borrowing)
    Borrowing.belongsTo(Transaction)

    Member.hasMany(Transaction)
    Transaction.belongsTo(Member)

    // Member.belongsToMany(Book, { through: Borrowing })
    // Book.belongsToMany(Member, { through: Borrowing })
    // Member.hasMany(Borrowing)
    // Borrowing.belongsTo(Member)
    // Book.hasMany(Borrowing)
    // Borrowing.belongsTo(Book)
    // Transaction.hasOne(Borrowing)
    // Borrowing.belongsTo(Transaction)

    // Transaction.belongsToMany(Book, { through: Borrowing })
    // Book.hasMany(Borrowing)
    // Borrowing.hasOne(Transaction)
    // Borrowing.belongsTo(Transaction)
    // Transaction.belongsTo(Member)
    // Book.hasMany(Borrowing)
    // Borrowing.belongsToMany(Book, { through: Borrowing })
    // Transaction.belongsTo(Borrowing)

    // Member.hasMany(Borrowing)
    // Book.hasMany(Borrowing)
    // Borrowing.belongsTo(Member)

    // Member.belongsToMany(Borrowing, { through: 'buku_dipinjam' })
    // Book.belongsToMany(Borrowing, { through: 'buku_dipinjam' })

    // Book.belongsToMany(Transaction, { through: Borrowing })
    // Transaction.belongsToMany(Book, { through: Borrowing })
    // Borrowing.belongsTo(Transaction)
    // Borrowing.belongsTo(Book)
    // Transaction.hasMany(Borrowing)
    // Book.hasMany(Borrowing)

    // Member.belongsToMany(Borrowing, { through: MemberTransaction });
    // Borrowing.belongsToMany(Member, { through: MemberTransaction });
    // MemberTransaction.belongsTo(Member);
    // MemberTransaction.belongsTo(Borrowing);
    // Member.hasMany(MemberTransaction);
    // Borrowing.hasMany(MemberTransaction);
}

module.exports = { bookRelation }



/*
  Transaction.BelongToMany(Book, { through: pinjaman })
  Transaction.BelongTo(Member)
*/
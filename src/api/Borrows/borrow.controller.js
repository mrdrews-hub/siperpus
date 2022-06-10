const { models } = require('../../models')
const { Op, where } = require('sequelize')

const BorrowController = {

  async test (req, res, next) {
    try {
      const { member, buku, tgl_pinjam, tgl_kembali } = req.body
      res.json({msg: 'Request OKE', data: req.body})
    } catch (error) {
      res.send()
    }
  },

  async getDetails (req, res, next) {
    try {
      const detailTransaction = await models.Transaction.findOne({
        where: { id_transaksi: req.params.id }
      })
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const hariIni = Date.now()
      const tgl_kembali = new Date(detailTransaction.tgl_kembali).getTime();
      const diffDays = Math.round(Math.round((tgl_kembali - hariIni) / (oneDay)));

      const hargaSewaBuku = 0
      const dendaPerHari = 1000
      let totalHarga = 0
      if (diffDays < 0) {
        totalHarga += hargaSewaBuku + dendaPerHari * Math.abs(diffDays)
        await models.Transaction.update(
          { denda: totalHarga }, { where: { id: detailTransaction.id } })
      }
      const result = await models.Transaction.findOne({
        include: [
					{
						model: models.Borrowing,
						include: [models.Book]
					},
					{
						model: models.Member
					},
			],
        where: {
          // [Op.or]: [{ id: req.params.id }, { id_transaksi: req.params.id }],
          id_transaksi: req.params.id
        }
      })
      res.json(result)
    } catch (err) {
      res.json(err)
    }
  },

  async getBorrow (req, res, next) {
    try {
      const Transaction = await models.Transaction.findAll({
				include: [
					{
						model: models.Borrowing,
						include: [models.Book]
					},
					{
						model: models.Member
					},
          {
            model: models.Return
          }
			]
			})
      res.status(200).json({ error: false, Transaction })
    } catch (err) {
      res.status(200).json({ error: true, err })
    }
  },

  async getReturnDetail() {
    try {
      
    } catch (err) {
      
    }
  },

  async createBorrow (req, res, next) {
    const satuMinggu = (24 * 60 * 60 * 1000) * 7
    const trxId = `TR${Date.now()}`
    try {
			await models.Transaction.create({
				id_transaksi: trxId,
				MemberId: req.body.memberId,
				tgl_pinjam: req.body.tgl_pinjam,
				tgl_kembali: req.body.tgl_kembali
			})

      const thisTransaction = await models.Transaction.findOne({
        order: [
          ['id', 'DESC']
        ]
      })
      const bookId = req.body.books_id
      const borrows = bookId.map(id => (
        {
          TransactionId: thisTransaction.id,
          BookId: id
        }
      ))
      for (const borrow of borrows) {
        await models.Book.decrement({ stock: 1 }, { where: { id: borrow.BookId } })
      }
      // models.Borrowing.afterBulkCreate(async (borrowings, opt) => {
      //   console.log('borrow', JSON.stringify(borrowings, null, 2));
      //   for (const borrow of borrowings) {
      //     await models.Book.decrement({ stock: 1 }, { where: { id: borrow.BookId } })
      //   }
      // })
      await models.Borrowing.bulkCreate(borrows)
      // console.log(JSON.stringify(JSON.stringify(thisTransaction, null, 2)));
      res.json({ id: thisTransaction.id_transaksi })
    } catch (err) {
      console.log(err.toString());
      res.json(err)
    }
    // try {
    //     await models.Transaction.create({
    //         transaction_id: 'ASDDG1827GD',
    //         MemberId: 1,
    //         BorrowingId: 1,
    //         Borrowing: [
    //             {
    //                 id:1,
    //                 title: 'Mencari Cinta Sejati'
    //             },
    //             {
    //                 id:12,
    //                 title: 'JAVASCRIPT DASAR'
    //             },
    //             {
    //                 id:22,
    //                 title: 'SI KANCIL PERGI KE PASA VOL 2'
    //             }
    //         ],
    //         tgl_pinjam: Date.now(),
    //         tgl_kembali: Date.now() * satuMinggu
    //     })
    //   await models.Borrowing.bulkCreate([
    //     {
    //       MemberId: 1,
    //       BookId: 1,
    //       tgl_pinjam: Date.now(),
    //       tgl_kembali: Date.now() + 86400000
    //     },
    //     {
    //       MemberId: 1,
    //       BookId: 2,
    //       tgl_pinjam: Date.now(),
    //       tgl_kembali: Date.now() + 86400000
    //     }
    //   ])
    //   await models.MemberTransaction.bulkCreate([
    //       {
    //           MemberId: 1, BorrowingId: 1
    //       },
    //       {
    //           MemberId: 2, BorrowingId: 2
    //       },
    //   ])
    //   res.end()
    // } catch (err) {
    //   console.log(err.toString())
    //   res.end()
    // }
  },

  async updateBorrow (req, res, next) {
    try {
      const dataUpdate = {
        tgl_pinjam,
        tgl_kembali,
        memberId
      }
      const bookId = req.body.books_id
      const booksUpdate = bookId.map(id => (
        {
          TransactionId: req.params.id,
          BookId: id
        }
      ))
      const update = await models.Transaction.update(dataUpdate, {
        where: { id: req.params.id }
      })
    } catch (err) {
      let errMsg = err.toString()
      let status = 500
      if (err.name === 'SequelizeUniqueConstraintError') {
        status = 200
        errMsg = 'Rak sudah ada'
      }
      res.json({ error: true, msg: errMsg })
    }
  },

  async returnBorrow (req, res, next) {
    try {
      const books = await models.Borrowing.findAll({
        where: { TransactionId: req.params.id }
      })
      for (let book of books) {
        await models.Book.increment({ stock: 1 }, { where: { id: book.BookId } })
      }
      const updateTransaction = await models.Transaction.update({
        dikembalikan: 'true'
      }, { where: { id: req.params.id } })
      const createReturn = await models.Return.create({
        TransactionId: req.params.id,
        returnAt: new Date().toISOString().substr(0, 10)
      })
      res.json({ msg: 'Sukses! Buku berhasil Dikembalikan' })
    } catch (err) {
      res.json({ error: true, msg: err.toString() })
    }
  },

  async deleteBorrow (req, res, next) {
    try {
      const books = await models.Borrowing.findAll({
        where: { TransactionId: req.params.id }
      })
      for (let book of books) {
        await models.Book.increment({ stock: 1 }, { where: { id: book.BookId } })
      }
      const deleteTransaction = await models.Transaction.destroy({
        where: { id: req.params.id }
      })
      const deleteBorrowing = await models.Borrowing.destroy({
        where: { TransactionId: req.params.id }
      })
      res.status(200).json({ msg: 'Transaksi Berhasil Dihapus' })
    } catch (err) {
      res.status(200).json({ error: true, err })
    }
  }
}

module.exports = BorrowController

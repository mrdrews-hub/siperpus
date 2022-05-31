const { models } = require('../../models')

const StockController = {

  async getStock (req, res, next) {
    try {
      const Stock = await models.Stock.findAll({
        include: [
          {
            model: models.Book
          }
        ]
      })
      res.status(200).json({ error: false, Stock })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async addStock (req, res, next) {
    try {
      const book = await models.Book.findOne({
        attributes: ['stock'],
        where: { id: req.body.bookId }
      })
      if (req.body.status === 'tambah') {
        await models.Book.increment({ stock: req.body.jumlah }, { where: { id: req.body.bookId } })
      } else if (req.body.status === 'kurangi') {
        if (req.body.jumlah > book.stock) {
          res.json({ error: true, msg: 'Stock buku tidak boleh minus' })
          return
        } else {
          await models.Book.decrement({ stock: req.body.jumlah }, { where: { id: req.body.bookId } })
        }
      } else {
        res.send(`Tidak dapat menjalankan ${req.body.status}`)
      }
      const addStock = await models.Stock.create({
        BookId: req.body.bookId,
        status: req.body.status,
        info: req.body.info,
        jumlah: req.body.jumlah
      })
      res.json({ msg: 'Berhasil Mengupdate Stock' })
    } catch (err) {
      res.status(401).json({ err })
    }
  },

  // ! Can Beres
  async editAddStock (req, res, next) {
    try {
      const book = await models.Book.findOne({
        attributes: ['stock'],
        where: { id: req.body.bookId }
      })
      const stockWillBeUpdated = await models.Stock.findOne({
        where: { id: req.params.id }
      })
      const jumlah = req.body.jumlah - stockWillBeUpdated.jumlah
      if (req.body.status === 'tambah') {
        await models.Book.increment({ stock: jumlah }, { where: { id: req.body.bookId } })
        res.json({ msg: 'Berhasil Mengupdate Stock' })
      } else if (req.body.status === 'kurangi') {
        if (req.body.jumlah > book.stock) {
          res.json({ error: true, msg: 'Stock buku tidak boleh minus' })
        } else {
          await models.Book.increment({ stock: jumlah }, { where: { id: req.body.bookId } })
          res.json({ msg: 'Stock Berhasil Dikurangi' })
        }
      } else {
        res.send(`Tidak dapat menjalankan ${req.body.status}`)
      }
      const addStock = await models.Stock.update({
        BookId: req.body.bookId,
        status: req.body.status,
        info: req.body.info,
        jumlah: req.body.jumlah
      }, { where: { id: req.params.id } })
    } catch (err) {
      res.status(401).json({ err })
    }
  },

  async deleteStock (req, res, next) {
    try {
      const stockWillBeDeleted = await models.Stock.findOne({
        where: { id: req.params.id }
      })
      if (stockWillBeDeleted.status === 'tambah') {
        await models.Book.decrement({ stock: stockWillBeDeleted.jumlah }, { where: { id: stockWillBeDeleted.BookId } })
      } else {
        await models.Book.increment({ stock: stockWillBeDeleted.jumlah }, { where: { id: stockWillBeDeleted.BookId } })
      }
      await models.Stock.destroy({
        where: { id: req.params.id }
      })
      res.json({ msg: 'Stock Berhasil Dihapus' })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

module.exports = StockController

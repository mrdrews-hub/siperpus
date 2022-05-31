const { models } = require('../../models')
const { Op } = require('sequelize')
const deleteBookImage = require('../../helpers/deleteFile')

const BookController = {

  async book (req, res, next) {
    try {
      const data = await models.Book.findOne({
        include: models.Rack,
        where: { id: req.params.id }
      })
      if (!data) {
        res.status(400).json({ error: true, msg: `Buku dengan id ${req.params.id} tidak ditemukan` })
      } else {
        res.status(200).json({ book: data })
      }
    } catch (error) {
      res.status(500).json({ error: true, msg: error.message })
    }
  },

  async getBook (req, res, next) {
    try {
      const book = await models.Book.findAll({
        include: [
          {
            model: models.Rack
          },
          {
            model: models.Categories
          },
          {
            model: models.Stock
          }
        ]
      })
      // const bookRack = await book.getRack()
      res.status(200).json({ books: book })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async createBook (req, res, next) {
    const filename = req.file ? req.file.filename : ''
    try {
      const isBookExist = await models.Book.findOne({
        where: { isbn: req.body.isbn }
      })
      // console.log(isBookExist)
      if (isBookExist) {
        deleteBookImage(filename)
        res.json({ error: true, errorPoint: 'isbn', msg: `Buku dengan ISBN ${req.body.isbn} sudah pernah diinputkan`, reference: isBookExist })
      } else {
        const { title, author, years, penerbit, isbn, info, RackId, CategoryId, stock } = req.body
        const body = {
          title,
          author,
          years,
          isbn,
          info,
          stock,
          penerbit,
          image: filename,
          RackId,
          CategoryId
        }
        const result = await models.Book.create(body)
        res.status(201).json({ msg: 'Sukses! Buku berhasil dibuat' })
      }
    } catch (err) {
      deleteBookImage(filename)
      res.status(200).json({ error: true, msg: err.toString() })
    }
  },

  async updateBook (req, res, next) {
    // res.end()
    //! jika isbn di update terus duplikat tapi gambarnya tidak diupdate
    try {
      const existBook = await models.Book.findAll({
        where: {
          [Op.or]: [{ id: req.params.id }, { isbn: req.body.isbn }]
        }
      })
      const oldBook = existBook[0]
      if (existBook.length > 1) {
        req.file === undefined ? false : deleteBookImage(req.file.filename)
        res.status(201).json({ error: true, msg: `Buku dengan ISBN ${req.body.isbn} sudah pernah diinputkan`, reference: existBook[1] })
      } else {
        const { title, author, years, penerbit, isbn, info, RackId, CategoryId, stock } = req.body
        const filename = req.file === undefined ? oldBook.image : req.file.filename
        console.log(filename);
        // const image = filename
        const result = await models.Book.update({
          title,
          author,
          years,
          penerbit,
          isbn,
          info,
          stock,
          image: filename,
          RackId,
          CategoryId
        }, {
          where: { id: req.params.id }
        })
        // deleteBookImage(oldBook.image)
        res.status(201).json({ msg: 'Buku Berhasil Di Edit' })
      }
    } catch (err) {
      res.status(202).json({ error: true, msg: err.toString() })
    }
  },

  async deleteBook (req, res, next) {
    try {
      const dataWillBeDeleted = await models.Book.findOne({
        where: { id: req.params.id }
      })
      deleteBookImage(dataWillBeDeleted.image)
      const deleteStock = await models.Stock.destroy({
        where: { BookId: req.params.id }
      })
      const response = await models.Book.destroy({
        where: { id: req.params.id }
      })
      res.status(201).json({ msg: 'Buku Berhasil Dihapus' })
    } catch (err) {
      res.status(400).send(err.toString())
    }
  }
}

module.exports = BookController

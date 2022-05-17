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
        res.status(200).json({ error: false, book: data })
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
          }
        ]
      })
      // const bookRack = await book.getRack()
      res.status(200).json({ error: false, books: book })
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
        const { title, author, years, isbn, info, RackId, CategoryId } = req.body
        const body = {
          title,
          author,
          years,
          isbn,
          info,
          image: filename,
          RackId,
          CategoryId
        }
        const result = await models.Book.create(body)
        res.status(201).json({ error: false, msg: 'Sukses! Buku berhasil dibuat' })
      }
    } catch (err) {
      deleteBookImage(filename)
      res.status(200).json({ error: true, msg: err.toString() })
    }
  },

  async updateBook (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    // res.end()
    try {
      const existBook = await models.Book.findAll({
        where: {
          [Op.or]: [{ id: req.params.id }, { isbn: req.body.isbn }]
        }
      })
      const oldBook = existBook[0]
      const bookWillBeEdited = req.body
      const bookExist = existBook[1] || null
      const filename = req.file ? req.file.filename : oldBook.image
      if (bookExist !== null) {
        deleteBookImage(req.file.filename)
        res.json({ error: true, msg: 'Buku Sudah Ada' })
      } else {
        const { title, author, years, isbn, info, RackId, CategoryId } = req.body
        // const image = filename
        const result = await models.Book.update({
          title,
          author,
          years,
          isbn,
          info,
          RackId,
          CategoryId,
          image: filename
        }, {
          where: { id: req.params.id }
        })
        // deleteBookImage(oldBook.image)
        res.send('EDIT OKE')
      }
    } catch (err) {
      res.status(200).send(err.toString())
    }
  },

  async deleteBook (req, res, next) {
    try {
      const dataWillBeDeleted = await models.Book.findOne({
        where: { id: req.params.id }
      })
      deleteBookImage(dataWillBeDeleted.image)
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

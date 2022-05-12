const { models } = require('../../models')
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
    console.log(process.cwd())
    try {
      const book = await models.Book.findAll({
        include: models.Rack
      })
      // const bookRack = await book.getRack()
      res.status(200).json({ error: false, books: book })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async getImage (req, res, next) {
    try {
      let urltoimage = process.cwd() + '\\uploads\\rack\\'
      if (req.params.image === undefined) {
        urltoimage += 'diary.png'
      } else {
        urltoimage += req.params.image
      }
      res.sendFile(urltoimage)
    } catch (error) {
      res.status(500).json({ error: true, msg: error.toString() })
    }
  },

  async createBook (req, res, next) {
    const filename = req.file === undefined ? '' : req.file.filename
    const { code, title, author, years, isbn, info, rack } = req.body
    console.log(req.file)
    try {
      const Rack = await models.Rack.findOne({
        where: { rack }
      })
      if (Rack) {
        const body = {
          code,
          title,
          author,
          years,
          isbn,
          info,
          image: filename,
          RackId: Rack.id
        }
        const result = await models.Book.create(body)
        res.status(201).json({ error: false, msg: 'Sukses! Buku berhasil dibuat' })
      } else {
        deleteBookImage(filename)
        res.status(400).json({ error: true, msg: `Nama Rack ${rack} tidak ada` })
      }
    } catch (err) {
      // this.deleteImages(req.file.filename)
      res.status(500).json({ error: true, msg: err.toString() })
    }
  },

  async updateBook (req, res, next) {
    res.send('update Book')
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

const { models } = require('../../models')
const { Op } = require('sequelize')

const CategoriesController = {

  async getCategories (req, res, next) {
    try {
      const categories = await models.Categories.findAll({
        include: models.Book
      })
      res.status(200).json({ error: false, categories })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async createCategories (req, res, next) {
    try {
      const categoryExist = await models.Categories.findOne({
        where: { categories: req.body.categories }
      })
      if (categoryExist) {
        res.status(202).json({ error: true, msg: 'Category sudah ada' })
      } else {
        const result = await models.Categories.create({
          categories: req.body.categories,
          info: req.body.info
        })
        res.status(201).json({ error: false, msg: 'Sukses! Category berhasil dibuat' })
      }
    } catch (err) {
      res.status(401).json({ error: true, msg: err.toString() })
    }
  },

  async updateCategories (req, res, next) {
    try {
      // fungsi ini akan mengembalikan 1 buah array jika request update categories tidak ada yang sama
      const checkDuplicateCategories = await models.Categories.findAll({
        where: {
          [Op.or]: [{ id: req.params.id }, { categories: req.body.categories }]
        }
      })
      if (checkDuplicateCategories.length > 1) {
        res.json({ error: true, msg: 'Category Sudah Ada' })
      } else {
        const response = await models.Categories.update(req.body, { where: { id: req.params.id } })
        res.status(201).json({ error: false, msg: 'Category berhasil di update' })
      }
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

  async deleteCategories (req, res, next) {
    try {
      const response = await models.Categories.destroy({
        where: { id: req.params.id }
      })
      res.status(200).json({ msg: 'Categories Berhasil Dihapus' })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

module.exports = CategoriesController

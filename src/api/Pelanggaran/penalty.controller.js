const { models } = require('../../models')

const PenaltiesController = {

  async getPenalties (req, res, next) {
    try {
      const penalties = await models.Penalty.findAll({
        include: models.Member
      })
      res.status(200).json({ error: false, penalties })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async getPenaltiesDetail (req, res, next) {
    try {
      const penalties = await models.Penalty.findOne({
        where: { id: req.params.id }
      })
      res.json({ error: false, penalties })
    } catch (err) {
      res.status(200).json({ error: true, msg: err.toString() })
    }
  },

  async createPenalties (req, res, next) {
    try {
      const { MemberId, jenis, denda } = req.body
      const result = await models.Penalty.create({
        MemberId,
        jenis,
        denda
      })
      res.status(201).json({ error: false, msg: 'Sukses! Pelanggaran berhasil dibuat' })
    } catch (err) {
      res.status(401).json({ error: true, msg: err.toString() })
    }
  },

  async updatePenalties (req, res, next) {
    try {
      const response = await models.Penalty.update(req.body, { where: { id: req.params.id } })
      res.status(201).json({ error: false, msg: 'Penalty berhasil di update' })
    } catch (err) {
      res.json({ error: true, err })
    }
  },

  async deletePenalty (req, res, next) {
    try {
      const response = await models.Penalty.destroy({
        where: { id: req.params.id }
      })
      res.status(200).json({ msg: 'Penalty Berhasil Dihapus' })
    } catch (err) {
      res.json({ error: true, msg: err })
    }
  }
}

module.exports = PenaltiesController
const { models } = require('../../models')
const { Op } = require('sequelize')

const ReportController = {

  async getReportPeminjaman (req, res, next) {
    const { tgl_mulai, tgl_akhir } = req.body
    try {
      const dataPeminjaman = await models.Transaction.findAll({
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
          tgl_pinjam: { [Op.between]: [tgl_mulai, tgl_akhir] }
        }
      })
      res.json(dataPeminjaman)
    } catch (err) {
      res.json(err)
    }
  },
  async getReportBuku (req, res, next) {
    const { tgl_mulai, tgl_akhir } = req.body
    try {
      const dataBuku = await models.Book.findAll({
        where: {
          createdAt: { [Op.between]: [tgl_mulai, tgl_akhir] }
        }
      })
      res.json(dataBuku)
    } catch (err) {
      res.json(err)
    }
  },

  async getReportMember (req, res, next) {
    const { tgl_mulai, tgl_akhir } = req.body
    console.log(tgl_mulai);
    console.log(tgl_akhir);
    try {
      const dataMember = await models.Member.findAll({
        where: {
          createdAt: { [Op.between]: [tgl_mulai, tgl_akhir] }
        }
      })
      res.json(dataMember)
    } catch (err) {
      res.json(err)
    }
  },

  async getReportPelanggaran () {
    try {
            
    } catch (err) {
            
    }
  }
}

module.exports =  ReportController
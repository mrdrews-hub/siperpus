const { models } = require('../../models')

class RackController {
  /**
     * @public
     */

  static async getRack (req, res, next) {
    try {
      const rack = await models.Rack.findAll()
      res.status(200).json({ error: false, rack })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  }

  static async createRack (req, res, next) {
    try {
      const rackExist = await models.Rack.findOne({
        where: { rack: req.body.rack }
      })
      if (rackExist) {
        res.status(400).json({ error: true, msg: 'Rak sudah ada' })
      } else {
        const result = await models.Rack.create({
          rack: req.body.rack,
          info: req.body.info
        })
        res.status(201).json({ error: false, msg: 'Sukses! Rack berhasil dibuat' })
      }
    } catch (err) {
      res.status(401).json({ error: true, msg: err.toString() })
    }
  }

  static async updateRack (req, res, next) {
    // let rack = req.body.rack
    // cek apakah naama rak sudah ada //if rack exist
    // jika ada apakah sama dengan req.body.rack
    // jika sama lanjut update //if rackexist == requset.rack then update
    // jika beda cek apakah sama dengan yang sudah ada
    // jika beda update else if
    // jika sama jangan update
    // ! JIKA RAK === ''
    try {
      if (req.body.rack === '') {
        const rackExist = await models.Rack.findOne({
          where: { rack: req.body.rack }
        })
        if (rackExist && rackExist.rack === req.body.rack) {
          const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
          res.status(201).json({ error: false, msg: 'Success! Rack Updated' })
        } else if (rackExist === null) {
          const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
          res.status(201).json({ error: false, msg: 'Success! Rack Updated' })
        } else {
          res.status(500).json({ error: true, msg: 'Rak sudah ada' })
        }
      } else {
        res.status(400).json({ error: true, msg: "Rak tidak boleh kosong" })
      }
      // if (rackExist && rackExist.rack) {
      //   const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
      //   res.json({ error: false, msg: 'Success! Rack Updated' })
      // } else {
      //   res.status(400).json({ error: true, msg: 'Rak sudah ada' })
      // }
    } catch (err) {
      let errMsg = err.toString()
      if (err.name === 'SequelizeUniqueConstraintError') {
        errMsg = 'Rak sudah ada '
      }
      res.status(500).json({error: true, err: errMsg })
    }
  }

  static async deleteRack (req, res, next) {
    try {
      const response = await models.Rack.destroy({
        where: { id: req.params.id }
      })
      res.status(200).json({ msg: 'Rack Berhasil Dihapus' })
    } catch (err) {
      res.status(400).send(err.message)
    }
  }
}

module.exports = RackController

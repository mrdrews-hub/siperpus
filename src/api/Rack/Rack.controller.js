const { models } = require('../../models')

const RackController = {

  async getRack (req, res, next) {
    try {
      const rack = await models.Rack.findAll({
        order: [
          ['rack', 'ASC']
        ]
      })
      res.status(200).json({ error: false, rack })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.message })
    }
  },

  async getRackDetail (req, res, next) {
    try {
      const rack = await models.Rack.findOne({
        where: { id: req.params.id }
      })
      res.json({ error: false, rack })
    } catch (err) {
      res.status(500).json({ error: true, msg: err.toString() })
    }
  },

  async createRack (req, res, next) {
    try {
      const rackExist = await models.Rack.findOne({
        where: { rack: req.body.rack }
      })
      if (rackExist) {
        res.status(202).json({ error: true, msg: 'Rak sudah ada' })
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
  },

  async updateRack (req, res, next) {
    if (req.body.rack !== '') {
      const rackExist = await models.Rack.findOne({
        where: { id: req.params.id }
      })
      if (rackExist) {
        try {
          const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
          res.status(201).json({ error: false, msg: 'Rak berhasil di update' })
          // if (rackExist.rack === req.body.rack) {
          //   console.log(req.body.rack)
          //   const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
          //   res.status(201).json({ error: false, msg: 'Success! Rack Updated' })
          // } else if (rackExist === null) {
          //   const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
          //   res.status(201).json({ error: false, msg: 'Success! Rack Updated' })
          // } else {
          //   res.status(500).send('rak sudah ada')
          // }
        } catch (err) {
          let errMsg = err.toString()
          let status = 500
          if (err.name === 'SequelizeUniqueConstraintError') {
            status = 200
            errMsg = 'Rak sudah ada'
          }
          res.json({ error: true, msg: errMsg })
        }
      } else {
        res.status(202).json({ error: true, msg: 'Tidak dapat mengupdate rak yang diinginkan' })
      }
    } else {
      res.json({ error: true, msg: 'tidak boleh kosong' })
    }
    // try {
    //   if (req.body.rack !== '') {
    //     if (rackExist || rackExist.rack === req.body.rack) {
    //       const response = await models.Rack.update(req.body, { where: { id: req.params.id } })
    //       res.status(201).json({ error: false, msg: 'Success! Rack Updated' })
    //     } else {
    //       res.status(500).json('rak sudah ada')
    //     }
    //   } else {
    //     res.status(400).json({ error: true, msg: 'Rak tidak boleh kosong' })
    //   }
    // } catch (err) {
    //   let errMsg = err.toString()
    //   if (err.name === 'SequelizeUniqueConstraintError') {
    //     errMsg = 'Rak sudah ada'
    //   }
    //   res.status(500).json({ error: true, err: errMsg })
    // }
  },

  async deleteRack (req, res, next) {
    try {
      const response = await models.Rack.destroy({
        where: { id: req.params.id }
      })
      res.status(200).json({ msg: 'Rack Berhasil Dihapus' })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

module.exports = RackController

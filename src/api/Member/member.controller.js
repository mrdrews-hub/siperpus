const { models } = require('../../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const MemberController = {

  async getMember (req, res, next) {
    try {
      const data = await models.Member.findAll({
        include: [
          { model: models.Transaction }
        ]
      })
      res.json({ members: data })
    } catch (err) {
      res.json({ error: true, msg: err.toString() })
    }
  },

  async getDetailMember (req, res, next) {
    try {
      const data = await models.Member.findOne({
        where: { member_id: req.params.id }
      })
      res.json({ data })
    } catch (err) {
      res.json({ error: true, msg: err.toString() })
    }
  },

  async memberLogin (req, res, next) {
    const userExist = await models.Member.findOne({ where: { nisn: req.body.nisn } })
    if (userExist) {
      const checkPassword = userExist.password === req.body.password
      if (checkPassword) {
        const token = jwt.sign({
          username: userExist.username,
          email: userExist.email,
          role: 'member'
        }, config.jwt_secret )
        res.header('auth-token').json({
          msg: 'Login Sukses',
          token,
          userLogin: {
            ...userExist
          }
        })
      } else {
        res.status(401).json({ error: true, msg: 'Password salah' })
      }
    } else {
      res.status(401).json({ error: true, msg: 'Email atau password salah' })
    }
  },

  async createMember (req, res, next) {
    function generateId () {
      return Math.floor(Math.random() * 9999)
    }
    let uid = `MBR-${generateId()}`
    try {
      const isExist = await models.Member.findOne({
        where: { member_id: uid }
      })
      if (isExist) {
        uid = `MBR-${generateId()}`
      } else {
        const { nisn, nama, kelas, alamat, no_hp, tempat, tanggal_lahir, password } = req.body
        let userPassword
        if (password === '' || password === null) {
          userPassword = nisn
        } else {
          userPassword = password
        }
        const response = await models.Member.create({
          member_id: uid,
          nisn,
          nama,
          kelas,
          alamat,
          no_hp,
          tempat,
          tanggal_lahir,
          password: userPassword
        })
        res.json({ msg: 'Member Berhasil Dibuat' })
      }
    } catch (err) {
      res.json({ msg: err.toString(), err })
    }
  },

  async updateMember (req, res, next) {
    try {
      const { nama, kelas, alamat, no_hp } = req.body
      const response = await models.Member.update({
        nama,
        kelas,
        alamat,
        no_hp,
      }, { where: { id: req.params.id } })
      res.json({ msg: 'Member Berhasil DiEdit' })
    } catch (err) {
      res.json({ msg: err.toString() })
    }
  },

  async deleteMember (req, res, next) {
    try {
      const response = await models.Member.destroy({
        where: { id: req.params.id }
      })
      res.status(200).json({ msg: 'Member Berhasil Dihapus' })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

}

module.exports = MemberController

/* Genereate Custom Unique ID 
function generateId(){
  return Math.floor(Math.random() * 9999)
}
let uid = generateId()

const IdExist = await Member.findOne({
  where: { member_id: uid }
})

if(idExist){
  uid = generateId()
} else {
  const response = await Member.create({
    member_id: uid,
  })
}

let
1.Check Di database apakah ada member id sebelumnya
  > jika tidak maka member_id = MBR0001
  > tapi jika ada maka 

*/
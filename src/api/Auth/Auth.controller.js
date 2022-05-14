// const Auth = require('../../models/auth.model')
// const models = require('../../models')
const { models } = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
class AuthController {
  /**
     * @public
     */
  static async register (req, res, next) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const userExist = await models.Auth.findOne({ where: { email: req.body.email } })
    try {
      if (userExist) {
        return res.status(400).json({ error: true, msg: 'email sudah digunakan' })
      }
      const savedUser = await models.Auth.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role
      })
      return res.status(201).json({ error: false, msg: 'Success! User Created' })
    } catch (err) {
      return res.status(403).json({ error: true, msg: err.message })
    }
  }

  static async login (req, res, next) {
    const userExist = await models.Auth.findOne({ where: { email: req.body.email } })
    if (userExist) {
      const checkPassword = bcrypt.compareSync(req.body.password, userExist.password)
      if (checkPassword) {
        const token = jwt.sign({
          username: userExist.username,
          email: userExist.email,
          role: userExist.role
        }, config.jwt_secret, { expiresIn: '60' })
        res.header('auth-token').json({ msg: 'Login Sukses', token })
      } else {
        res.status(401).json({ error: true, msg: 'Password salah' })
      }
    } else {
      res.status(401).json({ error: true, msg: 'Email atau password salah' })
    }
  }

  static async allUsers (req, res, next) {
    try {
      const users = await models.Auth.findAll()
      res.json(users)
    } catch (err) {
      res.send(err.message)
    }
  }

  static async deleteUser (req, res, next) {
    try {
      const response = await models.Auth.destroy({
        where: { id: req.params.id }
      })
      res.json({ msg: 'User Berhasil Dihapus' })
    } catch (err) {
      res.send(err.message)
    }
  }

  static async editUser (req, res, next) {
    try {
      const user = await models.Auth.findOne({ where: { id: req.body.id } })
      let password
      if (req.body.password === '') {
        password = user.password
      } else {
        const salt = bcrypt.genSaltSync(10)
        password = bcrypt.hashSync(req.body.password, salt)
      }
      const response = await models.Auth.update({
        username: req.body.username,
        email: req.body.email,
        password,
        role: req.body.role
      }, { where: { id: req.body.id } })
      res.json({ error: false, msg: 'Success! User Updated' })
    } catch (err) {
      res.json({ error: true, msg: err })
    }
  }
}
module.exports = AuthController

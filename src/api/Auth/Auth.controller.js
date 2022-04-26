const Auth = require('../../models/auth.model')
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
    const userExist = await Auth.findOne({ where: { email: req.body.email } })
    try {
      if (userExist) {
        return res.status(202).json({ msg: 'email sudah digunakan' })
      }
      const savedUser = await Auth.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role
      })
      return res.status(201).json({ msg: 'Success! User Created' })
    } catch (err) {
      return res.status(403).json({ msg: err.message})
    }
  }

  static async login (req, res, next) {
    const userExist = await Auth.findOne({ where: { email: req.body.email } })
    if (userExist) {
      const checkPassword = bcrypt.compareSync(req.body.password, userExist.password)
      if (checkPassword) {
        const token = jwt.sign({
          username: userExist.username,
          email: userExist.email,
          role: userExist.role
        }, config.jwt_secret)
        return res.header('auth-token').json({ msg: 'Login Sukses', token })
      } else {
        return res.status(401).json({ error: true, msg: 'Password salah' })
      }
    } else {
      res.status(401).json({ error: true, msg: 'Email atau password salah' })
    }
  }

  static async allUsers (req, res, next) {
    try {
      const users = await Auth.findAll()
      res.json(users)
    } catch (err) {
      res.send(err.message)
    }
  }
}
module.exports = AuthController

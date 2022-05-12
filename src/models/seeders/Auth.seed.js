const bcrypt = require('bcryptjs')

async function seeder (sequelize) {
  const { Auth } = sequelize.models
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync('root123', salt)
  try {
    const root = await Auth.create({
      username: 'root',
      email: 'super@root.com',
      password: hash,
      role: 'root'
    })
    const admin = await Auth.create({
      username: 'admin',
      email: 'super@admin.com',
      password: hash,
      role: 'admin'
    })
    console.log('Seeder OK')
  } catch (err) {
    console.log('Seeder Error ' + err.toString())
  }
}
module.exports = { seeder }

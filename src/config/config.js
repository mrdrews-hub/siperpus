require('dotenv').config()

const config = {
    port: process.env.PORT || 5000,
    db:{
        name: process.env.DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    }
}

module.exports = config
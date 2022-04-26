const jwt = require('jsonwebtoken')
const  config = require('../config/config');

module.exports = (req,res,next) => {
    const token = req.header('auth-token')
    if(!token) {
        return res.status(401).send('invalid token')
    }
    
    try {
        const result = jwt.verify(token, config.jwt_secret)
        req.user = result
        next()
    } catch (err) {
        res.status(401).send('Token is invalid or expired')
    }
}
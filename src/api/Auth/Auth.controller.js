const Auth = require('../../models/auth.model')

class AuthController{
    /**
     * @public
     */
    static async register(req,res,next){
        const savedUser = await Auth.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        res.send(savedUser)
    }
}
module.exports = AuthController
class BookController {
    /**
     * public
     */
    static getBook(req,res,next){
        res.send('Get All Book')
    }
}

module.exports = BookController
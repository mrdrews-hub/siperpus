class BookController {
  /**
     * @public
     */
  static getBook (req, res, next) {
    res.send('Get All Book')
  }

  static createBook (req, res, next) {
    res.send('create book')
  }

  static updateBook (req, res, next) {
    res.send('update Book')
  }

  static deleteBook (req, res, next) {
    res.send('delete Book')
  }
}

module.exports = BookController

const router = require('express').Router()
const BookController = require('./book.controller')
// const multer = require('multer')
// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now()
//     cb(null, 'book_' + uniqueSuffix + file.originalname)
//   }
// })
// const upload = multer({
//   storage: diskStorage,
//   limits: { fileSize: 2 * 1000 * 1000 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
//       return cb(new Error(' File harus berupa gambar'), false)
//     }
//     cb(null, true)
//   }
// }).single('bookImage')

// ! WARNING
// ! JIKA DI CONTROLLER ADA ERROR GAMBAR TETAP BERHASIL TERUPLOAD
// SOLUSI: DI CONTROLLER BISA DIHAPUS DENGAN SESUAI FILE YANG TERUPLOAD

router.get('/', BookController.getBook)
router.get('/:id', BookController.book)
router.post('/create', BookController.createBook)
router.put('/edit/:id', BookController.updateBook)
router.delete('/delete/:id', BookController.deleteBook)

module.exports = router

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const APIroutes = require('./api/routes')

const app = express()

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueImageName = Date.now() + file.originalname
    cb(null, uniqueImageName)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg') {
    cb(null, true)
  } else {
    cb(new Error('File harus berupa gambar'), false)
  }
}
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(multer({
  storage: diskStorage,
  limits: { fileSize: 2 * 1000 * 1000 },
  fileFilter: fileFilter
}).single('image'))
app.use('/images', express.static(path.join(__dirname, '../uploads')))
app.use('/api', APIroutes)

module.exports = app

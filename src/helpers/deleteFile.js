const fs = require('fs')
const path = require('path')

function deleteBookImage (filename) {
  let urltoimage = path.join(__dirname, '../../uploads/')
  if (filename) {
    urltoimage += filename
    fs.rmSync(urltoimage)
  } else {
    return false
  }
}
module.exports = deleteBookImage

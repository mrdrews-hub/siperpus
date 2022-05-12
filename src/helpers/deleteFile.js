const fs = require('fs')

function deleteBookImage (filename) {
  let urltoimage = process.cwd() + '\\uploads\\'
  if (filename) {
    urltoimage += filename
    fs.rmSync(urltoimage)
  } else {
    return false
  }
}
module.exports = deleteBookImage

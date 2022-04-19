require('dotenv').config()
const express = require('express')
const routes = require('./src/api/routes')
const app = express()

app.use('/api', routes)
app.listen(process.env.PORT, () => {
    console.log("Server OKE");
})
const express = require('express')
const app = express()
const port = 5000
const db = require('../db/query')


app.get('/', (req, res) => {
  res.send('Hello World!')
  // db.check()
})

app.get('/reviews/meta', (req, res) => {
  console.log(req.body)
  res.send('Test went in')
  db.check()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express')
const app = express()
const port = 5000
const db = require('../db/query')

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
  res.send('Home page /')
})

app.get('/reviews/meta', (req, res) => {
  const url = new URL(`http://localhost:5000${req.url}`);
  const urlParams = new URLSearchParams(url.search);
  const productId = urlParams.get('product_id');
  db.getMeta(productId, res);
})

app.get('/create', (req, res) => {
  db.updateRating(res);
  // db.getMeta(productId);
  // res.send('maybe created?');
})


app.get('/reviews/', (req, res) => {
  const url = new URL(`http://localhost:5000${req.url}`);
  const urlParams = new URLSearchParams(url.search);
  const page = parseInt(urlParams.get('page'));
  const count = parseInt(urlParams.get('count'));
  const sort = urlParams.get('sort');
  const product_id = parseInt(urlParams.get('product_id'));
  db.getList(page, count, sort, product_id, res);
  // res.send('Test went in /reviews/');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
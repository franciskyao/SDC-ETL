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

app.get('/reviews/', (req, res) => {
  const url = new URL(`http://localhost:5000${req.url}`);
  const urlParams = new URLSearchParams(url.search);
  const page = parseInt(urlParams.get('page'));
  const count = parseInt(urlParams.get('count'));
  const sort = urlParams.get('sort');
  const product_id = parseInt(urlParams.get('product_id'));
  db.getList(page, count, sort, product_id, res);
})

app.post('/reviews', (req, res) => {
  db.postReview(req, res);
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  let review_id = parseInt(req.url.slice(9, req.url.indexOf('/', 9)));
  db.putHelpful(review_id, res);
})

app.put('/reviews/:review_id/report', (req, res) => {
  let review_id = parseInt(req.url.slice(9, req.url.indexOf('/', 9)));
  db.putReport(review_id, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool ({
  user: `${process.env.PGuser}`,
  password: `${process.env.PGpassword}`,
  host: `${process.env.PGhost}`,
  database: `${process.env.PGdatabase}`,
  port: 5432,
})

const getList = function(page, count, sort, id, res) {
  const pageStart = page * count;
  const pageEnd = pageStart + count;
  let sortQ = null;
  if (sort === 'newest') {
    sortQ = 'review_id DESC';
  } else if (sort === 'helpful') {
    sortQ = 'helpfulness DESC';
  } else {
    sortQ = 'recommend DESC';
  }
  const queryString = `SELECT * FROM reviews WHERE product = ${id} AND review_id BETWEEN ${pageStart} AND ${pageEnd} AND reported = false ORDER BY ${sortQ}`;

  const reviewResponse = {}
  reviewResponse.product = id.toString();
  reviewResponse.page = page;
  reviewResponse.count = count;

  pool.query(queryString)
    .then((results) => {
      reviewResponse.results = results.rows;

      return results.rows.map((review) => (
        pool.query(`SELECT id, photo_url from review_photos WHERE id = ${review.review_id}`)
      ))
    })
    .then((mapPromise) => Promise.all(mapPromise))
    .then((photos) => {
      photos.forEach((result, i) => {
        reviewResponse.results[i].photos = result.rows.slice()
      })
      return reviewResponse;
    })
    .then(() => {
      res.status(200);
      res.send(reviewResponse)
    })
}

const getMeta = function(id, res) {
  const meta = {
    product_id: id,
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    recommended: {
      0: 0,
      1: 0,
    },
    characteristics: {
    }
  }

  pool.query(`SELECT * FROM reviews WHERE product = ${id}`)
    .then((results) => {
      return results.rows.map((row, i) => {
        meta.ratings[`${row.rating}`]++;
        if (row.recommend === false) {
          meta.recommended['0']++;
        } else if (row.recommend === true) {
          meta.recommended['1']++;
        }
        return pool.query(`SELECT * FROM characteristics_reviews
          JOIN characteristics ON characteristics_reviews.characteristic_id = characteristics.id AND characteristics_reviews.review_id = ${row.review_id}`)
      })
    })
    .catch((err) => console.log(err))
    .then((results2) => Promise.all(results2))
    .catch((err) => console.log(err))
    .then((resultsChar) => {
      resultsChar.forEach((characteristic, i) => {
        const char = characteristic.rows[0];
        if (!meta.characteristics[char.characteristic_name]) {
          meta.characteristics[char.characteristic_name] = {
            id: char.id,
            value: char.characteristic_value,
            count: 1,
          }
        } else {
          meta.characteristics[char.characteristic_name].count++;
          meta.characteristics[char.characteristic_name].value += char.characteristic_value;
        }
      })
      Object.keys(meta.characteristics).forEach((char) => {
        meta.characteristics[char].value = meta.characteristics[char].value / meta.characteristics[char].count;
        delete meta.characteristics[char].count;
      })
      res.status(200);
      res.send(meta)
    })
    .catch((err) => console.log(err))
}

const postReview = function (req, res) {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristic } = req.body;
  const reported = false;
  const date = new Date();
  const response = null;
  const date_created = date.getTime();
  const helpfulness = 0;
  const reviewsQ = `INSERT INTO reviews (product, rating, date_created, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, ${date_created}, '${summary}', '${body}', ${recommend}, ${reported}, '${name}', '${email}', ${response}, ${helpfulness})`;

  pool.connect()
    .then(() => {
      pool.query(reviewsQ)
        .then((result) => console.log('Post success'))
        .catch((err) => console.log('Post failed'))

      if (photos) {
        photos.forEach(photo => {
          const photosQ = `INSERT INTO review_photos (review_id, photo_url) VALUES ((SELECT max(id) FROM characteristics_reviews)), '${photo}')`;
          pool.connect()
            .then(() => pool.query(photosQ))
        })
      }
      res.status(201);
      res.send('CREATED')
    })
}

const putHelpful = function(review_id, res) {
  pool.connect()
    .then(() => pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${review_id}`))
    .then((success) => {
      res.status(204);
      res.send('NO CONTENT')
    })
    .catch((err) => console.log('Failed to update helpfulness'))
}

const putReport = function(review_id, res) {
  pool.connect()
    .then(() => pool.query(`UPDATE reviews SET reported = true WHERE review_id = ${review_id}`))
    .then((success) => {
      res.status(204);
      res.send('NO CONTENT')
    })
    .catch((err) => console.log('Failed to update helpfulness'))
}

module.exports.getList = getList;
module.exports.getMeta = getMeta;
module.exports.postReview = postReview;
module.exports.putHelpful = putHelpful;
module.exports.putReport = putReport;
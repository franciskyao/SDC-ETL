const { Pool } = require('pg')

const pool = new Pool ({
  user: 'postgres',
  password: '1sdcAragorn',
  host: 'localhost',
  database: 'sdc',
  port: 5432,
})


const getList = function(page, count, sort, id, res) {
  const pageStart = page * count;
  const pageEnd = pageStart + count;
  const queryString = `SELECT * from reviews WHERE product = ${id} AND review_id BETWEEN ${pageStart} AND ${pageEnd}`
  pool.connect()
    .then(() => pool.query(queryString))
    .then((results) => {
      const resultObj = {}
      resultObj.product = id.toString();
      resultObj.page = page;
      resultObj.count = count;
      resultObj.results = results.rows;
      //maybe join
      resultObj.results.forEach((review) => {
        const photoQuery = `SELECT id, photo_url from review_photos WHERE id = ${review.review_id}`
        pool.query(photoQuery)
          .then((photos) => {
            review.photos = photos.rows
          })
      })
      res.send(resultObj);
    })
}

// const getMeta = function(id, res) {
//   const meta = {
//     product_id: id,
//     ratings: {
//       1: 0,
//       2: 0,
//       3: 0,
//       4: 0,
//       5: 0,
//     },
//     recommended: {
//       0: 0,
//       1: 0,
//     },
//     characteristics: {
//     }
//   }
//   pool.connect()
//     .then(() => {
//       pool.query(`SELECT * FROM reviews WHERE product = ${id}`)
//         .then((results) => {
//           results.rows.forEach((row) => {
//             meta.ratings[`${row.rating}`]++;
//             if (row.recommend === false) {
//               meta.recommended['0']++;
//             } else if (row.recommend === true) {
//               meta.recommended['1']++;
//             }
//             const joinQ = `
//             SELECT * FROM characteristics_reviews
//             JOIN characteristics
//               ON characteristics_reviews.characteristic_id = characteristics.id AND characteristics_reviews.review_id = ${row.review_id}`
//             pool.query(joinQ)
//               .then((results) => {
//                 results.rows.forEach((row) => {
                  // if (!meta.characteristics[row.characteristic_name]) {
                  //   meta.characteristics[row.characteristic_name] = {
                  //     id: row.id,
                  //     value: row.characteristic_value,
                  //     count: 1,
                  //   }
                  // } else {
                  //   meta.characteristics[row.characteristic_name].value = meta.characteristics[row.characteristic_name].value + row.characteristic_value;
                  //   meta.characteristics[row.characteristic_name].count++;
//                   }
//                 })
//               })
//               .then(() => {
//                 console.log(meta.characteristics)
//                 // console.log(meta)
//               })
//               .catch((err) => {
//                 console.log(err);
//               })
//           })
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     })
//     .catch((err) => {
//       console.log(err);
//     })
// }

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

  let reviewsResult;
  pool.connect()
    .then(() => pool.query(`SELECT * FROM reviews WHERE product = ${id}`))
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
    .then((results2) => Promise.all(results2))
    .then((resultsChar) => {
      resultsChar.forEach((characteristic) => {
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

      res.send(meta)
    })
}

const updateRating = function (res) {
  // cap =5774952
  // const first = 1;
  // const last = 500000;
  // const first = 500001;
  // const last = 1000000;
  // const first = 1000001;
  pool.connect()
    // .then(() => pool.query(`SELECT product, rating FROM reviews`))
    .then(() => pool.query(`SELECT product, rating FROM reviews WHERE review_id >= ${first} and review_id <= ${last}`))
    .then((results) => {
      results.rows.forEach((row, i) => {
        const qString = `INSERT INTO ratings (product_id, r_${row.rating})
        VALUES (${row.product}, 1)
        ON CONFLICT (product_id) DO UPDATE
        SET r_${row.rating} = ratings.r_${row.rating} + 1`
        pool.query(qString)
        .then((success) => {
          console.log('Successfully updated rating', i)
        })
        .catch((err) => {
          console.log('error in updating values')
        })
      })
    })
  .then(() => res.end(''))
  .catch((err) => {
    console.log('error')
  })
}

module.exports.getList = getList;
module.exports.getMeta = getMeta;
module.exports.updateRating = updateRating;
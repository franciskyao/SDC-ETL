CREATE TABLE reviews (
  id INT NOT NULL PRIMARY KEY,
  product_id INT UNIQUE NOT NULL,
  rating INT,
  date_created INT,
  summary VARCHAR (60),
  body TEXT,
  recommend BOOLEAN.
  reported BOOLEAN,
  reviewer_name TEXT,
  reviewer_email TEXT,
  response TEXT,
  helpfulness INT
)

CREATE TABLE review_photos (
  id INT NOT NULL PRIMARY KEY,
  review_id NOT NULL,
  photo_url TEXT,
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
)

CREATE TABLE characteristic (
  id INT NOT NULL PRIMARY KEY,
  product_id INT,
  characteristic_name VARCHAR,
  FOREIGN KEY (product_id)
    REFERENCES reviews(product_id)
)

CREATE TABLE characteristics_review (
  id INT NOT NULL PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  value INT,
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristic (id)
)
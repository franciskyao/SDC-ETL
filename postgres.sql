CREATE DATABASE reviewsDB;
USE reviewsDB;

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

CREATE TABLE characteristics (
  id INT NOT NULL PRIMARY KEY,
  product_id INT,
  characteristic_name VARCHAR,
  FOREIGN KEY (product_id)
    REFERENCES reviews(product_id)
)

CREATE TABLE characteristics_reviews (
  id INT NOT NULL PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  characteristic_value INT,
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics (id)
)


COPY reviews(id, product_id, rating, date_created, summary, body,recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '\csv\reviews.csv'
DELIMITER ','
CSV HEADER;

COPY review_photos(id, review_id, photo_url)
FROM '\csv\review_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, characteristic_name)
FROM '\csv\characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews(id, characteristic_id, review_id, characteristic_value)
FROM '\csv\characteristics_reviews'
DELIMITER ','
CSV HEADER;
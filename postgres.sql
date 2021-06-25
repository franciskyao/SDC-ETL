CREATE DATABASE reviewsDB;
USE reviewsDB;

CREATE TABLE reviews (
  id INT,
  product_id INT NOT NULL,
  rating INT,
  date_created BIGINT,
  summary TEXT,
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name TEXT,
  reviewer_email TEXT,
  response TEXT,
  helpfulness INT,
  PRIMARY KEY (id)
);

CREATE TABLE review_photos (
  id INT,
  review_id INT,
  photo_url TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics (
  id INT,
  product_id INT,
  characteristic_name VARCHAR,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics_reviews (
  id INT,
  characteristic_id INT,
  review_id INT,
  characteristic_value INT,
  PRIMARY KEY (id)
);


COPY reviews(id, product_id, rating, date_created, summary, body,recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/franciskyao/Downloads/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY review_photos(id, review_id, photo_url)
FROM '/home/franciskyao/Downloads/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, characteristic_name)
FROM '/home/franciskyao/Downloads/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews(id, characteristic_id, review_id, characteristic_value)
FROM '/home/franciskyao/Downloads/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
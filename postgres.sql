CREATE DATABASE reviewsDB;
USE reviewsDB;

CREATE TABLE product (
  id INT,
  product_name TEXT,
  slogan TEXT,
  prod_description TEXT,
  category TEXT,
  default_price INT,
  PRIMARY KEY (id)
);

COPY product(id, product_name, slogan, prod_description, category, default_price)
FROM '/home/franciskyao/Downloads/product.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE reviews (
  review_id INT,
  product INT NOT NULL,
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
  PRIMARY KEY (review_id),
  FOREIGN KEY (product)
    REFERENCES product(id)
);

COPY reviews(review_id, product, rating, date_created, summary, body,recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/franciskyao/Downloads/reviews.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE review_photos (
  id INT,
  review_id INT,
  photo_url TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(review_id)
);

COPY review_photos(id, review_id, photo_url)
FROM '/home/franciskyao/Downloads/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE characteristics (
  id INT,
  product_id INT,
  characteristic_name VARCHAR,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
    REFERENCES product(id)
);

COPY characteristics(id, product_id, characteristic_name)
FROM '/home/franciskyao/Downloads/characteristics.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE characteristics_reviews (
  id INT,
  characteristic_id INT,
  review_id INT,
  characteristic_value INT,
  PRIMARY KEY (id),
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics(id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(review_id)
);

COPY characteristics_reviews(id, characteristic_id, review_id, characteristic_value)
FROM '/home/franciskyao/Downloads/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

DROP table ratings;

CREATE TABLE ratings (
  id SERIAL,
  product_id INT,
  r_1 INT default 0,
  r_2 INT default 0,
  r_3 INT default 0,
  r_4 INT default 0,
  r_5 INT default 0,
  UNIQUE(product_id),
  PRIMARY KEY (id)
);

DELETE FROM ratings;


INSERT INTO ratings (product_id, r_2)
VALUES (2, 1)
ON CONFLICT (product_id) DO UPDATE
SET r_2 = excluded.r_2 + 1;

INSERT INTO ratings (product_id, r_3)
VALUES (2, 1)
ON CONFLICT (product_id) DO UPDATE
SET r_3 = ratings.r_3 + 1;


SELECT * FROM characteristics_reviews
  WHERE review_id = 2
JOIN characteristics
  ON characteristics_review.characteristic_id = characteristics.id;

SELECT * FROM characteristics_reviews
JOIN characteristics
  ON characteristics_reviews.characteristic_id = characteristics.id AND characteristics.product_id = 2;

SELECT * FROM characteristics_reviews, characteristiccharacteristic_name
JOIN characteristics
  ON characteristics_reviews.characteristic_id = characteristics.id AND characteristics_reviews.review_id = 2;
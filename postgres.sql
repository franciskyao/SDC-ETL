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
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
    REFERENCES product(id)
);

COPY reviews(id, product_id, rating, date_created, summary, body,recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/franciskyao/Downloads/reviews.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE review_photos (
  id INT,
  review_id INT,
  photo_url TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
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
    REFERENCES reviews(id)
);

COPY characteristics_reviews(id, characteristic_id, review_id, characteristic_value)
FROM '/home/franciskyao/Downloads/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
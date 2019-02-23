CREATE DATABASE Bamazon;

USE Bamazon;
 CREATE TABLE products(
     item_id INTEGER(10) AUTO_INCREMENT,
     product_name VARCHAR(50),
     department_name VARCHAR(50),
     $price INTEGER,
     stock_quantity INTEGER(30)
 );
CREATE DATABASE db_emgf;

use db_emgf;

--TABLE USER
-- all password will be encrypted using SHA1
CREATE TABLE users (
    id INT(11) NOT NULL PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(16) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    phone VARCHAR(9) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    password VARCHAR(40) NOT NULL
);

--TABLE TOUR
CREATE TABLE tours (
    id INT(11) NOT NULL PRIMARY KEY AUTOINCREMENT,
    type_tour VARCHAR(20) NOT NULL,
    average_tour DECIMAL(2,2) NOT NULL,
    link VARCHAR(255),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    user_id INT(11),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
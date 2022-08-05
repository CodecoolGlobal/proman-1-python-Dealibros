-- 
-- PostgreSQL database Proman
--
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET default_tablespace = '';
SET default_with_oids = false;
---
--- drop tables
---
DROP TABLE IF EXISTS statuses_to_boards;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS columns CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;
---
--- create tables
---
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(200) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE boards (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL,
    user_id INTEGER REFERENCES users ON DELETE CASCADE DEFAULT NULL
);
CREATE TABLE columns (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL,
    board_id INT REFERENCES boards ON DELETE CASCADE
);
CREATE TABLE cards (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR (200) NOT NULL,
    card_order INTEGER NOT NULL,
    column_id INTEGER REFERENCES columns ON DELETE CASCADE
);

-- ---
-- --- insert data
-- ---
INSERT INTO boards(title)
VALUES ('Board 1');
INSERT INTO boards(title)
VALUES ('Board 2');

INSERT INTO columns(board_id, title)
VALUES (1, 'new'),
    (1, 'in progress'),
    (1, 'testing'),
    (1, 'done');

INSERT INTO columns(board_id, title)
VALUES (2, 'new'),
    (2, 'in progress'),
    (2, 'testing'),
    (2, 'done');


INSERT INTO cards(title, card_order, column_id)
VALUES ('card 1', 1, 1),
         ('card 2', 2, 2),
        ('card 3', 3, 3),
         ('card 4', 4, 4);

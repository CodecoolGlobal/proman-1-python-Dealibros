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
    user_id INTEGER REFERENCES users DEFAULT NULL
);
CREATE TABLE columns (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL,
    board_id INT REFERENCES boards
);
CREATE TABLE cards (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR (200) NOT NULL,
    card_order INTEGER NOT NULL,
    column_id INTEGER REFERENCES columns
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
         ('card 1', 2, 2),
        ('card 1', 3, 3),
         ('card 1', 4, 4);

-- INSERT INTO cards VALUES (nextval('cards_id_seq'), "new card 1", 1, 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1);
-- INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2);
---
--- add constraints
---
-- ALTER TABLE ONLY cards
--     ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);
-- ALTER TABLE ONLY cards
--     ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);
import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """, {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        JOIN columns ON columns.board_id = boards.id
        JOIN cards ON columns.id = cards.column_id
        ;
        """
    )


def get_columns():
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        ;
        """
    )

# Solving insering columns in table


def insert_created_columns(board_id, status_id):
    data_manager.execute_query(
        """
        INSERT INTO statuses_to_boards(board_id, status_id)
        VALUES (%(board_id)s, %(status_id)s)
        ;
        """, {"board_id": board_id, 'status_id': status_id})


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """, {"board_id": board_id})

    return matching_cards


def create_main_columns(board_id):
    data_manager.execute_query(
        """
            INSERT INTO columns(title, board_id)
            VALUES ('new', %(board_id)s),
                    ('in progress', %(board_id)s),
                    ('testing', %(board_id)s),
                    ('done', %(board_id)s)
            ;
            """, {'board_id': board_id})


def get_board_by_title(title):
    board = data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE title = %(title)s
        ;
        """, {"title": title}, False)
    return board


def create_new_board(title, user_id=None):
    if user_id:
        data_manager.execute_query(
            """
            INSERT INTO boards(title, user_id)
            VALUES (%(title)s, %(user_id)s)
            ;
            """, {"title": title, 'user_id': user_id})
    else:
        data_manager.execute_query(
            """
            INSERT INTO boards(title)
            VALUES (%(title)s)
            ;
            """, {"title": title})
    board = get_board_by_title(title)
    create_main_columns(board.get('id'))
    return True


def delete_board(board_id, user_id=None):
    if user_id:
        data_manager.execute_query(
            """
            DELETE FROM boards
            WHERE id = %(id)s
            ;
            """, {"id": board_id})
    else:
        data_manager.execute_query(
            """
            DELETE FROM boards
            WHERE id = %(id)s AND user_id = %(user_id)s
            ;
            """, {"id": board_id, 'user_id': user_id})
    return True


def update_board(board_id, user_id=None):
    if user_id:
        data_manager.execute_query(
            """
            UPDATE boards
            SET title = %(new_title)s WHERE id = %(id)s AND user_id = %(user_id)s
            ;
            """, {"id": board_id, "user_id": user_id})
    else:
        data_manager.execute_query(
            """
            UPDATE boards
            SET title = %(new_title)s WHERE id = %(id)s
            ;
            """, {"id": board_id})
    return True


def get_user_by_username(username):
    user = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE username = %(username)s
        ;
        """, {"username": username}, False)

    return user


def create_user(username, password):
    data_manager.execute_query(
        """
        INSERT INTO users(username, password)
        VALUES (%(username)s, %(password)s)
        ;
        """, {"username": username, "password": password})
    return True


def edit_board_title(board_id, title):
    return data_manager.execute_query ("""
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        """, {"board_id": board_id, "title": title})

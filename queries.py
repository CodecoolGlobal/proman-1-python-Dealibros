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


def get_columns_for_board(board_id):
    return data_manager.execute_select(
        """
        SELECT * 
        FROM statuses
        JOIN statuses_to_boards as stb ON statuses.id = stb.status_id
        WHERE stb.board_id = %(board_id)s
        ;
        """, {"board_id": board_id}
    )

# //on was writen like an as


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """, {"board_id": board_id})

    return matching_cards


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

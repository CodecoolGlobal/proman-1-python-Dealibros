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

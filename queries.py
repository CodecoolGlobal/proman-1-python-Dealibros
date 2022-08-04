from pickle import FALSE
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


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    if user_id:
        return data_manager.execute_select(
            """
        SELECT board_id, boards.title, boards.user_id,
        JSON_AGG(column_table) as columns
        FROM boards
        LEFT JOIN (
            SELECT board_id, columns.title, columns.id, JSON_AGG(cards ORDER BY cards.card_order) as cards
            FROM columns
            LEFT JOIN cards ON columns.id = cards.column_id
            GROUP BY columns.title, columns.id, board_id
            ORDER BY columns.id
            )
        as column_table on boards.id = column_table.board_id
        WHERE user_id IS NULL OR user_id = %(user_id)s
        GROUP BY board_id, boards.title, boards.user_id
        ORDER BY board_id
        ;
        """, {'user_id': user_id}
        )
    else:
        return data_manager.execute_select(
            """
            SELECT board_id, boards.title, boards.user_id,
            JSON_AGG(column_table) as columns
            FROM boards
            LEFT JOIN (
                SELECT board_id, columns.title, columns.id, JSON_AGG(cards ORDER BY cards.card_order) as cards
                FROM columns
                LEFT JOIN cards ON columns.id = cards.column_id
                GROUP BY columns.title, columns.id, board_id
                ORDER BY columns.id
                )
            as column_table on boards.id = column_table.board_id
            WHERE user_id IS NULL
            GROUP BY board_id, boards.title, boards.user_id
            ORDER BY board_id
            ;
            """
        )


def get_board(board_id):
    return data_manager.execute_select(
        """
        SELECT *
        FROM boards
        WHERE id = %(board_id)s
        ;
        """,
        {'board_id': board_id}, False)


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
        data_manager.execute_query("""
            DELETE FROM boards
            WHERE id = %(id)s AND user_id = %(user_id)s
            ;
            """, {"id": board_id, 'user_id': user_id})
    else:
        data_manager.execute_query(
            """
            DELETE FROM boards
            WHERE id = %(id)s
            ;
            """, {"id": board_id})
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


def create_new_column(title, board_id):
    data_manager.execute_query(
        """
        INSERT INTO columns(title, board_id)
        VALUES (%(title)s, %(board_id)s)
        ;
        """, {"title": title, 'board_id': board_id})


def get_max_card_order_for_column(column_id):
    max_order = data_manager.execute_select(
        """
        SELECT MAX(card_order)
        FROM cards
        WHERE column_id = %(column_id)s
        ;
        """, {'column_id': column_id}, False)
    return max_order


def create_new_card(title, column_id):
    max_card_order = get_max_card_order_for_column(column_id).get('max')
    if not max_card_order:
        max_card_order = 1
    data_manager.execute_query(
        """
        INSERT INTO cards(title, column_id, card_order)
        VALUES (%(title)s, %(column_id)s, %(card_order)s)
        ;
        """, {"title": title, 'column_id': column_id, 'card_order': max_card_order+1})
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
    data_manager.execute_query("""
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        """, {"board_id": board_id, "title": title})
    return True


def edit_column_title(column_id, title):
    data_manager.execute_query("""
        UPDATE columns
        SET title = %(title)s
        WHERE id = %(column_id)s
        """, {"column_id": column_id, "title": title})
    return True


def edit_card_title(card_id, title):
    data_manager.execute_query("""
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "title": title})
    return True


def get_column_id(column_id):
    return data_manager.execute_query("""
        SELECT * FROM columns c
        WHERE c.id = %(column_id)s
        ;
        """, {"column_id": column_id})
    return True


def delete_column(column_id, user_id=None):
    if user_id:
        data_manager.execute_query(
            """
            DELETE FROM boards
            WHERE id = %(id)s
            ;
            """, {"id": column_id})
    else:
        data_manager.execute_query(
            """
            DELETE FROM boards
            WHERE id = %(id)s AND user_id = %(user_id)s
            ;
            """, {"id": column_id, 'user_id': user_id})
    return True

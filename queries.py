import data_manager

# boards


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    if user_id:
        return data_manager.execute_select(
            """
        SELECT boards.id as board_id, boards.title, boards.user_id,
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
        GROUP BY boards.id, boards.title, boards.user_id
        ORDER BY boards.id
        ;
        """, {'user_id': user_id}
        )
    else:
        return data_manager.execute_select(
            """
            SELECT boards.id as board_id, boards.title, boards.user_id,
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
            GROUP BY boards.id, boards.title, boards.user_id
            ORDER BY boards.id
            ;
            """
        )


def get_board_by_id(board_id):
    return data_manager.execute_select(
        """
        SELECT *
        FROM boards
        WHERE id = %(board_id)s
        ;
        """,
        {'board_id': board_id}, False)


def get_recent_board(user_id=None):
    return data_manager.execute_select(
        """
            SELECT boards.id as board_id, boards.title, boards.user_id,
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
            GROUP BY boards.id, boards.title, boards.user_id
            ORDER BY boards.id DESC
            LIMIT 1
            ;
            """, {}, False)


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
    board = get_recent_board()
    create_main_columns_by_board_id(board.get('board_id'))
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


def edit_board_title(board_id, title):
    data_manager.execute_query("""
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        """, {"board_id": board_id, "title": title})
    return True


# columns
def get_recent_column():
    return data_manager.execute_select(
        """
            SELECT board_id, columns.title, columns.id,
            JSON_AGG(cards ORDER BY cards.card_order) as cards
            FROM columns
            LEFT JOIN cards ON columns.id = cards.column_id
            GROUP BY columns.title, columns.id, board_id
            ORDER BY columns.id DESC
            LIMIT 1
        ;
        """, {}, False)


def create_main_columns_by_board_id(board_id):
    data_manager.execute_query(
        """
            INSERT INTO columns(title, board_id)
            VALUES ('new', %(board_id)s),
                    ('in progress', %(board_id)s),
                    ('testing', %(board_id)s),
                    ('done', %(board_id)s)
            ;
            """, {'board_id': board_id})


def create_new_column(title, board_id):
    data_manager.execute_query(
        """
        INSERT INTO columns(title, board_id)
        VALUES (%(title)s, %(board_id)s)
        ;
        """, {"title": title, "board_id": board_id})
    return True


def edit_column_title(column_id, title):
    data_manager.execute_query("""
        UPDATE columns
        SET title = %(title)s
        WHERE id = %(column_id)s
        """, {"column_id": column_id, "title": title})
    return True


def delete_column(column_id):
    data_manager.execute_query(
        """
            DELETE FROM columns
            WHERE id = %(id)s
            ;
            """, {"id": column_id})
    return True


# cards
def get_recent_card():
    return data_manager.execute_select(
        """
        SELECT *
        FROM cards
        ORDER BY id DESC
        LIMIT 1
        ;
        """, {}, False)


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


def edit_card_title(card_id, title):
    data_manager.execute_query("""
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "title": title})
    return True


def edit_card_column_by_id(card_id, column_id):
    data_manager.execute_query("""
        UPDATE cards
        SET column_id = %(column_id)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "column_id": column_id})
    return True


def delete_card(card_id):
    data_manager.execute_query(
        """
            DELETE FROM cards
            WHERE id = %(id)s
            ;
            """, {"id": card_id})
    return True

# users


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

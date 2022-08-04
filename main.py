from flask import Flask, redirect, render_template, url_for, request, make_response, jsonify, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = "super secret key!"
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    try:
        username = session['user']['username']
    except Exception:
        username = False
    return render_template('index.html', username=username)


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    if 'user' in session.keys():
        data = queries.get_boards(session.get('user').get('id'))
    else:
        data = queries.get_boards()
    return data


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route('/api/boards/createBoard', methods=['POST'])
def create_new_board():
    board = request.get_json()
    if 'user' in session.keys():
        added_board = queries.create_new_board(
            board.get('title'), session.get('user').get('id'))
    else:
        added_board = queries.create_new_board(board.get('title'))
    if added_board:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/columns/createNewColumn', methods=['POST'])
def create_new_column():
    column = request.get_json()
    print(column)
    new_column = queries.create_new_column(column.get('title'), column.get('board_id'))
    if new_column:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/columns/<int:column_id>/create_new_card', methods=['POST'])
def create_new_card(column_id):
    card = request.get_json()
    create_new_card = queries.create_new_card(card.get('title'), column_id)
    if create_new_card:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/boards/<int:board_id>/edit', methods=['PATCH'])
def edit_board_title(board_id):
    board = request.get_json()
    update_board = queries.edit_board_title(board_id, board.get('title'))
    if update_board:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/columns/<int:column_id>/edit', methods=['PATCH'])
def edit_column_title(column_id):
    column = request.get_json()
    update_column = queries.edit_column_title(column_id, column.get('title'))
    if update_column:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/cards/<int:card_id>', methods=['PATCH'])
def edit_card_title(card_id):
    card = request.get_json()
    update_card = queries.edit_card_title(card_id, card.get('title'))
    if update_card:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/boards/<int:board_id>/delete', methods=['DELETE'])
def delete_board(board_id):
    board = queries.get_board(board_id)
    if board.get('user_id'):
        if 'user' in session.keys() and session.get('user').get('id') == board.get('user_id'):
            deleted_board = queries.delete_board(board_id)
    else:
        deleted_board = queries.delete_board(
            board.get('title'), board_id)
        flash('Board successfully deleted')
    if deleted_board:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


"""@app.route('/api/columns/<int:column_id>/delete', methods=['DELETE'])
def delete_column(column_id):
    column = request.get_column_id(column_id)
    if column.get('user_id'):
        if 'user' in session.keys() and session.get('user').get('id') == column.get('user_id'):
            deleted_column = queries.delete_column(
                column.get('title'), column_id)
            flash('Column successfully deleted')
    else:
        deleted_column = queries.delete_column(
            column.get('title'), column_id)
        flash('Column successfully deleted')

    if deleted_column:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response"""


@app.route("/api/columns/")
@json_response
def get_columns():
    """
    All the columns
    """
    return queries.get_columns()


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = queries.get_user_by_username(username)
        while True:
            if user:
                if check_password_hash(user['password'], password):
                    session['user'] = user
                    return jsonify(True)
                else:
                    flash('Invalid username or password')
                    return jsonify('Invalid username or password')
            else:
                flash('there is no user with that username')
                return jsonify('there is no user with that username')
    return redirect('/')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        queries.create_user(username, generate_password_hash(password))
        return jsonify(True)


@app.route('/check-if-username-exists', methods=['GET', 'POST'])
def check_if_username_exists():
    if request.method == 'POST':
        username = request.form.get('username')
        user = queries.get_user_by_username(username)
        if user:
            return {'exists': True}
        else:
            return {'exists': False}


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def main():
    app.run(debug=True)
    with app.app_context():
        app.add_url_rule(
            '/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

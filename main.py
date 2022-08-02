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
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


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


@app.route('/api/boards/<int:board_id>/update', methods=['PATCH'])
def update_board_title(board_id):
    board = request.get_json()
    update_board = queries.update_board_title(board.get('title'), board_id)
    if update_board:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route('/api/boards/<int:board_id>/delete', methods=['delete'])
def delete_board(board_id):
    board = request.get_board(board_id)
    if board.get('user_id'):
        if 'user' in session.keys() and session.get('user').get('id') == board.get('user_id'):
            deleted_board = queries.update_board_title(
                board.get('title'), board_id)
            flash('Board successfully deleted')
    else:
        deleted_board = queries.update_board_title(
            board.get('title'), board_id)
        flash('Board successfully deleted')

    if deleted_board:
        response = make_response(jsonify({"message": "ok"}), 200)
    else:
        response = make_response(jsonify({"message": "internal error"}), 500)
    return response


@app.route("/api/columns")
@json_response
def get_columns():
    return queries.get_columns()


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = queries.get_user_by_username(username)
        if user:
            if check_password_hash(user['password'], password):
                session['user'] = user
                return redirect(url_for('index'))
            else:
                flash('Invalid username or password')
                return redirect(url_for('login'))
        else:
            flash('there is no user with that username')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = queries.get_user_by_username(username)
        if user:
            flash('Username is already taken!')
        else:
            queries.create_user(username, generate_password_hash(password))
            flash('Your registration was successful, please log in.')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule(
            '/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

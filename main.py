from crypt import methods
from flask import Flask, render_template, url_for, request, make_response, jsonify
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
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


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule(
            '/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

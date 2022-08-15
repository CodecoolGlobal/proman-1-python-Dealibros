import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { columnsManager } from "./columnManager.js";


export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            this.createBoardElement(board);
        }
        this.addEventListeners();
    },
    createBoardElement: async function (board) {
        const boardBuilder = htmlFactory(htmlTemplates.board);
        const content = boardBuilder(board);
        domManager.addChildAsFirst("#root", content);
        domManager.addEventListener(`.create-column[data-board-id="${board.board_id}"]`, "click",
            (event) => columnsManager.createNewColumn(event));
        domManager.addEventListener(`.board[data-board-id="${board.board_id}"]`, "input",
            (event) => this.showEditButton(event));
        domManager.addEventListener(`.edit-board[data-board-id="${board.board_id}"]`, "click",
            (event) => editBoardTitle(event));
        domManager.addEventListener(`.delete-board[data-board-id="${board.board_id}"]`, "click",
            (event) => deleteBoard(event));
        if (board.columns) {
            columnsManager.loadColumns(board.columns);
        }
    },
    showEditButton: function (event) {
        const button = event.target.nextElementSibling;
        button.style.display = "inline";
    },
    addEventListeners: function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();
        });
    }
};


function showBoardForm() {
    document.querySelector('.titleForm').style.visibility = 'visible';
}

async function createNewBoard() {
    document.querySelector('.titleForm').style.visibility = 'hidden';
    let title = document.querySelector('#title');
    const newBoard = await dataHandler.createNewBoard(title.value);
    newBoard['board_id'] = newBoard.id;
    boardsManager.createBoardElement(newBoard);
}

async function editBoardTitle(event) {
    const title = event.target.previousElementSibling.innerHTML;
    const boardId = event.target.dataset.boardId;
    await dataHandler.editBoardTitle(title, boardId);
    event.target.style.display = 'none';
}

async function deleteBoard(event) {
    const boardId = event.target.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    document.querySelector('#root').removeChild(event.target.parentElement);
}

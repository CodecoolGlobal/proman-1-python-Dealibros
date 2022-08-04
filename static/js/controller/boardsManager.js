import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";


export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards.reverse()) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.board_id}"]`,
                "click",
                showHideButtonHandler
            );
            for (let column of board.columns) {
                const columnBuilder = htmlFactory(htmlTemplates.column);
                const column_element = columnBuilder(column)
                domManager.addChild(`.bodyboard[data-board-id="${board.board_id}"]`, column_element);
                if (column.cards.length > 0) {
                    cardsManager.loadCards(column.cards);
                }
                domManager.addEventListener(
                    `.createColumnButton[data-board-board_id="${board.board_id}"]`,
                    "click",
                    function () {
                        let title = "Unnamed"
                        createNewColumn(title, board.board_id)
                    }
                )
            }
        }
    },

    clearBoards: function () {
        let root = document.querySelector('#root');
        [...root.children].forEach((child) => root.removeChild(child));
    },
    addEventListeners: function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();
        })
        setTimeout(
            () => {
                const boards = document.querySelectorAll('.board');
                boards.forEach((child) => child.addEventListener('input', (event) => showEditButton(event)))
                //  boards.forEach((child) => child.addEventListener('input', (event) => saveEdit(event)))
                // add eventListener to save button here
                document.querySelectorAll('.edit-board').forEach((child) => child.addEventListener('click', (event) => edit_board_title(event)
                ));
                document.querySelectorAll('.delete-board').forEach((child) => child.addEventListener('click', (event) => deleteBoard(event)));

                document.querySelectorAll('.column').forEach((child) => child.addEventListener('input', (event) => showEditButton(event)));
                document.querySelectorAll('.edit-column').forEach((child) => child.addEventListener('click', (event) => editColumn(event)));
                cardsManager.addEventListeners();
                document.querySelectorAll('.add-card').forEach((child) => child.addEventListener('click', (event) => cardsManager.addCard(event)));
            }, 2000
        )
    }
};


// Create Board - Column - Card

async function createNewBoard() {
    document.querySelector('.titleForm').style.visibility = 'hidden';
    let title = document.querySelector('#title');
    await dataHandler.createNewBoard(title.value);

    boardsManager.clearBoards();
    await boardsManager.loadBoards();
    document.querySelector('#root').firstChild.querySelector('.delete-board').addEventListener('click', (event) => deleteBoard(event));
}

async function createNewColumn(title, board_id) {
    console.log("I am being clicked")
    await dataHandler.createNewColumn(title, board_id)
    boardsManager.clearBoards();
    await boardsManager.loadBoards();
    boardsManager.addEventListeners();
}


function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    //cardsManager.loadCards(boardId);
}


async function showBoardForm() {
    document.querySelector('.titleForm').style.visibility = 'visible';
}

function showEditButton(event) {
    const button = event.target.nextElementSibling;
    button.style.display = "inline";
}

async function edit_board_title(event) {
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

async function editColumn(event) {
    const title = event.target.previousElementSibling.innerHTML;
    const columnId = event.target.dataset.columnId;
    await dataHandler.editColumnTitle(columnId, title);
    event.target.style.display = 'none';
}
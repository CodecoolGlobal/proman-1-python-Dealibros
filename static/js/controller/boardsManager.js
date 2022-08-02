import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
<<<<<<< HEAD
        console.log(boards)
        const columns = await dataHandler.getStatuses();
        console.log(columns)
=======
>>>>>>> e9623fd21b89dad5c497485f2f0e1890d0b15dcf
        for (let board of boards.reverse()) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
    clearBoards: function () {
        let root = document.querySelector('#root');
        [...root.children].forEach((child) => root.removeChild(child));
    },
<<<<<<< HEAD

    addEventListeners: async function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();
        });
=======
    addEventListeners: function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();
        })
        setTimeout(
            () => {
                const boards = document.querySelectorAll('.board');
                console.log(boards);
                boards.forEach((child) => child.addEventListener('input', (event) => saveEdit(event) ))
                // add eventListener to save button here
            }, 2000
        )
>>>>>>> e9623fd21b89dad5c497485f2f0e1890d0b15dcf
    }
};

async function createNewBoard() {
    document.querySelector('.titleForm').style.visibility = 'hidden';
    let title = document.querySelector('#title');
    await dataHandler.createNewBoard(title.value);
    boardsManager.clearBoards();
    await boardsManager.loadBoards();
}

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}


async function showBoardForm() {
    document.querySelector('.titleForm').style.visibility = 'visible';
}

<<<<<<< HEAD
function showEditForm(event) {
    console.log('bla')
    console.log(event.target.dataset);
}
=======
function saveEdit(event) {
    const button = event.target.nextElementSibling;
    button.style.display = "inline";
}
>>>>>>> e9623fd21b89dad5c497485f2f0e1890d0b15dcf

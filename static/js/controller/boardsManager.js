import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        const columns = await dataHandler.getStatuses();
        console.log(columns)
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

    addEventListeners: function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();
        })
        setTimeout(
            () => {
                const boards = document.querySelectorAll('.board');
                boards.forEach((child) => child.addEventListener('input', (event) => saveEdit(event) ))
                // add eventListener to save button here
            }, 2000
        )

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


function saveEdit(event) {
    const button = event.target.nextElementSibling;
    button.style.display = "inline";
}


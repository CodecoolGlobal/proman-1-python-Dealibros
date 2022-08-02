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
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
             }
        //Create a new function? To cretae 4 columns here?
        // getStatuses should maybe be called createStatuses?
             const columns = await dataHandler.getStatuses();
             for (let column of columns) {
                 const columnBuilder = htmlFactory(htmlTemplates.column);
                 const content = columnBuilder(column);
                 domManager.addChildtoParents(".bodyboard", content); //I think is adding to only one .bodyboard?

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
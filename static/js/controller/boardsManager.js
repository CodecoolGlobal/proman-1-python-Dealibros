import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm)
        const boards = await dataHandler.getBoards();
        console.log("boards", boards)
        for (let board of boards) {
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
        [...root.children].forEach((child)=>root.removeChild(child));
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}


function showBoardForm() {
    // const newBoardForm = htmlFactory(htmlTemplates.form);
    // domManager.addChild(".boardForm", newBoardForm());
    document.querySelector('.titleForm').style.visibility = 'visible';
    domManager.addEventListener(".createBoardButton", 'click', () => {
        dataHandler.createNewBoard(document.querySelector('#title').value);
        boardsManager.clearBoards();
        boardsManager.loadBoards();
        document.querySelector('.titleForm').style.visibility = 'hidden';
    })
}

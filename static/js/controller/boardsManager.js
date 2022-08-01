import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm)
        const boards = await dataHandler.getBoards();
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
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}


function showBoardForm() {
    const newBoardForm = htmlFactory(htmlTemplates.form);
    domManager.addChild(".boardForm", newBoardForm());
    domManager.addEventListener(".formBuilderButton", 'click', () => {
        console.log("Yup2");
        console.log(document.querySelector('#title').value)
        dataHandler.createNewBoard(document.querySelector('#title').value);
        console.log("Yup3");
    })
    console.log("Yup4");
}

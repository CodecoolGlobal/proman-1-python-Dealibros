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
            console.log(board.id)
        }

        // getStatuses should maybe be called createStatuses?
        // const columns = await dataHandler.getStatuses()


        // for (let column of columns) {
        //     const columnBuilder = htmlFactory(htmlTemplates.column);
        //     const content = columnBuilder(column);
        //     domManager.addChildtoParents(".bodyboard", content);
        // document.querySelectorAll(".bodyboard").forEach(function(single){
        //     let bodyBoard = single.parentElement.firstElementChild.getAttribute('data-board-id')
        //     console.log(bodyBoard)
        // })

        //insert into both tables board.id and board-statuses here?
        //Need statuses_id or id, title, board_id
        //statuses_id or id = column.id
        //title = column_title
        //board_id = ?

        // domManager.addEventListener(
        //     `.createColumnButton[data-board-id="${column.id}]"]`,
        //     //column.id Needs to be changed for board_id?
        //     "click",
        //     //need to create a proper eventHandler here
        //     createNewColumn()

        // );
    },

    clearBoards: function () {
        let root = document.querySelector('#root');
        [...root.children].forEach((child) => root.removeChild(child));
    },
    addEventListeners: function () {
        domManager.addEventListener('.createBoard', 'click', showBoardForm);
        domManager.addEventListener(".createBoardButton", 'click', async () => {
            await createNewBoard();

            // Should the create column create Event listener be added here instead?
            // domManager.addEventListener(".createColumnButton", 'click', async () => {
            //     console.log("First check")
            //     await createNewColumn();
            // })

        })
        setTimeout(
            () => {
                const boards = document.querySelectorAll('.board');
                boards.forEach((child) => child.addEventListener('input', (event) => saveEdit(event)))
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


// Working on how to add a new column
function createNewColumn(clickEvent) {
    console.log("I am being clicked")
    // console.log(boardId)
    // dataHandler.createNewColumn()


    // Create just by inserting by javascript the HTML Through the DOM?
    // insert into database (2 of them?) the info from this new column created
    // Take the ids already existing in this table and add plus one
    //The other existing four columns should be added already in the database for this

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

import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";


export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        console.log(boards)
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
                // console.log(column.cards)
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

            // Should the create column create Event listener be added here instead?
            // domManager.addEventListener(".createColumnButton", 'click', async () => {
            //     console.log("First check")
            //     await createNewColumn();
            // })

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
    document.querySelector('#root').firstChild.querySelector('.delete-board').addEventListener('click', (event) => deleteBoard(event));
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
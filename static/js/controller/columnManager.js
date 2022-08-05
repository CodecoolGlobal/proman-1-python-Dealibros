import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager } from "./boardsManager.js";
import { cardsManager } from "./cardsManager.js";

export let columnsManager = {
    loadColumns: async function (columns) {
        for (let column of columns) {
            if (column) {
                this.createColumnElement(column);
            }
        }
    },

    createColumnElement: async function (column) {
        const columnBuilder = htmlFactory(htmlTemplates.column);
        const content = columnBuilder(column)
        domManager.addChild(`.bodyboard[data-board-id="${column.board_id}"]`, content);
        // event listeners
        domManager.addEventListener(`.column[data-column-id="${column.id}"]`, 'input', (event) => boardsManager.showEditButton(event));
        domManager.addEventListener(`.edit-column[data-column-id="${column.id}"]`, 'click', (event) => editColumnTitle(event));
        domManager.addEventListener(`.delete-column[data-column-id="${column.id}"]`, 'click', (event) => deleteColumn(event));
        domManager.addEventListener(`.add-card[data-column-id="${column.id}"]`, 'click', (event) => cardsManager.addCard(event));
        // drag events 
        domManager.addEventListener(`.cards-container[data-column-id="${column.id}"]`, 'dragover', (event) => handleDragOver(event));
        domManager.addEventListener(`.cards-container[data-column-id="${column.id}"]`, 'drop', (event) => handleDrop(event));
        domManager.addEventListener(`.cards-container[data-column-id="${column.id}"]`, 'dragenter', (event) => handleDragEnter(event));
        domManager.addEventListener(`.cards-container[data-column-id="${column.id}"]`, 'dragleave', (event) => handleDragLeave(event));
        cardsManager.loadCards(column.cards);
    },
    createNewColumn: async function(event) {
        const boardId = event.target.dataset.boardId;
        const title = "unnamed"
        await dataHandler.createNewColumn(title, boardId);
        const newColumn = await dataHandler.getRecentColumn();
        this.createColumnElement(newColumn, boardId);
    }
};


async function editColumnTitle(event) {
    const title = event.target.previousElementSibling.innerHTML;
    const columnId = event.target.dataset.columnId;
    await dataHandler.editColumnTitle(columnId, title);
    event.target.style.display = 'none';
}

async function deleteColumn(event) {
    const columnId = event.target.dataset.columnId;
    await dataHandler.deleteColumn(columnId);
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
}


function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(e) {}

function handleDragLeave(e) {}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const card = cardsManager.cardDragged;
    if (card) {
        cardsManager.editCardColumn(card.dataset.cardId, dropzone.dataset.columnId);
        dropzone.appendChild(card);
    }

}
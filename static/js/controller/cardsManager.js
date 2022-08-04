import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager } from "./boardsManager.js";

export let cardsManager = {
    cardDragged: null,
    loadCards: async function (cards) {
        //   const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            if (card) {
                const cardBuilder = htmlFactory(htmlTemplates.card);
                const content = cardBuilder(card);
                domManager.addChild(`.cards-container[data-column-id="${card.column_id}"]`, content);
            }
        }
    },
    addEventListeners: async function () {
        document.querySelectorAll('.card').forEach((child) => deleteButtonHandler);
        document.querySelectorAll('.edit-card').forEach((child) => child.addEventListener('click', (event) => editCardTitle(event)));
        document.querySelectorAll('.delete-card').forEach((child) => child.addEventListener('click', (event) => deleteCard(event)));
        // drag events 
        document.querySelectorAll('.card-container').forEach((child)=> child.addEventListener('dragstart', (event) => cardDragStart(event)));
        document.querySelectorAll('.card-container').forEach((child)=> child.addEventListener('dragend', (event) => cardDragEnd(event)));

    },
    addCard: async function (event) {
        let columnId = event.target.dataset.columnId;
        await dataHandler.createNewCard('unnamed', columnId);
        boardsManager.clearBoards();
        await boardsManager.loadBoards();
        boardsManager.addEventListeners();
    },
    editCardColumn: async function (cardId, columnId) {
        dataHandler.editCardColumn(cardId, columnId);
    }
};

function deleteButtonHandler(clickEvent) {
}


async function editCardTitle(event) {
    const title = event.target.previousElementSibling.innerHTML;
    const cardId = event.target.dataset.cardId;
    await dataHandler.editCardTitle(title, cardId);
    event.target.style.display = 'none';
}

async function deleteCard(event) {
    const cardId = event.target.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
}


function cardDragStart(event) {
    cardsManager.cardDragged = event.target;
}

function cardDragEnd(event) {
    cardsManager.cardDragged = null;
}
import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager } from "./boardsManager.js";

export let cardsManager = {
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
    },
    addCard: async function (event) {
        let columnId = event.target.dataset.columnId;
        await dataHandler.createNewCard('unnamed', columnId);
        boardsManager.clearBoards();
        await boardsManager.loadBoards();
        boardsManager.addEventListeners();
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

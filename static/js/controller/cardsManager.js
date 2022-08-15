import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager } from "./boardsManager.js";

export let cardsManager = {
    cardDragged: null,
    loadCards: async function (cards, columnId) {
        for (let card of cards) {
            if (card) {
                this.createCardElement(card, columnId);
            }
        }
    },

    createCardElement: async function (card) {
        const cardBuilder = htmlFactory(htmlTemplates.card);
        const content = cardBuilder(card);
        domManager.addChild(`.cards-container[data-column-id="${card.column_id}"]`, content);
        // event listeners
        domManager.addEventListener(`.card[data-card-id="${card.id}"]`, 'input', (event) => boardsManager.showEditButton(event));
        domManager.addEventListener(`.edit-card[data-card-id="${card.id}"]`, 'click', (event) => editCardTitle(event));
        domManager.addEventListener(`.delete-card[data-card-id="${card.id}"]`, 'click', (event) => deleteCard(event));
        // drag events 
        domManager.addEventListener(`.card-container[data-card-id="${card.id}"]`, 'dragstart', (event) => cardDragStart(event));
        domManager.addEventListener(`.card-container[data-card-id="${card.id}"]`, 'dragend', (event) => cardDragEnd(event));
    },

    addCard: async function (event) {
        let columnId = event.target.dataset.columnId;
        const newCard = await dataHandler.createNewCard('unnamed', columnId);
        this.createCardElement(newCard);
    },

    editCardColumn: async function (cardId, columnId) {
        dataHandler.editCardColumn(cardId, columnId);
    }
};


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
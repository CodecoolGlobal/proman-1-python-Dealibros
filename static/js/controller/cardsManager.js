import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (cards) {
        //   const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            if (card) {
                console.log(card)
                const cardBuilder = htmlFactory(htmlTemplates.card);
                const content = cardBuilder(card);
                domManager.addChild(`.cards-container[data-column-id="${card.column_id}"]`, content);

            }
        }
    },
    addEventListeners: async function () {
        document.querySelectorAll('.card').forEach((child) => deleteButtonHandler);
        document.querySelectorAll('.edit-card').forEach((child) => child.addEventListener('click', (event) => editCardTitle(event)));
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
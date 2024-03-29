export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board" data-board-id=${board.board_id} contentEditable="true">${board.title}</div>
                <button class="edit-board" style="display: none;" data-board-id="${board.board_id}">Save</button>
                <div class="positionColumnButton"><button class="create-column" data-board-id="${board.board_id}">+</button></div>
                <div class="bodyboard" data-board-id="${board.board_id}"></div>
                <button class="delete-board" data-board-id="${board.board_id}">Delete</button>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="column" data-column-id="${column.id}">
                <h4 class="columnTitle" contentEditable="true">${column.title} <hr class="hr"></h4>
                 <button class="edit-column" style="display: none;" data-column-id="${column.id}">Save</button>
                <div class="buttonsContainer">
                <button style="overflow-inline: auto;" class="delete-column" data-column-id="${column.id}">X</button>
                <button class="add-card" data-column-id="${column.id}">+</button>
                </div>
                <div class="cards-container" data-column-id="${column.id}"></div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card-container" draggable="true" data-card-id="${card.id}">
                <div class="card" data-card-id="${card.id}" contentEditable="true">${card.title}</div>
                <button class="edit-card" style="display: none;" data-card-id="${card.id}">Save</button>
                <button class="delete-card" data-card-id="${card.id}">x</button>
            </div>`;
}


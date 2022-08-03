export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.column]: columnBuilder
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
                <div class="positionColumnButton"><button class="createColumnButton" data-board-board_id="${board.board_id}">+</button></div>
                <div class="bodyboard" data-board-id="${board.board_id}"></div>
                <button class="delete-board" data-board-id="${board.board_id}">Delete</button>
                <button class="toggle-board-button" data-board-id="${board.board_id}">Show Cards</button>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

function columnBuilder(column) {
    return `<div class="column" data-column-id="${column.id}">
                <h4 class="columnTitle">${column.title}<hr/></h4>
                    <button style="overflow-inline: auto" class="submit">X</button>
                <div class="cards-container" data-column-id="${column.id}></div>
            </div>`;
}





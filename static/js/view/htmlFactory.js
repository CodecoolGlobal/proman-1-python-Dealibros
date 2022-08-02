export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.form]: formBuilder
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
                <div class="board" data-board-id=${board.id}>${board.title}</div>
                <div class bodyBoard><div class="column"></div><div class="column"></div><div class="column"></div><div class="column"></div></div>
                <button class="edit-board" data-board-id="${board.id}">Edit</button>
                <button class="delete-board" data-board-id="${board.id}">Delete</button>
                <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

function formBuilder() {
    return `    <div class="titleForm">
                <label for="title">Title: </label>
                <input name="title" id="title" type="text" placeholder="Title" value="unnamed" required>
                <button class="formBuilderButton" type="submit">Save</button>
                </div>
            ` ;
}
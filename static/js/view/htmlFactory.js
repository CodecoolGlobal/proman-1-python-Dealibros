export const htmlTemplates = {
    board: 1,
    card: 2
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
                <div class="board" data-board-id=${board.id} contentEditable="true">${board.title}</div>
                    <button class="edit-board" style="display: none;" data-board-id="${board.id}">Save</button>
                <div class="bodyboard"><div class="column"><h4>New</h4></div><div class="column"><h4>In progress</h4></div><div class="column"><h4>Testing</h4></div><div class="column"><h4>Done</h4></div></div>
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

function columnBuilder(column) {
    return `<div class="column" data-column-id="${column.id}"> <h4>New</h4></div>`
}
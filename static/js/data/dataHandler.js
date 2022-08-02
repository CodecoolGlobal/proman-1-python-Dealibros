export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
        
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        return await apiPost(window.origin + '/api/boards/createBoard', { title: boardTitle });
    },
    updateBoardTitle: async function(boardTitle, boardId) {
        return await apiPatch(`/api/boards/${boardId}/update`, { title: boardTitle, board_id: boardId });
    },
    deleteBoard: async function(boardTitle, boardId) {
        return await apiDelete(`/api/boards/${boardId}/delete`, { board_id: boardId });
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    fetch((url), {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
        .then(() => { if (response.ok) return 'ok' })
        .catch((err) => { return err })
}

async function apiDelete(url) {
    fetch((url), {
        method: 'DELETE'
    })
        .then(() => { if (response.ok) return 'ok' })
        .catch((err) => { return err })
}

async function apiPut(url) {
    fetch((url), {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(payload),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
        .then(() => { if (response.ok) return 'ok' })
        .catch((err) => { return err })
}

async function apiPatch(url, payload) {
    fetch((url), {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(payload),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
        .then(() => { if (response.ok) return 'ok' })
        .catch((err) => { return err })
}

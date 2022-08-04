export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    // getBoard: async function (boardId) {
    //     // the board is retrieved and then the callback function is called with the board
    //
    // },
    // getStatuses: async function () {
    //     return await apiGet("/api/columns");
    //     // the statuses are retrieved and then the callback function is called with the statuses
    // },
    editColumnTitle: async function (columnId, columnTitle) {
        // the status is retrieved and then the callback function is called with the status
        return await apiPatch(`/api/columns/${columnId}/edit`, { title: columnTitle });
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
    editBoardTitle: async function (boardTitle, boardId) {
        return await apiPatch(`/api/boards/${boardId}/edit`, { title: boardTitle, board_id: boardId });
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/boards/${boardId}/delete`, { board_id: boardId });
    },
    editCardTitle: async function (cardTitle, cardId) {
        // creates new card, saves it and calls the callback function with its data
        return await apiPatch(`/api/cards/${cardId}`, { title: cardTitle })
    },
    createNewCard: async function (cardTitle, columnId) {
        // creates new card, saves it and calls the callback function with its data
        return await apiPost(`/api/columns/${columnId}/create_new_card`, { title: cardTitle })
    },

    createNewColumn: async function (title, board_id) {
        console.log(title)
        console.log(board_id)

        return await apiPost(window.origin + '/api/columns/createNewColumn', { title: title, board_id: board_id });

    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}
// 404 Not found error create column link
async function apiPost(url, payload) {
    try {
        const response = await fetch((url), {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(payload),
            cache: 'no-cache',
            headers: new Headers({
                'content-type': 'application/json'
            })
        })

        if (response.ok) {
            console.log("here")
            return 'ok'
        }
    }
    catch (err) { return err }
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

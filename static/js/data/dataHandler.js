export let dataHandler = {
    // boards
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    createNewBoard: async function (boardTitle) {
        return await apiPost('/api/boards', { title: boardTitle });
    },
    editBoardTitle: async function (boardTitle, boardId) {
        return await apiPut(`/api/boards/${boardId}`, { title: boardTitle, boardId: boardId });
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/boards/${boardId}`);
    },
    // columns
    createNewColumn: async function (title, board_id) {
        return await apiPost('/api/columns', { title: title, board_id: board_id });
    },
    editColumnTitle: async function (columnId, columnTitle) {
        return await apiPut(`/api/columns/${columnId}`, { title: columnTitle });
    },
    deleteColumn: async function (columnId) {
        return await apiDelete(`/api/columns/${columnId}`, { columnId: columnId });
    },
    // cards
    createNewCard: async function (cardTitle, columnId) {
        return await apiPost(`/api/cards/${columnId}`, { title: cardTitle })
    },
    editCardTitle: async function (cardTitle, cardId) {
        return await apiPut(`/api/cards/${cardId}`, { title: cardTitle })
    },
    editCardColumn: async function (cardId, columnId) {
        return await apiPatch(`/api/cards/${cardId}`, { columnId: columnId })
    },
    deleteCard: async function (cardId) {
        return await apiDelete(`/api/cards/${cardId}`);
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
            return await response.json();
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

async function apiPut(url, payload) {
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
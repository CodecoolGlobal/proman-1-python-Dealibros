import {boardsManager} from "./controller/boardsManager.js";

function init() {
    boardsManager.loadBoards();
    boardsManager.addEventListeners();
}

document.querySelector('#login-button').addEventListener('click', () => {
    let username = document.querySelector('#login-username').value
    let password = document.querySelector('#login-password').value
    console.log(username)
    console.log(password)

    let form = new FormData()
    form.append('username', username)
    form.append('password', password)

    fetch('/login', {
        method: 'POST',
        body: form
    }).then((response) => response.json() ).then(json => {
        let loginInfo = document.querySelector('#login-info-text')
        let inputs = document.querySelector('#login-form')
        inputs.reset()
        loginInfo.textContent = json
        loginInfo.insertAdjacentHTML('afterend', '<br>')
        console.log(json)
        console.log(loginInfo)
        if (json === true) {
            loginInfo.textContent = 'Successfully logged in as ' + username
            let loginCountdown = document.querySelector('#login-redirect-countdown')
            loginCountdown.insertAdjacentHTML('afterend', '<br><br>')
            loginCountdown.textContent = 'Redirecting in 3'

            setTimeout(() => loginCountdown.textContent = 'Redirecting in 2', 1000)
            setTimeout(() => loginCountdown.textContent = 'Redirecting in 1', 2000)
            setTimeout(() => window.location.reload(), 3000)
        }
    })
})
init();

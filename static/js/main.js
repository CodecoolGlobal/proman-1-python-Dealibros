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

    fetch('/api/login', {
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


document.querySelector('#registration-username').addEventListener('input', check_if_available)
document.querySelector('#registration-username').addEventListener('input', check_username_criteria)
document.querySelector('#registration-username').addEventListener('input', check_all_criteria)
document.querySelector('#registration-pw1').addEventListener('input', check_pw)
document.querySelector('#registration-pw2').addEventListener('input', check_pw)
document.querySelector('#registration-pw2').addEventListener('input', check_all_criteria)

document.querySelector('#registrationButton').addEventListener('click', () => {
    let username = document.querySelector('#registration-username').value
    let password = document.querySelector('#registration-pw1').value
    console.log(username)
    console.log(password)

    let form = new FormData()
    form.append('username', username)
    form.append('password', password)

    fetch('/api/register', {
        method: 'POST',
        body: form
    }).then((response) => response.json()).then(json => {
        if (json === true) {
            window.location.reload()
        }
    })
})


function check_all_criteria() {
    let usernameInfo1 = document.querySelector('#registration-username-info').textContent
    let usernameInfo2 = document.querySelector('#registration-username-info2').textContent
    let pw_info1 = document.querySelector('#registration-info-text').textContent
    let pw_info2 = document.querySelector('#registration-info-text2').textContent
    let registrationButton = document.querySelector('#registrationButton')

    registrationButton.disabled = !(usernameInfo1 === '' &&
        usernameInfo2 === '' &&
        pw_info1 === 'Passwords match' &&
        pw_info2 === '');
}


function check_pw() {
    let pw1 = document.querySelector('#registration-pw1').value
    let pw2 = document.querySelector('#registration-pw2').value
    let infoText = document.querySelector('#registration-info-text')
    let infoText2 = document.querySelector('#registration-info-text2')

    if (pw1 !== pw2){
        infoText.textContent = 'Passwords do not match'
    } else {
        infoText.textContent = 'Passwords match'
    }
    if (pw1.length < 6 ) {
        infoText2.textContent = 'Password must be a minimum of six characters long'
    } else {
        infoText2.textContent = ''
    }

}


function check_if_available() {
    let username = document.querySelector('#registration-username').value
    console.log(username)
    let form = new FormData()
    let registrationUsernameInfo = document.querySelector('#registration-username-info')
    form.append('username', username)
    console.log('this is the form ', form)
    fetch('/api/check-if-username-exists', {
        method: 'POST',
        body: form
    }).then((response) => response.json() ).then(json => {
        console.log('this is the json', json)
        if (json['exists'] === true) {
            registrationUsernameInfo.textContent = 'Username already exists.'
        } else {
            registrationUsernameInfo.textContent = ''
        }
    })
}


function check_username_criteria() {
    let username = document.querySelector('#registration-username').value
    let usernameInfo2 = document.querySelector('#registration-username-info2')
    if (username.length < 5) {
        usernameInfo2.textContent = 'Username must contain a minimum of 5 characters.'
    } else {
        usernameInfo2.textContent = ''
    }
}


init();

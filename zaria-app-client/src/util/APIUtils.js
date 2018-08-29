import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function signupLegal(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signuplegal",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function editProfile(username, signupRequest) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/edit",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function sendMessage(messageRequest) {
    return request({
        url: API_BASE_URL + "/sendMessage",
        method: 'POST',
        body: JSON.stringify(messageRequest)
    });
}

export function checkArticleCodeAvailability(code) {
    return request({
        url: API_BASE_URL + "/admin/checkArticleAvailability?code=" + code,
        method: 'GET'
    });
}

export function uploadArticleImage(file) {

    const headers = new Headers();

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};

    var options = {
        url: API_BASE_URL + "/admin/upload",
        method: 'POST',
        body: file
    };

    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}

export function createArticle(newArticleRequest) {
    return request({
        url: API_BASE_URL + "/admin/newArticle",
        method: 'POST',
        body: JSON.stringify(newArticleRequest)
    });
}

export function getNumUnreadMessages() {
    return request({
        url: API_BASE_URL + "/admin/numUnreadMessages",
        method: 'GET'
    });
}

export function readMessages() {
    return request({
        url: API_BASE_URL + "/admin/readMessages",
        method: 'GET'
    });
}

export function sendResponse(messageResponse) {
    return request({
        url: API_BASE_URL + "/admin/sendMessageResponse",
        method: 'POST',
        body: JSON.stringify(messageResponse)
    });
}

export function addNewUser(newUserRequest) {
    return request({
        url: API_BASE_URL + "/admin/newUser",
        method: 'POST',
        body: JSON.stringify(newUserRequest)
    });
}

export function getProducts() {
    return request({
        url: API_BASE_URL + "/article/allProducts",
        method: 'GET'
    });
}

export function placeOrder(orderInfo) {
    return request({
        url: API_BASE_URL + "/article/placeOrder",
        method: 'POST',
        body: JSON.stringify(orderInfo)
    });
}


export function updateArticleState(articleInfo) {
    return request({
        url: API_BASE_URL + "/article/updateState",
        method: 'POST',
        body: JSON.stringify(articleInfo)
    });
}

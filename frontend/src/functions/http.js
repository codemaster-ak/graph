import {BASE_INIT, BASE_URL, BASE_URL2, HTML_INIT, HTTP_METHODS} from '../consts';
import axios from "axios";

export async function getFileById(file) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.GET,
    }
    return fetch(BASE_URL + '/' + file, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function getAllFileNames() {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.GET,
    }
    return fetch(BASE_URL + '/', init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function save(payload) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.POST,
        body: JSON.stringify(payload),
    }
    return fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function update(payload) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(payload),
    }
    return fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function remove(file) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.DELETE,
    }
    return fetch(BASE_URL + '/' + file, init)
}

export async function options() {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.OPTIONS,
    }
    return fetch(BASE_URL + '/', init).then((response) => {
        console.log(response.headers.get('Access-Control-Allow-Methods'))
    })
}

export async function optionsPlaceholder() {
    // return fetch('https://reqres.in/api/users', init).then((response) => {
    //     for (let [key, value] of response.headers) {
    //         console.log(`${key} = ${value}`)
    //     }
    // })
}

export async function getPage() {
    const init = {
        ...HTML_INIT,
        method: HTTP_METHODS.GET,
    }
    return fetch(BASE_URL2 + '/' + 'page', init).then((response) => {
        // for (let [key, value] of response.headers) {
        //     console.log(`${key} = ${value}`)
        // }
    })
}

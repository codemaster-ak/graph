import {BASE_INIT, BASE_URL, HTTP_METHODS} from "../consts";

export async function getFileById(file) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.GET
    }
    return await fetch(BASE_URL + '/' + file, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function getAllFileNames() {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.GET
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function save(payload) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.POST,
        body: JSON.stringify(payload)
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function update(payload) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(payload)
    }
    return await fetch(BASE_URL, init).then((response) => {
        if (response.ok) return response.json()
    }).then((data) => {
        return data
    })
}

export async function remove(file) {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.DELETE
    }
    return await fetch(BASE_URL + '/' + file, init)
}

export async function options() {
    const init = {
        ...BASE_INIT,
        method: HTTP_METHODS.OPTIONS
    }
    return await fetch(BASE_URL + '/', init)
}
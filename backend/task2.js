const axios = require('axios')
const fs = require("fs");
const path = require("path");

const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    HEAD: 'HEAD',
}

function createHTMLDocument(content, fromMethod) {
    let body = ''
    switch (fromMethod) {
        case HTTP_METHODS.GET:
            body = content.map(item => {
                return `<p>title: ${item.title}</p>`
            }).join('\n')
            break
        case HTTP_METHODS.POST:
            body = `<p>date: ${content.date}</p>\n<p>type: ${content.type}</p>`
            break
        case HTTP_METHODS.HEAD:
            body = Object.entries(content).map(([key, value]) => {
                return `<p>${key}: ${value}</p>`
            }).join('\n')
            break
    }
    const HTMLContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>\n` + body + `\n</body>
</html>`
    fs.open(path.resolve(__dirname, 'public', 'task2.html'), 'w', (err) => {
        if (err) throw err
    })
    fs.writeFile(path.resolve(__dirname, 'public', 'task2.html'), HTMLContent, (err) => {
        if (err) throw err
        return HTMLContent
    })
}

async function get() {
    const response = await axios.get('http://127.0.0.1:4000' + '/')
    createHTMLDocument(response.data, HTTP_METHODS.GET)
}

async function post() {
    const body = {
        date: new Date().getTime(),
        type: 'Request'
    }
    const response = await axios.post('http://127.0.0.1:4000' + '/test', body)
    createHTMLDocument(response.data, HTTP_METHODS.POST)

}

async function head() {
    const response = await axios.head('http://127.0.0.1:4000' + '/')
    createHTMLDocument(response.headers,HTTP_METHODS.HEAD)

}

// get()
// post()
// head()
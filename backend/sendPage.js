const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const {HOST, PORT2} = require('./consts')

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT2, () => console.log(`Server running on http://${HOST}:${PORT2}/`))

app.get('/page', (req, res) => {
    const HTMLContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>\n` + Object.entries(process.env).map(([key, value]) => {
            return `<p>${key}: ${value}</p>`
        }).join('\n')
        + `\n</body>
</html>`
    fs.open(path.resolve(__dirname, 'public', 'index.html'), 'w', (err) => {
        if (err) throw err
    })
    fs.writeFile(path.resolve(__dirname, 'public', 'index.html'), HTMLContent, (err) => {
        if (err) throw err
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
})
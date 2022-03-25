const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const {HOST, PORT} = require("./consts")
const {toBaseColours} = require("./functions/toBaseColours")

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}/`))

app.get('', ((req, res) => {
    fs.readdir(path.resolve(__dirname, 'files'), (err, files) => {
        const response = files.map(file => {
            return {
                title: file
            }
        })
        res.status(200).json(response)
    })
}))

app.get('/:fileName', ((req, res) => {
    const fileName = req.params.fileName
    fs.readdir(path.resolve(__dirname, 'files'), (e, files) => {
        if (files.some(file => file === fileName)) {
            fs.readFile(path.resolve(__dirname, 'files', fileName), 'utf8', (er, data) => {
                res.status(200).send(data)
            })
        } else res.status(404).json({message: 'Not found'})
    })
}))

app.post('/', (req, res) => {
    let matrix = JSON.parse(JSON.stringify(req.body))
    const date = new Date()
    const fileName = String(date.getDate()).padStart(2, '0') +
        '-' + String(date.getHours()).padStart(2, '0') +
        ':' + String(date.getMinutes()).padStart(2, '0') + '.json'
    matrix = toBaseColours(matrix)
    const content = JSON.stringify(matrix)
    fs.stat(path.resolve(__dirname, 'files'), (err, stats) => {
        if (stats?.isDirectory()) {
            fs.open(path.resolve(__dirname, 'files', fileName), 'w', (err) => {
                if (err) throw err
            })
            fs.writeFile(path.resolve(__dirname, 'files', fileName), content, (err) => {
                if (err) throw err
            })
            res.status(201).json({title: fileName})
        } else {
            fs.mkdir(path.resolve(__dirname, 'files'), (err) => {
                if (err) throw err
                fs.open(path.resolve(__dirname, 'files', fileName), 'w', (err) => {
                    if (err) throw err
                })
                fs.writeFile(path.resolve(__dirname, 'files', fileName), content, (err) => {
                    if (err) throw err
                })
            })
        }
    })
})

app.put('/', (req, res) => {
    let matrix = JSON.parse(JSON.stringify(req.body))
    matrix = toBaseColours(matrix)
    const content = JSON.stringify(matrix)
    const fileName = req.body.fileName
    fs.readdir(path.resolve(__dirname, 'files'), (e, files) => {
        if (files.some(file => file === fileName)) {
            fs.open(path.resolve(__dirname, 'files', fileName), 'w', (err) => {
                if (err) throw err
            })
            fs.writeFile(path.resolve(__dirname, 'files', fileName), content, (err) => {
                if (err) throw err
            })
        } else res.status(404).json({message: 'Not found'})
    })
})

app.delete('/:fileName', ((req, res) => {
    const fileName = req.params.fileName
    fs.readdir(path.resolve(__dirname, 'files'), (e, files) => {
        if (files.some(file => file === fileName)) {
            fs.unlink(path.resolve(__dirname, 'files', fileName), () => {
                res.status(200).json({message: 'Success'})
            })
        } else res.status(404).json({message: 'Not found'})
    })
}))
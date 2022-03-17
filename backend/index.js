const fs = require('fs')
const path = require('path')
const express = require('express')
const PORT = 4000

const app = express()

app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}/`))
app.use(express.json())

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
    const content = JSON.stringify(req.body)
    const date = new Date
    const fileName = String(date.getDate()).padStart(2,"0") +'-'+ String(date.getHours()).padStart(2,"0")+':'+ String(date.getMinutes()).padStart(2,"0") + '.json'
    fs.open(path.resolve(__dirname, 'files', fileName), 'w', (err) => {
        if (err) throw err
    })
    fs.writeFile(path.resolve(__dirname, 'files', fileName), content, (err) => {
        if (err) throw err
    })
    res.status(201).json({message: 'Success'})
})
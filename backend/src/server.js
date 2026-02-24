import express from 'express'

const app = express()

const user = []

app.post('/register', (req, res) => {
    const {name, emaik, password, salary} = req.body

    res.send('olaaa')
})

app.get('/register', (req, res) => {
    // const {name, emaik, password, salary} = req.body

    res.send('olaaa')
})

app.listen(3000);
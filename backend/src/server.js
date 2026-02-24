import express from 'express'

const app = express();
app.use(express.json());

const users = [];

app.post('/register', (req, res) => {
    const { name, email, password, salary } = req.body

    const newUser = {
        id: crypto.randomUUID(), // opcional
        name,
        email,
        password,
        salary: Number(salary)
    }

    users.push(newUser)

    res.status(201).json(newUser)
})


app.get('/register', (req, res) => {
    res.status(200).send(users)
})

app.listen(3000);
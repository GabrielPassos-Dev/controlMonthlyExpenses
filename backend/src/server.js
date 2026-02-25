import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.post('/register', async (req, res) => {
    const { name, email, password, salary } = req.body

    await prisma.user.create({
        data: {
            name,
            email,
            password,
            salary
        }
    })

    res.status(201).send(req.body)
})

app.get('/register', async (req, res) => {

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.listen(3000)

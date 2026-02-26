import bcrypt from 'bcrypt'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, salary } = req.body

        if (!name || !email || !password || !salary == null) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (salary < 0) {
            return res.status(400).json({ error: "Salary cannot be negative" })
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" })
        }

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                salary
            }
        })
        const { password: _, ...safeUser } = user

        return res.status(201).json(safeUser)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

app.get('/register', async (req, res) => {
    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email
            }
        })
    } else {
        users = await prisma.user.findMany()
    }


    res.status(200).json(users)
})

app.put('/register/:id', async (req, res) => {
    const { name, email, password, salary } = req.body

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            name,
            email,
            password,
            salary
        }
    })

    res.status(201).json(req.body)
})

app.delete('/register/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: 'Usuario deletado com sucesso' })
})

app.listen(3000)

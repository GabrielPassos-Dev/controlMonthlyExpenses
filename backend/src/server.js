import jwt from 'jsonwebtoken'
import cors from 'cors'
import bcrypt from 'bcrypt'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())


function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: "Token not provided" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Token malformed" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.userId

        next()

    } catch (error) {
        return res.status(401).json({ error: "Invalid token" })
    }
}

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, salary } = req.body

        if (!name || !email || !password || salary == null) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" })
        }

        if (salary < 0) {
            return res.status(400).json({ error: "Salary cannot be negative" })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined")
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

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const { password: _, ...safeUser } = user

        return res.status(201).json({
            user: safeUser,
            token
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const { password: _, ...safeUser } = user

        return res.json({
            user: safeUser,
            token
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

app.post('/dashboard/panel', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId

        const { month, year } = req.body

        if (!month || month < 1 || month > 12 || !year) {
            return res.status(400).json({ error: "month and year are required" })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const existingPanel = await prisma.panel.findFirst({
            where: {
                userId,
                month,
                year
            }
        })

        if (existingPanel) {
            return res.status(400).json({ error: "Panel already exists for this month" })
        }

        const panel = await prisma.panel.create({
            data: {
                userId,
                salarySnapshot: user.salary,
                remainingAmount: user.salary,
                status: "active",
                month,
                year
            }
        })

        return res.status(201).json(panel)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

app.get("/dashboard/panel/active", authMiddleware, async (req, res) => {
    try {
        const panel = await prisma.panel.findFirst({
            where: {
                userId: req.userId,
                status: "active"
            }
        })

        if (!panel) {
            return res.status(404).json({ hasActivePanel: false })
        }

        return res.json({ hasActivePanel: true, panel })

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
})

app.post('/financial', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId

        const { name, amount } = req.body

        if (!name || amount == null || amount <= 0) {
            return res.status(400).json({ error: "Name is required and amount must be greater than 0" })
        }

        const panel = await prisma.panel.findFirst({
            where: { userId, status: "active" }
        })

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" })
        }

        const expense = await prisma.expense.create({
            data: {
                panelId: panel.id,
                name,
                amount,
                paid: false
            }
        })

        return res.status(201).json(expense)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
})

app.get("/financial", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const panel = await prisma.panel.findFirst({
            where: { userId, status: "active" },
        });

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" });
        }

        const expenses = await prisma.expense.findMany({
            where: { panelId: panel.id },
            orderBy: { createdAt: "desc" },
        });

        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000)

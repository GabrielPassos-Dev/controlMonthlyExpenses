import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function registerUser(req, res) {
    try {
        const { name, email, password, salary } = req.body

        if (!name || !email || !password || salary == null) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Senha inválida, é necessário que tenha mais de 8 caracteres" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ error: "Email já registrado" })
        }

        if (salary < 0) {
            return res.status(400).json({ error: "Salário não pode ser negativo" })
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
                salary: salary ?? 0
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
}

export async function loginUser(req, res) {
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
}
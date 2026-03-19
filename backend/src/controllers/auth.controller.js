import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

export async function registerUser(req, res) {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                message: parsed.error.issues[0].message,
            })
        };

        const { name, email, password, salary } = parsed.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        })

        if (existingUser) {
            return res.status(400).json({
                error: "EMAIL_ALREADY_EXISTS",
                message: "Este e-mail já está em uso"
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                error: "AUTH_CONFIG_ERROR",
                message: "Erro interno de autenticação"
            });
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
        console.error("REGISTER_ERROR:", error);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        })
    }
}

export async function loginUser(req, res) {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                message: parsed.error.issues[0].message,
            });
        }

        const { email, password } = parsed.data;

        const userSelect = {
            id: true,
            name: true,
            email: true,
            password: true
        };

        const user = await prisma.user.findUnique({
            where: { email },
            select: userSelect
        });

        if (!user) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS",
                message: "E-mail ou senha incorretos"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS",
                message: "E-mail ou senha incorretos"
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                error: "AUTH_CONFIG_ERROR",
                message: "Erro interno de autenticação"
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const { password: _, ...safeUser } = user

        return res.status(200).json({
            user: safeUser,
            token
        })

    } catch (error) {
        console.error("LOGIN_ERROR:", error);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        })
    }
}
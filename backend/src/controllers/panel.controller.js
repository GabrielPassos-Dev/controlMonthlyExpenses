import { PanelStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";

export async function createPanel(req, res) {
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
                status: PanelStatus.ACTIVE,
                month,
                year
            }
        })

        return res.status(201).json(panel)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function getActivePanel(req, res) {
    try {
        const panel = await prisma.panel.findFirst({
            where: {
                userId: req.userId,
                status: PanelStatus.ACTIVE
            }
        })

        if (!panel) {
            return res.status(404).json({ hasActivePanel: false })
        }

        return res.json({ hasActivePanel: true, panel })

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateStatusPanel(req, res) {
    try {
        const userId = req.userId

        const existingPanel = await prisma.panel.findFirst({
            where: {
                userId,
                status: PanelStatus.ACTIVE
            }
        })

        if (!existingPanel) {
            return res.status(400).json({ error: "Não existe painel financeiro ativo no momento" })
        }

        const updatePanel = await prisma.panel.update({
            where: { id: existingPanel.id },
            data: { status: PanelStatus.FINISHED },
            select: {
                id: true,
                status: true
            }
        })

        return res.json(updatePanel);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" })
    }
}
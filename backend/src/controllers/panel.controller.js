import { PanelStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { createPanelSchema } from "../schemas/panelSchema.js";

export async function createPanel(req, res) {
    const parsed = createPanelSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message
        });
    }

    const { month, year } = parsed.data
    const userId = req.userId

    try {
        if (!month || month < 1 || month > 12 || !year) {
            return res.status(400).json({
                error: "YEAR_OR_MONTH_NOT_FOUND",
                message: "Mês e ano são requiridos"
            })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(404).json({
                error: "USER_NOT_FOUND",
                message: "Usuario não encontrado"
            })
        }

        const existingPanel = await prisma.panel.findFirst({
            where: {
                userId,
                month,
                year
            }
        })

        if (existingPanel) {
            return res.status(400).json({
                error: "PANEL_EXISTING",
                message: `Já existe um painel para ${month}/${year}`
            })
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
        console.error(error);
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function getFinishedPanel(req, res) {
    try {
        const panel = await prisma.panel.findMany({
            where: {
                userId: req.userId,
                status: PanelStatus.FINISHED
            },
            orderBy: { createdAt: "desc" },
            include: { expenses: true }
        })

        if (panel.length === 0) {
            return res.status(404).json({ hasFinishedPanel: false, message: "No finished panels found" })
        }

        return res.json({ hasFinishedPanel: true, panel })

    } catch (error) {
        console.error(error);
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
import prisma from "../lib/prisma.js";

export async function createExpense(req, res) {
    try {
        const userId = req.userId;
        const { name, amount } = req.body;

        if (!name || amount == null || amount <= 0) {
            return res.status(400).json({ error: "Name is required and amount must be greater than 0" });
        }

        const panel = await prisma.panel.findFirst({
            where: { userId, status: "active" }
        });

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" });
        }

        const expense = await prisma.expense.create({
            data: {
                panelId: panel.id,
                name,
                amount,
                paid: false
            }
        });

        await prisma.panel.update({
            where: { id: expense.panelId },
            data: {
                remainingAmount: {
                    decrement: expense.amount
                }
            }
        });

        return res.status(201).json(expense);

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getFinancial(req, res) {
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

        res.json({ expenses, panel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteExpense(req, res) {
    try {
        const expenseId = req.params.id
        const userId = req.userId

        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: { panel: true }
        })

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }

        if (expense.panel.userId !== userId) {
            return res.status(403).json({ error: "Not authorized" })
        }

        await prisma.expense.delete({
            where: { id: expenseId }
        })

        await prisma.panel.update({
            where: { id: expense.panelId },
            data: {
                remainingAmount: {
                    increment: expense.amount
                }
            }
        })

        return res.json({ deletedExpense: expense })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
import { ExpenseType, PanelStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";

export async function createExpense(req, res) {
    try {
        const userId = req.userId
        const { name, amount, type } = req.body

        if (!name || amount == null || amount <= 0) {
            return res.status(400).json({ error: "Name is required and amount must be greater than 0" })
        }

        if (!type) {
            return res.status(400).json({ error: "Expense type is required" })
        }

        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE }
        })

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" })
        }

        const expense = await prisma.expense.create({
            data: {
                panelId: panel.id,
                name,
                amount: Number(amount),
                type
            }
        })

        await prisma.panel.update({
            where: { id: panel.id },
            data: {
                remainingAmount: {
                    decrement: Number(amount)
                }
            }
        })

        return res.status(201).json(expense)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function getFinancial(req, res) {
    try {
        const userId = req.userId;

        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE },
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
        const { id } = req.params
        const userId = req.userId

        const expense = await prisma.expense.findUnique({
            where: { id: id },
            include: { panel: true }
        })

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }

        if (expense.panel.userId !== userId) {
            return res.status(403).json({ error: "Not authorized" })
        }

        await prisma.expense.delete({
            where: { id: id }
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

export async function updateExpense(req, res) {
    try {
        const { id } = req.params
        const userId = req.userId
        const { name, amount } = req.body

        const expense = await prisma.expense.findUnique({
            where: { id: id },
            include: { panel: true }
        })

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }

        if (expense.panel.userId !== userId) {
            return res.status(403).json({ error: "Not authorized" })
        }

        if (expense.paid === true) {
            return res.status(403).json({ error: "Não é possivel editar despesa paga" })
        }

        const newExpense = await prisma.expense.update({
            where: { id, },
            data: {
                name,
                amount,
            },
            select: {
                name: true,
                amount: true
            }
        })

        await prisma.panel.update({
            where: { id: expense.panelId },
            data: {
                remainingAmount: {
                    increment: expense.amount
                }
            }
        })

        return res.status(200).json(newExpense)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }

}

export async function getDailyBudget(req, res) {
    try {

        const userId = req.userId

        const panel = await prisma.panel.findFirst({
            where: {
                userId,
                status: PanelStatus.ACTIVE
            }
        })

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" })
        }

        const dailyBudget = panel.remainingAmount / 30

        return res.json({
            remainingAmount: panel.remainingAmount,
            dailyBudget
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function payExpense(req, res) {
    try {

        const userId = req.userId
        const expenseId = req.params.id

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

        if (expense.type !== "FIXED") {
            return res.status(400).json({ error: "Only fixed expenses can be marked as paid" })
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                paid: true
            }
        })

        return res.json(updatedExpense)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function spendExpense(req, res) {
    const userId = req.userId
    const expenseId = req.params.id
    const { amount } = req.body

    try {
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than 0" })
        }

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

        if (expense.type !== "VARIABLE") {
            return res.status(400).json({ error: "Only variable expenses allow partial spending" })
        }

        if (amount > expense.amount) {
            return res.status(400).json({ error: "Amount exceeds available expense value" })
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })

        return res.json(updatedExpense)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateExpensePaid(req, res) {
    const { id } = req.params;
    const { paid } = req.body;

    try {
        const expense = await prisma.expense.findUnique({
            where: { id: id },
        });

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }

        if (expense.type === ExpenseType.VARIABLE) {
            return res.status(404).json({ error: "Apenas despesas fixas podem ser marcadas" })
        }

        await prisma.expense.update({
            where: { id: id },
            data: {
                paid: paid
            }
        });

        return res.json(expense);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateSpentAmount(req, res) {
    const { id } = req.params;
    const { spentAmount } = req.body;

    try {

        if (!spentAmount || spentAmount === 0) {
            return res.status(404).json({ error: "Expense not found" })
        }

        const expense = await prisma.expense.findUnique({
            where: { id: id },
        });

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }

        if (expense.type === ExpenseType.FIXED) {
            return res.status(404).json({ error: "Apenas despesas variaveis podem ser alteradas" })
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: id },
            data: {

                spentAmount: {
                    increment: spentAmount
                }
            }
        });

        return res.status(200).json(updatedExpense);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
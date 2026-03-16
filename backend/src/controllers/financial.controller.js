import { ExpenseType, PanelStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { updateExpenseSchema } from "../schemas/expenseSchema.js";

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

        // if (type === ExpenseType.FIXED) {
        //     await prisma.panel.update({
        //         where: { id: panel.id },
        //         data: {
        //             remainingAmount: {
        //                 decrement: Number(amount)
        //             }
        //         }
        //     })
        // }

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

        let amountToRestore = 0;

        if (expense.type === ExpenseType.FIXED && expense.paid === true) {
            amountToRestore = Number(expense.amount);
        } else if (expense.type === ExpenseType.VARIABLE) {
            amountToRestore = Number(expense.spentAmount || 0);
        }

        if (amountToRestore > 0) {
            await prisma.panel.update({
                where: { id: expense.panelId },
                data: {
                    remainingAmount: {
                        increment: amountToRestore
                    }
                }
            });
        }

        return res.json({ deletedExpense: expense })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateExpense(req, res) {
    try {
        const parsed = updateExpenseSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid data",
                details: parsed.error.errors
            });
        }

        const { id } = req.params
        const userId = req.userId
        const { name, amount, spentAmount } = parsed.data;

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

        const data = {};

        if (name !== undefined) data.name = name;
        if (amount !== undefined) data.amount = amount;
        if (spentAmount !== undefined) data.spentAmount = spentAmount;

        if (expense.type === ExpenseType.FIXED) {
            const difference = amount !== undefined ? expense.amount - amount : 0;

            if (difference !== 0) {
                await prisma.panel.update({
                    where: { id: expense.panelId },
                    data: { remainingAmount: { increment: difference } }
                });
            }
        } else if (expense.type === ExpenseType.VARIABLE) {
            const difference = spentAmount !== undefined ? expense.spentAmount - spentAmount : 0;

            if (difference !== 0) {
                await prisma.panel.update({
                    where: { id: expense.panelId },
                    data: { remainingAmount: { increment: difference } }
                });
            }
        } else {
            return res.status(404).json({ error: "Despesa invalida" })
        }

        const newExpense = await prisma.expense.update({
            where: { id },
            data: data,
            select: {
                name: true,
                amount: true,
                spentAmount: true,
                panel: {
                    select: {
                        remainingAmount: true
                    }
                }
            }
        });


        return res.status(200).json(newExpense)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }

}

export async function updateExpensePaid(req, res) {
    const { id } = req.params;
    const { paid } = req.body;
    const userId = req.userId

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

        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE }
        })

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" })
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: id },
            data: { paid: paid }
        });

        await prisma.panel.update({
            where: { id: panel.id },
            data: {
                remainingAmount: {
                    [paid ? 'decrement' : 'increment']: Number(expense.amount)
                }
            }
        });

        return res.json(updatedExpense);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateSpentAmount(req, res) {
    const userId = req.userId
    const { id } = req.params;
    const { spentAmount } = req.body;

    try {
        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE }
        })

        if (!panel) {
            return res.status(404).json({ error: "Active panel not found" })
        }

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

        await prisma.panel.update({
            where: { id: panel.id },
            data: {
                remainingAmount: {
                    decrement: Number(spentAmount)
                }
            }
        })

        return res.status(200).json(updatedExpense);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
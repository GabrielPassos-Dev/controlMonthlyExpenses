import { ExpenseType, PanelStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { createExpenseSchema, deleteExpenseSchema, updateExpenseSchema, updatePaidSchema, updateSpentAmountSchema } from "../schemas/expenseSchema.js";
import delay from "../utils/delay.js";

export async function createExpense(req, res) {
    try {
        const userId = req.userId;

        const parsed = createExpenseSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                message: parsed.error.issues[0].message
            });
        }

        const { name, amount, type } = parsed.data;

        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE },
            select: { id: true }
        })

        if (!panel) {
            return res.status(404).json({
                error: "ACTIVE_PANEL_NOT_FOUND",
                message: "Nenhum painel ativo encontrado"
            });
        }

        const expense = await prisma.expense.create({
            data: {
                panelId: panel.id,
                name,
                amount,
                type
            }
        })

        return res.status(201).json({
            message: "Despesa criada com sucesso",
            expense
        });

    } catch (error) {
        console.error("CREATE_EXPENSE_ERROR:", error);
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        });
    }
}

export async function getFinancial(req, res) {
    try {
        const userId = req.userId;

        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE },
            select: {
                id: true,
                salarySnapshot: true,
                remainingAmount: true,
            }
        });

        if (!panel) {
            return res.status(404).json({
                error: "ACTIVE_PANEL_NOT_FOUND",
                message: "Nenhum painel ativo encontrado"
            })
        }

        const expenses = await prisma.expense.findMany({
            where: { panelId: panel.id },
            orderBy: { createdAt: "desc" },
        });

        res.json({ expenses, panel });
    } catch (error) {
        console.error("PANEL_ERROR:", error);
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        });
    }
}

export async function deleteExpense(req, res) {
    try {
        const parsed = deleteExpenseSchema.safeParse(req.params);

        if (!parsed.success) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                message: parsed.error.issues[0].message
            });
        }

        const { id } = parsed.data;
        const userId = req.userId

        const result = await prisma.$transaction(async (tx) => {

            const expense = await tx.expense.findFirst({
                where: {
                    id,
                    panel: {
                        userId
                    }
                },
                include: { panel: true }
            });

            if (!expense) {
                throw new Error("EXPENSE_NOT_FOUND");
            }

            const amountToRestore =
                expense.type === ExpenseType.FIXED && expense.paid
                    ? Number(expense.amount)
                    : expense.type === ExpenseType.VARIABLE
                        ? Number(expense.spentAmount || 0)
                        : 0;

            await tx.expense.delete({
                where: { id }
            });

            if (amountToRestore > 0) {
                await tx.panel.update({
                    where: { id: expense.panelId },
                    data: {
                        remainingAmount: {
                            increment: amountToRestore
                        }
                    }
                });
            }

            return expense
        });

        return res.status(200).json({
            message: "Despesa excluída com sucesso",
            expense: result
        });
    } catch (error) {
        if (error.message === "EXPENSE_NOT_FOUND") {
            return res.status(404).json({
                error: "EXPENSE_NOT_FOUND",
                message: "Despesa não encontrada"
            });
        }

        console.error("DELETE_EXPENSE_ERROR:", error);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        });
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
            return res.status(404).json({
                error: "EXPENSE_NOT_FOUND",
                message: "Despesa não encontrada"
            })
        }

        if (expense.panel.userId !== userId) {
            return res.status(403).json({
                error: "NOT_AUTHORIZED",
                message: "Usuario não encontrado"
            })
        }

        if (expense.paid === true) {
            return res.status(403).json({
                error: "NOT_PAID",
                message: "Não é possivel alterar despesa paga"
            })
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
            return res.status(404).json({
                error: "EXPENSE_INVALID",
                message: "Por favor escolha entre despesa Fixo ou Variavel"
            })
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
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        })
    }

}

export async function updateExpensePaid(req, res) {
    const parsed = updatePaidSchema.safeParse({ ...req.params, ...req.body })

    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message
        });
    }

    const { id, paid } = parsed.data;
    const userId = req.userId

    try {
        const expense = await prisma.expense.findUnique({
            where: { id: id }
        });

        const panel = await prisma.panel.findFirst({
            where: {
                userId: userId,
                status: 'ACTIVE'
            }
        });

        if (!expense) throw new Error("EXPENSE_NOT_FOUND");
        if (!panel) throw new Error("PANEL_NOT_FOUND");
        if (expense.type === "VARIABLE") throw new Error("ONLY_FIXED");

        if (expense.paid === paid) {
            return res.json({
                expense,
                remainingAmount: panel.remainingAmount
            })
        }

        //updateMany Serve pra: Atualizar só se ainda estiver no estado esperado
        const updated = await prisma.expense.updateMany({
            where: {
                id: id,
                paid: !paid
            },
            data: {
                paid: paid
            }
        });

        //count é o número de atualizações
        if (updated.count === 0) {
            const currentExpense = await prisma.expense.findUnique({
                where: { id }
            });

            const currentPanel = await prisma.panel.findUnique({
                where: { id: panel.id }
            });

            return res.json({
                expense: currentExpense,
                remainingAmount: currentPanel.remainingAmount
            });
        }

        await prisma.panel.update({
            where: { id: panel.id },
            data: {
                remainingAmount: {
                    [paid ? 'decrement' : 'increment']: Number(expense.amount)
                }
            }
        });

        const updatedPanel = await prisma.panel.findUnique({
            where: { id: panel.id }
        });

        const finalExpense = await prisma.expense.findUnique({
            where: { id }
        });

        return res.json({
            expense: finalExpense,
            remainingAmount: updatedPanel.remainingAmount
        });

    } catch (error) {
        if (error.message === "EXPENSE_NOT_FOUND") return res.status(404).json({ message: "Despesa não encontrada" });
        if (error.message === "ONLY_FIXED") return res.status(400).json({ message: "Apenas despesas fixas podem ser marcadas" });
        if (error.message === "PANEL_NOT_FOUND") return res.status(404).json({ message: "Painel ativo não encontrado" });

        console.error(error)
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        });

    }
}

export async function updateSpentAmount(req, res) {
    const parsed = updateSpentAmountSchema.safeParse({ ...req.params, ...req.body })

    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message
        });
    }

    const { id, spentAmount } = parsed.data;
    const userId = req.userId

    try {
        const panel = await prisma.panel.findFirst({
            where: { userId, status: PanelStatus.ACTIVE }
        })

        if (!panel) {
            return res.status(404).json({
                error: "ACTIVE_PANEL_NOT_FOUND",
                message: "Nenhum painel ativo encontrado"
            })
        }

        const expense = prisma.expense.findFirst({
            where: { id, userId },
        });

        if (!expense) {
            return res.status(404).json({
                error: "EXPENSE_NOT_FOUND",
                message: "Despesa não encontrada",
            })
        }

        if (expense.type === ExpenseType.FIXED) {
            return res.status(400).json({ error: "INVALID_EXPENSE_TYPE", message: "Tipo de despesa inválido" })
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedExpense = await tx.expense.update({
                where: { id: id },
                data: {

                    spentAmount: {
                        increment: Number(spentAmount)
                    }
                },
            });

            await tx.panel.update({
                where: { id: panel.id },
                data: {
                    remainingAmount: {
                        decrement: Number(spentAmount)
                    }
                }
            })
            return updatedExpense.spentAmount
        })

        return res.status(200).json({ spentAmount: result });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Erro inesperado. Tente novamente mais tarde."
        });
    }
}
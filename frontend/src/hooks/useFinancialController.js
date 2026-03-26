import { useNavigate } from "react-router-dom";
import { useFinancial } from "../context/FinancialContext";
import { useState, useEffect } from "react";
import {
    createExpense,
    deleteExpense,
    fetchExpenses,
    updateExpense,
    updateExpensePaid,
    updateSpentAmount,
} from "../services/financialService.js";
import { updateStatusPanel } from "../services/panelService.js";
import { useNotification } from "../context/NotificationContext.jsx";

export function useFinancialController() {
    const navigate = useNavigate();

    const {
        expenses,
        setExpenses,
        salarySnapshot,
        setSalarySnapshot,
        setRemainingAmount,
    } = useFinancial();
    const { addNotification } = useNotification();

    const [isLoading, setIsLoading] = useState(false);
    const [togglingId, setTogglingId] = useState({});

    const predictedRemainingAmount =
        salarySnapshot -
        expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);

    async function handleCreateExpense(name, amount, type) {
        const token = localStorage.getItem("token");

        try {
            if (!name) throw new Error("A descrição é obrigatória");
            if (!amount) throw new Error("O valor deve ser maior que zero");

            const data = await createExpense(token, name, amount, type);

            setExpenses((prev) => [data.expense, ...prev]);

            addNotification(`Despesa "${name}" criada com sucesso`, "success");

        } catch (error) {
            console.error("Erro ao criar despesa:", error);
            addNotification(error.message || "Erro de conexão", "error");
            throw error;
        }
    }

    async function handleFetchExpenses() {
        const token = localStorage.getItem("token");
        try {
            const data = await fetchExpenses(token);

            setExpenses(data.expenses);
            setSalarySnapshot(data.panel.salarySnapshot);
            setRemainingAmount(data.panel.remainingAmount);
        } catch (error) {
            console.error("Erro ao carregar despesas: ", error);
            addNotification(error.message || "Erro de conexão", "error");
        }
    }

    useEffect(() => {
        handleFetchExpenses();
    }, []);

    async function handleDeletedExpense(id) {
        try {
            const token = localStorage.getItem("token");
            if (!id) throw new Error("Despesa já foi removida");
            const data = await deleteExpense(token, id);

            setExpenses((prev) => prev.filter((e) => e.id !== id));

            if (data.expense) {
                if (data.expense.type === "FIXED" && data.expense.paid) {
                    setRemainingAmount((prev) => prev + data.expense.amount);
                } else if (data.expense.type === "VARIABLE") {
                    setRemainingAmount((prev) => prev + (data.expense.spentAmount || 0));
                }
            }

            addNotification("Despesa removida com sucesso", "success");
        } catch (error) {
            console.error("Erro ao deletar despesa:", error);
            addNotification(error.message || "Erro de conexão", "error");
        }
    }

    async function handleUpdateExpense(id, expenseData) {
        const token = localStorage.getItem("token");

        try {
            const data = await updateExpense(token, id, expenseData);

            setRemainingAmount(data.panel.remainingAmount);

            setExpenses((prevExpenses) =>
                prevExpenses.map((expense) =>
                    expense.id === id ? { ...expense, ...expenseData } : expense,
                ),
            );

            addNotification("Despesa alterada com sucesso", "success");
        } catch (error) {
            console.error("Erro ao atualizar despesa:", error);
            addNotification(error.message || "Erro de conexão", "error");
        }
    }

    async function handleToggleStatus() {
        const token = localStorage.getItem("token");
        try {
            setIsLoading(true);
            await updateStatusPanel(token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao encerrar panel: ", error);
            addNotification(error.message || "Erro ao encerrar panel", "error");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleTogglePaid(expense) {
        const token = localStorage.getItem("token");

        if (togglingId[expense.id]) return;

        setTogglingId((prev) => {
            if (prev[expense.id]) return prev;
            return { ...prev, [expense.id]: true };
        });

        try {
            const updatedPaid = !expense.paid;

            const response = await updateExpensePaid(expense.id, updatedPaid, token);

            setExpenses((prev) =>
                prev.map((exp) => (exp.id === expense.id ? response.expense : exp)),
            );

            setRemainingAmount(response.remainingAmount);
        } catch (error) {
            console.error("Erro na API:", error);
            addNotification(error.message || "Erro de conexão", "error");
        } finally {
            setTogglingId((prev) => {
                const newMap = { ...prev };
                delete newMap[expense.id];
                return newMap;
            });
        }
    }

    async function handleUpdateSpAm(id, value) {
        const token = localStorage.getItem("token");

        try {
            const data = await updateSpentAmount(id, value, token);

            setExpenses((prev) =>
                prev.map((exp) =>
                    exp.id === id ? { ...exp, spentAmount: data.spentAmount } : exp,
                ),
            );

            setRemainingAmount((prev) => prev - value);

            addNotification("Gasto registrado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao atualizar gasto:", error);
            addNotification(error.message || "Erro ao atualizar gasto", "error");
        }
    }


    return {
        isLoading,
        togglingId,
        predictedRemainingAmount,
        handleCreateExpense,
        handleFetchExpenses,
        handleDeletedExpense,
        handleUpdateExpense,
        handleTogglePaid,
        handleUpdateSpAm,
        handleToggleStatus,
    }


}
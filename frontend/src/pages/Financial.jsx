import { useState } from "react";
import { useEffect } from "react";
import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";
import { Button } from "../components/ui/Button";
import {
  fetchExpenses,
  updateExpense,
  updateExpensePaid,
} from "../services/financialService.js";
import { updateStatusPanel } from "../services/panelService.js";
import { useNavigate } from "react-router-dom";

export default function Financial() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [salarySnapshot, setSalarySnapshot] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFetchExpenses() {
    const token = localStorage.getItem("token");
    try {
      const data = await fetchExpenses(token);
      setExpenses(data.expenses);
      setSalarySnapshot(data.panel.salarySnapshot);
      setRemainingAmount(data.panel.remainingAmount);
    } catch (error) {
      console.error("Erro ao carregar despesas: ", error);
      alert(error.message);
    }
  }

  useEffect(() => {
    handleFetchExpenses();
  }, []);

  function addExpense(newExpense) {
    setExpenses((prev) => [newExpense, ...prev]);
    setRemainingAmount((prev) => prev - newExpense.amount);
  }

  function removeExpense(id, expense) {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    setRemainingAmount((prev) => prev + expense.amount);
  }

  async function handleToggleStatus() {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      await updateStatusPanel(token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao encerrar panel: ", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTogglePaid(expense) {
    const token = localStorage.getItem("token");

    try {
      const updatedPaid = !expense.paid;

      await updateExpensePaid(expense.id, updatedPaid, token);

      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expense.id ? { ...exp, paid: updatedPaid } : exp,
        ),
      );
    } catch (error) {
      console.error("Erro ao marcar despesa:", error);
      alert(error.message || "Erro ao marcar despesa");
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
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      alert(error.message);
    }
  }

  function updateExpenseSpent(id, newSpent) {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, spentAmount: newSpent } : exp,
      ),
    );
  }

  return (
    <main className="bg-gray-600 min-h-screen w-full flex items-center justify-center p-4">
      <section className="w-full max-w-2xl flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-row gap-4 mb-3 md:mb-5">
          <p className="text-white text-2xl md:text-5xl text-center font-medium">
            Salário:
          </p>
          <p className="text-green-300 text-2xl md:text-5xl text-center font-bold">
            {`  R$ ${salarySnapshot.toFixed(2).replace(".", ",")}`}
          </p>
        </div>

        <FinancialControl addExpense={addExpense} />

        <FinancialList
          expenses={expenses}
          removeExpense={removeExpense}
          handleTogglePaid={handleTogglePaid}
          updateExpenseSpent={updateExpenseSpent}
          handleUpdateExpense={handleUpdateExpense}
        />

        {salarySnapshot !== remainingAmount && (
          <p className="bg-white p-1 rounded-xl w-full text-center font-bold">{`Saldo restante: R$ ${remainingAmount.toFixed(2).replace(".", ",")}`}</p>
        )}

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Button to={"/dashboard"}>Voltar</Button>
          <Button onClick={handleToggleStatus} disabled={isLoading}>
            {isLoading ? "Finalizando..." : "Finalizar"}
          </Button>
        </div>
      </section>
    </main>
  );
}

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
    <main className="bg-slate-950 min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-10 md:py-20 overflow-x-hidden">
      <section className="w-full max-w-2xl flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-slate-500 uppercase text-xs font-bold tracking-widest">
            Sua Renda Atual
          </span>

          <div className="flex flex-row items-baseline gap-2">
            <p className="text-white text-3xl md:text-6xl font-light">R$</p>
            <p className="text-emerald-400 text-4xl md:text-7xl font-bold tracking-tighter">
              {salarySnapshot.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="h-1.5 w-24 bg-emerald-500/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full animate-pulse" />
          </div>
        </div>

        <div className="w-full bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-2xl">
          <FinancialControl addExpense={addExpense} />
        </div>

        <div className="w-full">
          <FinancialList
            expenses={expenses}
            removeExpense={removeExpense}
            handleTogglePaid={handleTogglePaid}
            updateExpenseSpent={updateExpenseSpent}
            handleUpdateExpense={handleUpdateExpense}
          />
        </div>

        {salarySnapshot !== remainingAmount && (
          <div className="w-full bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl flex justify-between items-center shadow-lg">
            <span className="text-slate-400 font-medium">
              Saldo disponível:
            </span>

            <span
              className={`text-xl font-mono font-bold ${remainingAmount >= 0 ? "text-indigo-400" : "text-red-400"}`}
            >
              {`R$ ${remainingAmount.toFixed(2).replace(".", ",")}`}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <Button
            to={"/dashboard"}
            className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 py-4"
          >
            Voltar
          </Button>

          <Button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finalizando...
              </span>
            ) : (
              "Finalizar Mês"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}

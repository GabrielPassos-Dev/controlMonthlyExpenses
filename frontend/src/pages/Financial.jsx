import { useState } from "react";
import { useEffect } from "react";
import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";
import { Button } from "../components/ui/Button";
import {
  deleteExpense,
  fetchExpenses,
  updateExpense,
  updateExpensePaid,
  updateSpentAmount,
} from "../services/financialService.js";
import { updateStatusPanel } from "../services/panelService.js";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import NotificationContainer from "../components/NotificationContainer";

export default function Financial() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [salarySnapshot, setSalarySnapshot] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [togglingId, setTogglingId] = useState({});

  const { notifications, addNotification, removeNotification } =
    useNotification();

  const predictedRemainingAmount =
    salarySnapshot -
    expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);

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
  }

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

  return (
    <main className="bg-slate-950 min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-10 md:py-20 overflow-x-hidden">
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

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
          <FinancialControl
            addExpense={addExpense}
            addNotification={addNotification}
          />
        </div>

        <div className="w-full">
          <FinancialList
            expenses={expenses}
            handleTogglePaid={handleTogglePaid}
            handleUpdateExpense={handleUpdateExpense}
            setRemainingAmount={setRemainingAmount}
            togglingId={togglingId}
            handleDeletedExpense={handleDeletedExpense}
            handleUpdateSpAm={handleUpdateSpAm}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {remainingAmount && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
              <span className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                Saldo Disponível
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm font-mono">R$</span>
                <span
                  className={`text-2xl font-mono font-bold ${remainingAmount >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {remainingAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
          {predictedRemainingAmount && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
              <span className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                Saldo Previsto
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm font-mono">R$</span>
                <span
                  className={`text-2xl font-mono font-bold ${predictedRemainingAmount >= 0 ? "text-indigo-400" : "text-red-400"}`}
                >
                  {predictedRemainingAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 p-6 rounded-2xl flex flex-col items-center text-center gap-3 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

          <span className="text-indigo-400 uppercase text-[10px] font-bold tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full">
            Dica de Consumo Inteligente
          </span>

          <h2 className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-md">
            Você pode gastar até{" "}
            <span className="text-indigo-400 font-mono font-bold text-2xl block md:inline mt-2 md:mt-0">
              R${" "}
              {(predictedRemainingAmount / 30).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            por dia sem comprometer seu orçamento mensal.
          </h2>

          <p className="text-slate-500 text-xs italic">
            *Cálculo baseado em uma projeção para os próximos 30 dias e saldo
            total previsto de{" "}
            <span>
              {" "}
              R${" "}
              {predictedRemainingAmount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

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

import { deleteExpense, updateSpentAmount } from "../services/financialService";
import { useState } from "react";
import ExpenseFixed from "./ExpenseFixed";
import ExpenseVariable from "./ExpenseVariable";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function FinancialList({
  expenses,
  removeExpense,
  handleTogglePaid,
  updateExpenseSpent,
  handleUpdateExpense,
  setRemainingAmount,
  togglingId,
}) {
  const [spentValues, setSpentValues] = useState({});
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const fixedExpenses = expenses.filter(
    (expense) => expense && expense.type === "FIXED",
  );

  const variableExpenses = expenses.filter(
    (expense) => expense && expense.type !== "FIXED",
  );

  function remainingBalance(amount, spentAmount) {
    const remaining = amount - spentAmount;
    return remaining;
  }

  async function handleDeletedExpense(id) {
    const token = localStorage.getItem("token");

    try {
      if (!id) throw new Error("Despesa já foi removida");

      const data = await deleteExpense(token, id);
      removeExpense(id, data.expense);

      addNotification("Despesa removida com sucesso", "success");
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      addNotification(error.message || "Erro de conexão", "error");
    }
  }

  async function handleUpdateSpAm(id) {
    const token = localStorage.getItem("token");
    const value = spentValues[id] ?? 0;

    try {
      const data = await updateSpentAmount(id, value, token);

      updateExpenseSpent(id, data.spentAmount);

      setRemainingAmount((prev) => prev - value);

      setSpentValues((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (error) {
      console.error("Erro ao atualizar gasto:", error);
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mt-4">
      {createPortal(
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300 min-w-[320px] p-4 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-4 ${
                notif.type === "success"
                  ? "bg-slate-900/95 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-slate-900/95 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              }`}
            >
              <div
                className={`p-2 rounded-lg border ${
                  notif.type === "success"
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                    : "bg-red-500/20 border-red-500/30 text-red-500"
                }`}
              >
                {notif.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-[10px] uppercase font-black tracking-wider ${
                    notif.type === "success"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {notif.type === "success" ? "Sucesso" : "Erro de Sistema"}
                </p>
                <p className="text-slate-200 text-sm font-medium">
                  {notif.message}
                </p>
              </div>

              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id),
                  )
                }
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}

      {expenses.length === 0 && (
        <div className="flex flex-col items-center py-10 px-4 border-2 border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 font-medium italic">
            Nenhuma despesa cadastrada ainda...
          </p>
        </div>
      )}

      {fixedExpenses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <span className="flex-none bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-indigo-500/30">
              Fixos
            </span>
            <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/30 to-transparent" />
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-1 backdrop-blur-sm border border-slate-800/50">
            <ExpenseFixed
              fixedExpenses={fixedExpenses}
              handleTogglePaid={handleTogglePaid}
              handleDeletedExpense={handleDeletedExpense}
              handleUpdateExpense={handleUpdateExpense}
              togglingId={togglingId}
            />
          </div>
        </div>
      )}

      {variableExpenses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <span className="flex-none bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-amber-500/30">
              Variáveis
            </span>
            <div className="h-[1px] w-full bg-gradient-to-r from-amber-500/30 to-transparent" />
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-1 backdrop-blur-sm border border-slate-800/50">
            <ExpenseVariable
              variableExpenses={variableExpenses}
              remainingBalance={remainingBalance}
              spentValues={spentValues}
              setSpentValues={setSpentValues}
              handleUpdateSpAm={handleUpdateSpAm}
              handleDeletedExpense={handleDeletedExpense}
              handleUpdateExpense={handleUpdateExpense}
            />
          </div>
        </div>
      )}
    </div>
  );
}

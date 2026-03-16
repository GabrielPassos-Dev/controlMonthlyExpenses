import { deleteExpense, updateSpentAmount } from "../services/financialService";
import { useState } from "react";
import ExpenseFixed from "./ExpenseFixed";
import ExpenseVariable from "./ExpenseVariable";

export default function FinancialList({
  expenses,
  removeExpense,
  handleTogglePaid,
  updateExpenseSpent,
  handleUpdateExpense,
  setRemainingAmount,
}) {
  const [spentValues, setSpentValues] = useState({});

  const fixedExpenses = expenses.filter((expense) => expense.type === "FIXED");

  const variableExpenses = expenses.filter(
    (expense) => expense.type !== "FIXED",
  );

  function remainingBalance(amount, spentAmount) {
    const remaining = amount - spentAmount;
    return remaining;
  }

  async function handleDeletedExpense(id) {
    const token = localStorage.getItem("token");
    try {
      const data = await deleteExpense(token, id);
      removeExpense(id, data.deletedExpense);
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      alert(error.message);
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

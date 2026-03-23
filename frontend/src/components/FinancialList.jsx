import { useState } from "react";
import ExpenseFixed from "./ExpenseFixed";
import ExpenseVariable from "./ExpenseVariable";
import { useFinancial } from "../context/FinancialContext";

export default function FinancialList({ controller }) {
  const [spentValues, setSpentValues] = useState({});
  const { expenses } = useFinancial();
  const { handleUpdateSpAm } = controller;

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

  async function onConfirmSpent(id) {
    const value = spentValues[id] ?? 0;
    await handleUpdateSpAm(id, value);

    setSpentValues((prev) => ({ ...prev, [id]: "" }));
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
              controller={controller}
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
              onConfirmSpent={onConfirmSpent}
              controller={controller}
            />
          </div>
        </div>
      )}
    </div>
  );
}

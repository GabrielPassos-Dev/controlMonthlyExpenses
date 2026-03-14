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
    <div className="flex flex-col gap-4  max-w-2xl">
      {expenses.length === 0 && (
        <p className="text-white">Nenhuma despesa cadastrada.</p>
      )}

      {fixedExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Fixos</h2>

          <ExpenseFixed
            fixedExpenses={fixedExpenses}
            handleTogglePaid={handleTogglePaid}
            handleDeletedExpense={handleDeletedExpense}
            handleUpdateExpense={handleUpdateExpense}
          />
        </>
      )}

      {variableExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Variáveis</h2>

          <ExpenseVariable
            variableExpenses={variableExpenses}
            remainingBalance={remainingBalance}
            spentValues={spentValues}
            setSpentValues={setSpentValues}
            handleUpdateSpAm={handleUpdateSpAm}
            handleDeletedExpense={handleDeletedExpense}
            handleUpdateExpense={handleUpdateExpense}
          />
        </>
      )}
    </div>
  );
}

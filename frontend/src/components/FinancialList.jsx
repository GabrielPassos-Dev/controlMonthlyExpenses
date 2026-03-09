import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { deletedExpense } from "../services/financialService";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "../components/ui/button";
import { FaCheck } from "react-icons/fa";

export default function FinancialList({
  expenses,
  removeExpense,
  handleTogglePaid,
}) {
  const [gasto, setGasto] = useState(0);

  async function handleDeletedExpense(id) {
    const token = localStorage.getItem("token");
    try {
      const data = await deletedExpense(token, id);
      removeExpense(id, data.deletedExpense);
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      alert(error.message);
    }
  }

  const fixedExpenses = expenses.filter((expense) => expense.type === "FIXED");

  const variableExpenses = expenses.filter(
    (expense) => expense.type !== "FIXED",
  );

  function remainingBalance(amount, spentAmount) {
    const remaining = amount - spentAmount;
    return remaining;
  }

  return (
    <div className="flex flex-col gap-2  max-w-2xl">
      {expenses.length === 0 && (
        <p className="text-white">Nenhuma despesa cadastrada.</p>
      )}

      {fixedExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Fixos</h2>

          {fixedExpenses.map((expense) => (
            <div key={expense.id} className="flex flex-row gap-4">
              <div className="bg-slate-700 p-2 rounded-md flex gap-8 sm:gap-14 justify-between items-center w-full">
                <span className="text-white">{expense.name}</span>

                <span className="text-green-400">
                  R$ {expense.amount.toFixed(2).replace(".", ",")}
                </span>

                <span className="hidden md:block text-white">
                  {expense.paid ? (
                    <p className="text-green-500">PAGO</p>
                  ) : (
                    <p className="text-red-400">PENDENTE</p>
                  )}
                </span>

                <input
                  type="checkbox"
                  checked={expense.paid}
                  onChange={() => handleTogglePaid(expense)}
                  className="size-5"
                />
              </div>

              <button className="flex justify-center items-center">
                <FaEdit size={20} />
              </button>

              <button
                onClick={() => handleDeletedExpense(expense.id)}
                className="flex justify-center items-center"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          ))}
        </>
      )}

      {variableExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Variáveis</h2>

          {variableExpenses.map((expense) => (
            <div key={expense.id} className="flex flex-row gap-4">
              <div className="flex flex-col gap-1">
                <div className="bg-slate-700 p-2 rounded-md flex  sm:gap-14 justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-white">{expense.name}</span>
                    <span className="text-green-400">
                      R$ {expense.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white">Valor Gasto</p>
                    <span className="text-green-400">
                      R$ {expense.spentAmount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white">Saldo restante</p>
                    <span className="text-green-400">
                      R${" "}
                      {remainingBalance(expense.amount, expense.spentAmount)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-700 p-2 rounded-md flex gap-8 sm:gap-14 justify-between items-center w-full">
                  <NumericFormat
                    id="salary"
                    className="w-35 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
                    value={gasto || ""}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder="Registrar gasto"
                    onValueChange={(values) => setGasto(values.floatValue ?? 0)}
                  />

                  <button className="text-sm bg-blue-500 p-2 rounded-xl">
                    <FaCheck />
                  </button>

                  <button className="flex justify-center items-center">
                    <FaEdit size={20} />
                  </button>

                  <button
                    onClick={() => handleDeletedExpense(expense.id)}
                    className="flex justify-center items-center"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

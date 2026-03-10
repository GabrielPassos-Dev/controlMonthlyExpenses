import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  deletedExpense,
  updateSpentAmount,
} from "../services/financialService";
import { NumericFormat } from "react-number-format";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { Button } from "./ui/button";

export default function FinancialList({
  expenses,
  removeExpense,
  handleTogglePaid,
  updateExpenseSpent,
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
      const data = await deletedExpense(token, id);
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
    <div className="flex flex-col gap-3  max-w-2xl">
      {expenses.length === 0 && (
        <p className="text-white">Nenhuma despesa cadastrada.</p>
      )}

      {fixedExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Fixos</h2>

          {fixedExpenses.map((expense) => (
            <div key={expense.id} className="flex flex-row gap-4">
              <div className="bg-slate-700 p-2 rounded-md flex gap-4 sm:gap-14 justify-between items-center w-full border">
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

              <Button variant="smallBlue">
                <FaEdit />
              </Button>

              <Button
                onClick={() => handleDeletedExpense(expense.id)}
                variant="smallDanger"
              >
                <FaTrashAlt />
              </Button>
            </div>
          ))}
        </>
      )}

      {variableExpenses.length > 0 && (
        <>
          <h2 className="text-white font-bold">Gastos Variáveis</h2>

          {variableExpenses.map((expense) => (
            <div key={expense.id} className="flex flex-row gap-4">
              <div className="flex flex-col gap-1 border rounded-md ">
                <div className="bg-slate-700 p-2 rounded-tr-md  rounded-tl-md flex  sm:gap-14 justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-white">{expense.name}</span>
                    <span className="text-green-400">
                      R$ {expense.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white">Valor Gasto</p>
                    <span className="text-green-400">
                      R${" "}
                      {(expense.spentAmount ?? 0).toFixed(2).replace(".", ",")}
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
                <div className="bg-slate-800 p-2 rounded-br-md rounded-bl-md flex gap-4 sm:gap-14 justify-between items-center w-full">
                  <NumericFormat
                    id="salary"
                    className="w-35 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
                    value={spentValues[expense.id] || ""}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder="Registrar gasto"
                    onValueChange={(values) =>
                      setSpentValues((prev) => ({
                        ...prev,
                        [expense.id]: values.floatValue ?? 0,
                      }))
                    }
                  />

                  <Button
                    variant="smallBlue"
                    onClick={() => handleUpdateSpAm(expense.id)}
                  >
                    <FaCheck />
                  </Button>

                  <Button variant="smallBlue">
                    <FaEdit />
                  </Button>

                  <Button
                    onClick={() => handleDeletedExpense(expense.id)}
                    variant="smallDanger"
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

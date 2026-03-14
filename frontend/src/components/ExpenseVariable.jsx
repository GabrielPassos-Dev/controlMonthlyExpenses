import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { FaCheck } from "react-icons/fa";
import { Button } from "./ui/Button";
import { useState } from "react";
import Modal from "./Modal";
import { Input } from "./ui/Input";
import { LiaTimesSolid } from "react-icons/lia";

export default function ExpenseVariable({
  variableExpenses,
  remainingBalance,
  spentValues,
  setSpentValues,
  handleUpdateSpAm,
  handleDeletedExpense,
  handleUpdateExpense,
}) {
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [newValue, setNewValue] = useState({});
  const [newName, setNewName] = useState({});
  const [newSpAm, setSpAm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitSave(expense) {
    try {
      setIsLoading(true);
      await handleUpdateExpense(expense.id, {
        name: newName[expense.id] ?? expense.name,
        amount: newValue[expense.id] ?? expense.amount,
        spentAmount: newSpAm[expense.id] ?? expense.spentAmount,
      });

      setEditingExpenseId(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {variableExpenses.map((expense) => (
        <div key={expense.id} className="flex flex-row gap-4">
          <div className="flex flex-col gap-1 border rounded-md sm:flex-row  w-full ">
            <div className="bg-slate-700 p-2 rounded-tr-md  rounded-tl-md flex  sm:gap-4 justify-between items-center w-full ">
              <div className="flex flex-col">
                <span className="text-white">{expense.name}</span>
                <span className="text-green-400">
                  R$ {expense.amount.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-white">Valor Gasto</p>
                <span className="text-green-400">
                  R$ {(expense.spentAmount ?? 0).toFixed(2).replace(".", ",")}
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
            <div className="bg-slate-800 p-2 rounded-br-md rounded-bl-md flex gap-4 sm:gap-4 justify-between items-center w-full">
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

              <Button
                variant="smallBlue"
                onClick={() => setEditingExpenseId(expense.id)}
              >
                <FaEdit />
              </Button>

              <Button
                onClick={() => handleDeletedExpense(expense.id)}
                variant="smallDanger"
              >
                <FaTrashAlt />
              </Button>
            </div>
            {editingExpenseId === expense.id && (
              <Modal
                isOpen={editingExpenseId === expense.id}
                onClose={() => setEditingExpenseId(null)}
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-center">
                    Editar Despesa
                  </h2>

                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      placeholder="Nome"
                      value={newName[expense.id] || ""}
                      onChange={(event) =>
                        setNewName((prev) => ({
                          ...prev,
                          [expense.id]: event.target.value ?? "",
                        }))
                      }
                    ></Input>

                    <span className="flex flex-row gap-3">
                      <NumericFormat
                        id="salary"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
                        value={newValue[expense.id] || ""}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        placeholder="Valor Previsto"
                        onValueChange={(values) =>
                          setNewValue((prev) => ({
                            ...prev,
                            [expense.id]: values.floatValue ?? 0,
                          }))
                        }
                      />
                      <NumericFormat
                        id="salary"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
                        value={newSpAm[expense.id] || ""}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        placeholder="Valor Gasto"
                        onValueChange={(values) =>
                          setSpAm((prev) => ({
                            ...prev,
                            [expense.id]: values.floatValue ?? 0,
                          }))
                        }
                      />
                    </span>
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button
                      onClick={() => handleSubmitSave(expense)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>

                    <button
                      onClick={() => {
                        setEditingExpenseId(null);
                      }}
                      className="absolute top-3 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                    >
                      <LiaTimesSolid />
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import Modal from "./Modal";

export default function ExpenseFixed({
  fixedExpenses,
  handleTogglePaid,
  handleDeletedExpense,
  handleUpdateExpense,
}) {
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [newValue, setNewValue] = useState({});
  const [newName, setNewName] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitSave(expense) {
    try {
      setIsLoading(true);
      await handleUpdateExpense(expense.id, {
        name: newName[expense.id] ?? expense.name,
        amount: newValue[expense.id] ?? expense.amount,
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
      {fixedExpenses.map((expense) => (
        <div key={expense.id} className="flex flex-row gap-4">
          <div className="bg-slate-700 p-2 rounded-md flex gap-2 sm:gap-10 justify-between items-center w-full sm:w-2xl border">
            <span className="text-white">{expense.name}</span>

            <span className="text-green-400">
              R$ {expense.amount.toFixed(2).replace(".", ",")}
            </span>

            <span className="hidden sm:block text-white">
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
          {editingExpenseId === expense.id && (
            <Modal
              isOpen={editingExpenseId === expense.id}
              onClose={() => setEditingExpenseId(null)}
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center">
                  Editar Despesa
                </h2>

                <div className="flex flex-row gap-4">
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
                    placeholder="Valor"
                    onValueChange={(values) =>
                      setNewValue((prev) => ({
                        ...prev,
                        [expense.id]: values.floatValue ?? 0,
                      }))
                    }
                  />
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
      ))}
    </>
  );
}

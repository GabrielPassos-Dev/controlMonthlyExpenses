import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { FaCheck } from "react-icons/fa";
import { Button } from "./ui/Button";
import { useState } from "react";
import Modal from "./Modal";
import { LiaTimesSolid } from "react-icons/lia";

export default function ExpenseVariable({
  variableExpenses,
  remainingBalance,
  spentValues,
  setSpentValues,
  onConfirmSpent,
  controller,
}) {
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [newValue, setNewValue] = useState({});
  const [newName, setNewName] = useState({});
  const [newSpAm, setSpAm] = useState({});

  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { handleDeletedExpense, handleUpdateExpense } = controller;

  async function handleUpdate(exp) {
    try {
      setUpdatingId(exp.id);
      await handleUpdateExpense(exp.id, {
        name: newName[exp.id] ?? exp.name,
        amount: newValue[exp.id] ?? exp.amount,
        spentAmount: newSpAm[exp.id] ?? exp.spentAmount,
      });

      setEditingExpenseId(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(exp) {
    try {
      setDeletingId(exp);
      await handleDeletedExpense(exp);
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert(error.message || "Erro ao deletar");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {variableExpenses.map((expense) => {
        const percent = Math.min(
          (expense.spentAmount / expense.amount) * 100,
          100,
        );
        const isOverBudget = expense.spentAmount > expense.amount;

        const getBarColor = () => {
          if (isOverBudget)
            return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
          if (percent >= 80) return "bg-amber-500";
          if (percent >= 50) return "bg-indigo-400";
          return "bg-emerald-500";
        };

        return (
          <div
            key={expense.id}
            className="flex flex-col w-full bg-slate-900/40 rounded-2xl border border-slate-800/50 overflow-hidden shadow-xl transition-all hover:border-slate-700/50"
          >
            <div className="bg-slate-800/40 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center border-b border-slate-800/50">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Descrição
                </span>
                <span className="text-white font-medium truncate">
                  {expense.name}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Previsto
                </span>
                <span className="text-slate-300 font-mono text-sm">
                  R$ {expense.amount.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-500/70 tracking-wider">
                  Já Gasto
                </span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  R$ {(expense.spentAmount ?? 0).toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="flex flex-col border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Disponível
                </span>
                <span
                  className={`font-mono font-bold text-sm ${isOverBudget ? "text-red-400" : "text-emerald-400"}`}
                >
                  R${" "}
                  {remainingBalance(expense.amount, expense.spentAmount)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-slate-800">
              <div
                className={`h-full transition-all duration-500 ${getBarColor()}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="p-3 bg-slate-900/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-56">
                <NumericFormat
                  className="w-full h-10 pl-3 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-sm focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  value={spentValues[expense.id] || ""}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Registrar novo gasto"
                  onValueChange={(v) =>
                    setSpentValues((prev) => ({
                      ...prev,
                      [expense.id]: v.floatValue ?? 0,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && onConfirmSpent(expense.id)
                  }
                />
                <button
                  onClick={() => onConfirmSpent(expense.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors p-1"
                  title="Confirmar gasto"
                >
                  <FaCheck size={14} />
                </button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="secondary"
                  className="!w-10 !h-10 !p-0 border-slate-700 hover:bg-slate-700"
                  onClick={() => setEditingExpenseId(expense.id)}
                >
                  <FaEdit size={14} className="text-slate-400" />
                </Button>
                <Button
                  variant="danger"
                  className="!w-10 !h-10 !p-0"
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                >
                  {deletingId === expense.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaTrashAlt size={14} />
                  )}
                </Button>
              </div>
            </div>

            {editingExpenseId === expense.id && (
              <Modal isOpen={true} onClose={() => setEditingExpenseId(null)}>
                <div className="flex flex-col gap-6 relative">
                  <button
                    onClick={() => setEditingExpenseId(null)}
                    className="absolute -top-2 -right-2 text-slate-500 hover:text-white transition"
                  >
                    <LiaTimesSolid size={20} />
                  </button>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">
                      Editar Variável
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                      Ajuste os valores planejados e reais
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
                        Nome
                      </label>
                      <input
                        className="w-full h-12 p-3 bg-slate-800 text-white border border-slate-700 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        placeholder="Nome"
                        value={newName[expense.id] || ""}
                        onChange={(e) =>
                          setNewName((p) => ({
                            ...p,
                            [expense.id]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
                          Previsto
                        </label>
                        <NumericFormat
                          className="w-full h-12 px-4 bg-slate-800 border border-slate-700 text-white rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          value={newValue[expense.id] || ""}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          placeholder="R$ 0,00"
                          onValueChange={(v) =>
                            setNewValue((p) => ({
                              ...p,
                              [expense.id]: v.floatValue ?? 0,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-amber-500/70 ml-1 mb-1 block">
                          Já Gasto
                        </label>
                        <NumericFormat
                          className="w-full h-12 px-4 bg-slate-800 border border-slate-700 text-amber-400 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-amber-500"
                          value={newSpAm[expense.id] || ""}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          placeholder="R$ 0,00"
                          onValueChange={(v) =>
                            setSpAm((p) => ({
                              ...p,
                              [expense.id]: v.floatValue ?? 0,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleUpdate(expense)}
                    disabled={updatingId === expense.id}
                  >
                    {updatingId === expense.id
                      ? "Salvando..."
                      : "Salvar Alterações"}
                  </Button>
                </div>
              </Modal>
            )}
          </div>
        );
      })}
    </div>
  );
}

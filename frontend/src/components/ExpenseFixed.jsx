import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { Button } from "./ui/Button";
import { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import Modal from "./Modal";
import { useFinancialController } from "../hooks/useFinancialController";

export default function ExpenseFixed({ fixedExpenses }) {
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [newValue, setNewValue] = useState({});
  const [newName, setNewName] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const {
    togglingId,
    handleTogglePaid,
    handleDeletedExpense,
    handleUpdateExpense,
  } = useFinancialController();

  async function handleUpdate(exp) {
    try {
      setUpdatingId(exp.id);
      await handleUpdateExpense(exp.id, {
        name: newName[exp.id] ?? exp.name,
        amount: newValue[exp.id] ?? exp.amount,
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
    <div className="flex flex-col gap-3 w-full">
      {fixedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="group flex flex-col sm:flex-row gap-3 items-center w-full"
        >
          <div className="bg-slate-800/60 hover:bg-slate-800 transition-colors p-3 md:p-4 rounded-xl flex justify-between items-center w-full border border-slate-700/50 shadow-sm">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={expense.paid}
                disabled={!!togglingId[expense.id]}
                onChange={() => handleTogglePaid(expense)}
                className={`appearance-none w-8 h-8 rounded-md border-2 border-slate-600 bg-slate-800 checked:bg-indigo-500 checked:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 transition-all duration-200 cursor-pointer relative before:content-[''] before:absolute before:inset-0 before:flex before:items-center before:justify-center checked:before:content-['✓'] before:text-white before:text-[18px] before:font-black ${togglingId[expense.id] ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              />

              <div className="flex flex-col">
                <span
                  className={`text-slate-100 font-medium transition-all ${expense.paid ? "line-through text-slate-500" : ""}`}
                >
                  {expense.name}
                </span>
                <span className="text-xs text-indigo-400 font-bold sm:hidden">
                  {expense.paid ? "PAGO" : "PENDENTE"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-emerald-400 font-mono font-bold text-sm md:text-base">
                R$ {expense.amount.toFixed(2).replace(".", ",")}
              </span>

              <span className="hidden sm:block">
                {expense.paid ? (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-black tracking-widest border border-emerald-500/20">
                    PAGO
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded font-black tracking-widest border border-red-500/20">
                    PENDENTE
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-xl border-slate-700"
              onClick={() => setEditingExpenseId(expense.id)}
            >
              <FaEdit size={16} className="text-slate-400" />
            </Button>

            <Button
              variant="danger"
              className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-xl"
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

          {editingExpenseId === expense.id && (
            <Modal
              isOpen={editingExpenseId === expense.id}
              onClose={() => setEditingExpenseId(null)}
            >
              <div className="bg-slate-900 p-6 rounded-2xl flex flex-col gap-6 relative">
                <button
                  onClick={() => setEditingExpenseId(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
                >
                  <LiaTimesSolid size={24} />
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    Editar Despesa
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Altere os detalhes do gasto fixo
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
                      Nome da Despesa
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 p-3 bg-slate-800 text-white border border-slate-700 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                      placeholder="Nome"
                      value={newName[expense.id] || ""}
                      onChange={(e) =>
                        setNewName((prev) => ({
                          ...prev,
                          [expense.id]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
                      Valor
                    </label>
                    <NumericFormat
                      className="w-full h-12 px-4 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl font-mono font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newValue[expense.id] || ""}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      placeholder="R$ 0,00"
                      onValueChange={(v) =>
                        setNewValue((prev) => ({
                          ...prev,
                          [expense.id]: v.floatValue ?? 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleUpdate(expense)}
                  disabled={updatingId === expense.id}
                >
                  {updatingId === expense.id
                    ? "Salvando..."
                    : "Confirmar Alterações"}
                </Button>
              </div>
            </Modal>
          )}
        </div>
      ))}
    </div>
  );
}

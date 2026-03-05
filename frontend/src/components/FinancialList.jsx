import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { deletedExpense } from "../services/financialService";

export default function FinancialList({ expenses, removeExpense }) {
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

  return (
    <div className="flex flex-col gap-2  max-w-2xl">
      {expenses.length === 0 && (
        <p className="text-white">Nenhuma despesa cadastrada.</p>
      )}
      {expenses.map((expense) => (
        <div key={expense.id} className="flex flex-row gap-4">
          <div className="bg-slate-700 p-2 rounded-md flex gap-12 justify-between items-center w-60">
            <span className="text-white">{expense.name}</span>

            <span className="text-green-400">
              R$ {expense.amount.toFixed(2).replace(".", ",")}
            </span>
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

          <span className="flex justify-center items-center">
            <input type="checkbox" className="size-5" />
          </span>
        </div>
      ))}
    </div>
  );
}

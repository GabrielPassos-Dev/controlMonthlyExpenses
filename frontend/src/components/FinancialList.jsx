import { FaTrashAlt, FaEdit } from "react-icons/fa";

export default function FinancialList({ expenses, removeExpense }) {
  async function deletedExpense(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/financial/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      removeExpense(id, data.deletedExpense);
    } else {
      alert("Erro ao deletar");
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
            onClick={() => deletedExpense(expense.id)}
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

import { useEffect, useState } from "react";

export default function FinancialList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/financial", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setExpenses(data);
        } else {
          alert(data.error || "Erro ao carregar despesas");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor");
      }
    }
    fetchExpenses();
  }, []);

  return (
    <div className="flex flex-col gap-2  max-w-2xl">
      {expenses.length === 0 && (
        <p className="text-white">Nenhuma despesa cadastrada.</p>
      )}
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-slate-700 p-2 rounded-md flex gap-12 justify-between items-center"
        >
          <span className="text-white">{expense.name}</span>
          <span className="text-green-400">
            R$ {expense.amount.toFixed(2).replace(".", ",")}
          </span>
        </div>
      ))}
    </div>
  );
}

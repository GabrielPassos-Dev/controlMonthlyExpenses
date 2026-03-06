import { useState } from "react";
import { useEffect } from "react";
import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";
import { Button } from "../components/ui/button";
import { fetchExpenses } from "../services/financialService.js";

export default function Financial() {
  const [expenses, setExpenses] = useState([]);
  const [salarySnapshot, setSalarySnapshot] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  async function handleFetchExpenses() {
    const token = localStorage.getItem("token");
    try {
      const data = await fetchExpenses(token);
      setExpenses(data.expenses);
      setSalarySnapshot(data.panel.salarySnapshot);
      setRemainingAmount(data.panel.remainingAmount);
    } catch (error) {
      console.error("Erro ao carregar despesas: ", error);
      alert(error.message);
    }
  }

  useEffect(() => {
    handleFetchExpenses();
  }, []);

  function addExpense(newExpense) {
    setExpenses((prev) => [newExpense, ...prev]);
    setRemainingAmount((prev) => prev - newExpense.amount);
  }

  function removeExpense(id, expense) {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    setRemainingAmount((prev) => prev + expense.amount);
  }

  return (
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 items-center justify-center">
      <p className="bg-white p-1 rounded-md w-60 text-center font-bold">
        {`Salário: R$ ${salarySnapshot.toFixed(2).replace(".", ",")}`}
      </p>
      <FinancialControl addExpense={addExpense} />
      <FinancialList expenses={expenses} removeExpense={removeExpense} />
      {salarySnapshot !== remainingAmount && (
        <p className="bg-white p-1 rounded-md w-60 text-center font-bold">{`Saldo restante: R$ ${remainingAmount.toFixed(2).replace(".", ",")}`}</p>
      )}
      <Button> Finalizar Painel</Button>
    </div>
  );
}

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { createExpense } from "../services/financialService.js";
import { Input } from "./ui/Input";

export default function FinancialControl({ addExpense }) {
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingT, setIstLoadingT] = useState(false);

  async function handleCreateExpenses(type) {
    const token = localStorage.getItem("token");
    try {
      const data = await createExpense(token, name, amount, type);
      addExpense(data);
    } catch (error) {
      console.error("Erro ao criar nova despesa:", error);
      alert(error.message);
    }
  }

  async function handleSubmit(type) {
    type === "FIXED" ? setIsLoading(true) : setIstLoadingT(true);
    await handleCreateExpenses(type);
    type === "FIXED" ? setIsLoading(false) : setIstLoadingT(false);
    setName("");
    setAmount(0);
  }

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-md w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 justify-center items-center">
        <p className="text-white text-2xl">Adicionar Despesa</p>
        <span className="flex flex-row gap-4">
          <Input
            type="text"
            placeholder="ex: Conta de luz"
            className="max-w-full min-w-10 h-8 rounded-md text-sm md:text-lg"
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></Input>
          <NumericFormat
            className=" text-sm md:text-lg max-w-full min-w-5 h-8 p-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amount || ""}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            placeholder="R$ 0,00"
            onValueChange={(values) => setAmount(values.floatValue ?? 0)}
          />
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <button
          onClick={() => handleSubmit("FIXED")}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition w-full"
        >
          {isLoading ? "Enviando..." : "Adicionar Gasto Fixo"}
        </button>
        <button
          onClick={() => handleSubmit("VARIABLE")}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition w-full"
        >
          {isLoadingT ? "Enviando..." : "Adicionar Gasto Variavel"}
        </button>
      </div>
    </div>
  );
}

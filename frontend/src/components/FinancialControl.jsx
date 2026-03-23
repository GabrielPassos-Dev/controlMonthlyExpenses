import { useState } from "react";
import { NumericFormat } from "react-number-format";

export default function FinancialControl({ controller }) {
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingT, setIstLoadingT] = useState(false);

  const { handleCreateExpense } = controller;

  async function handleSubmit(type) {
    type === "FIXED" ? setIsLoading(true) : setIstLoadingT(true);

    try {
      await handleCreateExpense(name, amount, type);
      setName("");
      setAmount(0);
    } finally {
      type === "FIXED" ? setIsLoading(false) : setIstLoadingT(false);
    }
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full border border-slate-800 flex flex-col gap-6">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex flex-col items-center gap-1">
          <p className="text-white text-xl md:text-2xl font-semibold tracking-tight">
            Nova Despesa
          </p>
          <div className="h-1 w-10 bg-indigo-500 rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
              Descrição
            </label>
            <input
              type="text"
              placeholder="Ex: Aluguel, Luz..."
              className="w-full h-12 p-3 bg-slate-800 text-white border border-slate-700 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="w-full md:w-44">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">
              Valor (R$)
            </label>
            <NumericFormat
              className="w-full h-12 p-3 bg-slate-800 text-white border border-slate-700 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
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
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full">
        <button
          onClick={() => handleSubmit("FIXED")}
          disabled={isLoading || isLoadingT}
          className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Gasto Fixo"
          )}
        </button>

        <button
          onClick={() => handleSubmit("VARIABLE")}
          disabled={isLoading || isLoadingT}
          className="flex-1 bg-slate-700 text-white font-bold py-3.5 rounded-xl hover:bg-slate-600 active:scale-[0.98] transition-all shadow-lg border border-slate-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoadingT ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Gasto Variável"
          )}
        </button>
      </div>
    </div>
  );
}

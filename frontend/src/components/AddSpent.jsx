import { useState } from "react";
import { NumericFormat } from "react-number-format";

export default function AddSpent() {
  const [value, setValue] = useState(0);

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-md w-80 flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <p className="text-white text-2xl">Adicione os gastos</p>
        <span className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Digite o Titulo"
            className="text-white w-40 h-8 border p-2 border-white bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <NumericFormat
            className="w-24 h-8 p-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value || ""}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            placeholder="R$ 0,00"
            onValueChange={(values) => setValue(values.floatValue ?? 0)}
          />
        </span>
      </div>
      <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition w-full">
        Adicionar Gasto Fixo
      </button>
    </div>
  );
}

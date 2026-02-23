export default function FinancialControl() {
  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-md w-80 flex flex-col gap-4 justify-center items-center">
      <div className="flex gap-4 justify-center items-center">
        <span className="text-white">Digite seu salario</span>
        <input
          type="number"
          className="text-white w-20 h-8 border p-2 border-white bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
          Adicionar salario
        </button>
      </div>
    </div>
  );
}

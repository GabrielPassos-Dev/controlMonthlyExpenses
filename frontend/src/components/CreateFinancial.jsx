import { Link } from "react-router-dom";

export default function CreateFinancial() {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-md w-80 flex flex-col gap-4 justify-center items-center">
      <h1> Criar novo Painel Fianceiro</h1>
      <Link
        to={"/financial"}
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition w-full text-center"
      >
        Criar
      </Link>
    </div>
  );
}

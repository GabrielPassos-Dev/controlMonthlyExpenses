import { Link } from "react-router-dom";

export default function CreateFinancial() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h1 className="text-[24px] font-bold text-center">
        {" "}
        Criar novo Painel 
      </h1>
      <Link
        to={"/financial"}
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition text-center "
      >
        Criar
      </Link>
    </div>
  );
}

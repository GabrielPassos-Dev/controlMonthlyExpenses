import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function CreateFinancial() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h1 className="text-[24px] font-bold text-center"> Criar novo Painel</h1>
      <Button to={"/financial"}>Criar</Button>
    </div>
  );
}

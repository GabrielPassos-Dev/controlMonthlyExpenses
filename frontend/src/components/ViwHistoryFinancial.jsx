import { Button } from "./ui/Button";

export default function ViwHistoryFinancial() {
  return (
    <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">Ver historico</h1>
      <Button to={"/history"}>Ver</Button>
    </div>
  );
}

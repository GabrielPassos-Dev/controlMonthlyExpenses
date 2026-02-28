import { Button } from "./ui/button";

export default function ViwHistoryFinancial() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">Ver historico</h1>
      <Button to={"/history"}>Ver</Button>
    </div>
  );
}

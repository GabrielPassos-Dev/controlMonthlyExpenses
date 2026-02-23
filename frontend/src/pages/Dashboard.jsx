import CreateFinancial from "../components/CreateFinancial";
import ViwHistoryFinancial from "../components/ViwHistoryFinancial";

export default function Dashboard() {
  return (
   <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 justify-center items-center px-4 overflow-x-hidden">
      <CreateFinancial />
      <ViwHistoryFinancial />
    </div>
  );
}

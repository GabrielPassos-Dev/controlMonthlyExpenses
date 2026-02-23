import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";

export default function Financial() {
  return (
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 items-center justify-center">
      <FinancialControl />
      <FinancialList />
    </div>
  );
}

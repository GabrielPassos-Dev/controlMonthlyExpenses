import AddSalary from "./AddSalary";
import AddSpent from "./AddSpent";

export default function FinancialControl({ addSalary }) {
  return (
    <div>
      <AddSalary addSalary={addSalary} />
      <AddSpent />
    </div>
  );
}

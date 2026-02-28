import { useState } from "react";
import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";
import { v4 as uuidv4 } from "uuid";

export default function Financial() {
  const [list, setList] = useState([]);
  const id = uuidv4();

  function addSalary(salary) {
    setList((prev) => [...prev, { id: id, salary: salary, spent: [] }]);
  }

  return (
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 items-center justify-center">
      <FinancialControl addSalary={addSalary} />
      <FinancialList list={list} />
    </div>
  );
}

// {
//   id,
//   name,
//   email,
//   passwordHash,
//   salarioPadrao
// }

// {
//   id,
//   userId,
//   criadoEm,
//   salario,
//   gastos: [
//     { id, descricao, valor }
//   ]
// }

// context/FinancialContext.jsx
import { createContext, useContext, useState } from "react";

const FinancialContext = createContext();

export function FinancialProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [salarySnapshot, setSalarySnapshot] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  return (
    <FinancialContext.Provider
      value={{
        expenses,
        setExpenses,
        salarySnapshot,
        setSalarySnapshot,
        remainingAmount,
        setRemainingAmount,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  return useContext(FinancialContext);
}

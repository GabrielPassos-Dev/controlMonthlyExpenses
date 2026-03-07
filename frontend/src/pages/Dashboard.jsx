import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { LiaTimesSolid } from "react-icons/lia";
import CreateFinancial from "../components/CreateFinancial";
import ViwHistoryFinancial from "../components/ViwHistoryFinancial";
import Modal from "../components/Modal";
import { Button } from "../components/ui/button";
import { salaryEdit } from "../services/userService.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [salary, setSalary] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleSalaryEdit() {
    const token = localStorage.getItem("token");
    try {
      await salaryEdit(token, salary);
      setIsModalOpen(false);
      setSalary(0);
    } catch (error) {
      console.error("Erro ao atualizar salário:", error);
      alert(error.message);
    }
  }

  return (
    <main className="bg-gray-400 min-h-screen w-full flex items-center justify-center p-4">
      <section className="w-full max-w-2xl flex flex-col gap-4 justify-center items-center">
        <CreateFinancial />

        <ViwHistoryFinancial />

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Button onClick={logout}>Sair da conta</Button>

          <Button onClick={() => setIsModalOpen(true)}>Editar Salário</Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Editar Salário</h2>

            <NumericFormat
              id="salary"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
              value={salary || ""}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder="Digite seu salario R$ 0,00"
              onValueChange={(values) => setSalary(values.floatValue ?? 0)}
            />

            <div className="flex justify-between gap-2">
              <Button onClick={handleSalaryEdit}>Salvar</Button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
              >
                <LiaTimesSolid />
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import CreateFinancial from "../components/CreateFinancial";
import ViwHistoryFinancial from "../components/ViwHistoryFinancial";
import { Button } from "../components/ui/button";
import { useState } from "react";
import Modal from "../components/Modal";
import { NumericFormat } from "react-number-format";
import { LiaTimesSolid } from "react-icons/lia";

export default function Dashboard() {
  const navigate = useNavigate();
  const [salary, setSalary] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function salaryEdit() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/user/salary", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ salary: Number(salary) }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Salário atualizado com sucesso!");
        setIsModalOpen(false);
        setSalary(0);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar salário:", error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 justify-center items-center px-4 overflow-x-hidden">
      <CreateFinancial />
      <ViwHistoryFinancial />
      <Button className="w-full max-w-2xl" onClick={logout}>
        Sair da conta
      </Button>
      <Button onClick={() => setIsModalOpen(true)}>Editar Salário</Button>

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
            <Button onClick={salaryEdit}>Salvar</Button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
            >
              <LiaTimesSolid />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

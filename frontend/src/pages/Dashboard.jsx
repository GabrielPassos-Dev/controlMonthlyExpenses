import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { LiaTimesSolid } from "react-icons/lia";
import CreateFinancial from "../components/CreateFinancial";
import ViwHistoryFinancial from "../components/ViwHistoryFinancial";
import Modal from "../components/Modal";
import { Button } from "../components/ui/Button";
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
    <main className="bg-slate-950 min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-12 overflow-x-hidden">
      <section className="w-full max-w-2xl flex flex-col gap-8 items-center">
        <div className="w-full text-left mb-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Meu <span className="text-indigo-500">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Gerencie seu fluxo financeiro mensal
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <CreateFinancial />
          <ViwHistoryFinancial />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full mt-6 pt-6 border-t border-slate-900">
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-sm">Editar Salário</span>
          </Button>

          <Button
            variant="danger"
            onClick={logout}
            className="flex items-center justify-center gap-2"
          >
            Sair da conta
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <LiaTimesSolid size={20} />
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Configurar Renda</h2>
              <p className="text-slate-500 text-xs mt-1">
                Atualize seu salário base para os cálculos
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest">
                Novo Salário
              </label>
              <NumericFormat
                id="salary"
                className="w-full h-14 px-5 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xl font-bold placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                value={salary || ""}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="R$ 0,00"
                onValueChange={(values) => setSalary(values.floatValue ?? 0)}
                onKeyDown={(e) => e.key === "Enter" && handleSalaryEdit()}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSalaryEdit}
              className="py-4 shadow-indigo-500/20"
            >
              Confirmar Alteração
            </Button>
          </div>
        </Modal>
      </section>
    </main>
  );
}

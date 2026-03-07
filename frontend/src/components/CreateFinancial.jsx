import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { checkPanel, createPanel } from "../services/panelService";

export default function CreateFinancial() {
  const navigate = useNavigate();
  const [hasActivePanel, setHasActivePanel] = useState(null);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    async function handleCheckPanel() {
      const token = localStorage.getItem("token");
      try {
        const data = await checkPanel(token);
        setHasActivePanel(data.hasActivePanel);
      } catch (error) {
        console.error("Erro ao carregar painel:", error);
        alert(error.message);
      }
    }
    handleCheckPanel();
  }, []);

  async function handleCreatePanel() {
    const token = localStorage.getItem("token");

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      await createPanel(token, month, year);
      navigate("/financial");
    } catch (error) {
      console.error("Erro ao criar o Painel Financeiro:", error);
      setMsgError(error.message);
    }
  }

  if (hasActivePanel === null) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4 text-center">
        <p className="font-bold text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full flex flex-col gap-4">
      <h1 className="text-[24px] font-bold text-center">Painel Financeiro</h1>
      {hasActivePanel ? (
        <Button
          onClick={() => {
            navigate("/financial");
          }}
        >
          Ver Painel
        </Button>
      ) : (
        <Button onClick={handleCreatePanel}>Criar Novo</Button>
      )}
      {msgError && (
        <p className="bg-red-200 text-sm px-3 py-1 rounded-lg w-full border-2 border-red-400">
          {msgError}
        </p>
      )}
    </div>
  );
}

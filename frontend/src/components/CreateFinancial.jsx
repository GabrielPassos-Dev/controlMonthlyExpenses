import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { checkPanel, createPanel } from "../services/panelService";

export default function CreateFinancial() {
  const navigate = useNavigate();
  const [hasActivePanel, setHasActivePanel] = useState(null);
  const [msgError, setMsgError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchActivePanel() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await checkPanel(token);
        setHasActivePanel(data.hasActivePanel);
      } catch (error) {
        console.error("Erro ao carregar painel:", error);
        alert(error.message);
      }
    }
    fetchActivePanel();
  }, [navigate]);

  async function handleCreatePanel() {
    const token = localStorage.getItem("token");

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    try {
      setMsgError("");
      setIsLoading(true);

      await createPanel(token, month, year);

      navigate("/financial");
    } catch (error) {
      console.error("Erro ao criar o Painel Financeiro:", error);
      setMsgError(error.message || "Erro ao criar painel");
    } finally {
      setIsLoading(false);
    }
  }

  if (hasActivePanel === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4 text-center">
          <p className="font-bold text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full border border-slate-800/50 flex flex-col gap-6 items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight text-center">
          Painel <span className="text-indigo-500">Financeiro</span>
        </h1>
        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest text-center">
          {hasActivePanel
            ? "Gerencie seu mês atual"
            : "Inicie seu controle mensal"}
        </p>
      </div>

      <div className="w-full max-w-xs transition-all duration-300 transform hover:scale-[1.02]">
        {hasActivePanel ? (
          <Button
            variant="primary"
            className="py-4 shadow-indigo-600/30 text-lg w-full"
            onClick={() => navigate("/financial")}
          >
            Ver Painel Ativo
          </Button>
        ) : (
          <Button
            variant="primary"
            className="py-4 shadow-indigo-600/30 text-lg w-full"
            onClick={handleCreatePanel}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Criando...</span>
              </div>
            ) : (
              "Criar Novo Painel"
            )}
          </Button>
        )}
      </div>

      {msgError && (
        <div className="w-full animate-in slide-in-from-top-2 duration-300">
          <p className="bg-red-500/10 text-red-400 text-xs font-medium px-4 py-3 rounded-xl border border-red-500/20 text-center flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {msgError}
          </p>
        </div>
      )}
    </div>
  );
}

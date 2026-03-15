import { useEffect, useState } from "react";
import { finishedPanel } from "../services/panelService";
import HistoryList from "../components/HistoryList";
import { Button } from "../components/ui/Button";
import { IoIosArrowBack } from "react-icons/io";

export default function History() {
  const [panel, setPanel] = useState([]);
  const [hasFinishedPanel, setHasFinishedPanel] = useState(null);

  async function handleFinishedPanel() {
    const token = localStorage.getItem("token");
    try {
      const data = await finishedPanel(token);
      setPanel(data.panel);
      setHasFinishedPanel(data.hasFinishedPanel);
    } catch (error) {
      console.error("Erro ao carregar historico: ", error);
      alert(error.message);
    }
  }

  useEffect(() => {
    handleFinishedPanel();
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen w-full flex flex-col items-center px-4 py-12 overflow-x-hidden">
      <header className="w-full max-w-2xl mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Histórico <span className="text-indigo-500">Financeiro</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Visualize e gerencie seus painéis de meses anteriores.
        </p>
        <div className="h-1 w-20 bg-indigo-500 rounded-full mt-2" />
      </header>

      <div className="w-full max-w-2xl flex-1">
        <HistoryList panel={panel} />
      </div>

      <footer className="w-full max-w-2xl mt-12 pt-6 border-t border-slate-900 flex justify-center">
        <Button
          className="w-full max-w-xs flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white transition-all shadow-lg border border-slate-700"
          to="/Dashboard"
        >
          <IoIosArrowBack size={18} />
          Voltar ao Dashboard
        </Button>
      </footer>
    </div>
  );
}

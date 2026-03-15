import { Button } from "./ui/Button";
import { IoMdTime } from "react-icons/io";

export default function ViwHistoryFinancial() {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full border border-slate-800/40 flex flex-col gap-6 items-center group transition-all hover:border-indigo-500/20">
      <div className="bg-slate-800 p-4 rounded-2xl text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
        <IoMdTime size={32} />
      </div>

      <div className="flex flex-col items-center gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight text-center">
          Histórico Financeiro
        </h1>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] text-center">
          Relatórios de meses anteriores
        </p>
      </div>

      <div className="w-full max-w-xs">
        <Button
          to="/history"
          variant="secondary"
          className="py-4 border-slate-700 hover:bg-slate-800 hover:text-indigo-400 transition-all shadow-lg"
        >
          Acessar Registros
        </Button>
      </div>

      <div className="flex gap-1">
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <div className="w-1 h-1 rounded-full bg-slate-700" />
      </div>
    </div>
  );
}

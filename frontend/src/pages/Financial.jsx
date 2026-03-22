import FinancialControl from "../components/FinancialControl";
import FinancialList from "../components/FinancialList";
import { Button } from "../components/ui/Button";
import NotificationContainer from "../components/NotificationContainer";
import { useFinancialController } from "../hooks/useFinancialController";
import { useFinancial } from "../context/FinancialContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export default function Financial() {
  const { salarySnapshot, remainingAmount } = useFinancial();
  const { notifications, removeNotification } = useNotification();
  const { isLoading, predictedRemainingAmount, handleToggleStatus } =
    useFinancialController();

  return (
    <main className="bg-slate-950 min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-10 md:py-20 overflow-x-hidden">
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <section className="w-full max-w-2xl flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-slate-500 uppercase text-xs font-bold tracking-widest">
            Sua Renda Atual
          </span>

          <div className="flex flex-row items-baseline gap-2">
            <p className="text-white text-3xl md:text-6xl font-light">R$</p>
            <p className="text-emerald-400 text-4xl md:text-7xl font-bold tracking-tighter">
              {salarySnapshot.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="h-1.5 w-24 bg-emerald-500/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full animate-pulse" />
          </div>
        </div>

        <div className="w-full bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-2xl">
          <FinancialControl />
        </div>

        <div className="w-full">
          <FinancialList />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {remainingAmount && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
              <span className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                Saldo Disponível
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm font-mono">R$</span>
                <span
                  className={`text-2xl font-mono font-bold ${remainingAmount >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {remainingAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
          {predictedRemainingAmount && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
              <span className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                Saldo Previsto
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm font-mono">R$</span>
                <span
                  className={`text-2xl font-mono font-bold ${predictedRemainingAmount >= 0 ? "text-indigo-400" : "text-red-400"}`}
                >
                  {predictedRemainingAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 p-6 rounded-2xl flex flex-col items-center text-center gap-3 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

          <span className="text-indigo-400 uppercase text-[10px] font-bold tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full">
            Dica de Consumo Inteligente
          </span>

          <h2 className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-md">
            Você pode gastar até{" "}
            <span className="text-indigo-400 font-mono font-bold text-2xl block md:inline mt-2 md:mt-0">
              R${" "}
              {(predictedRemainingAmount / 30).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            por dia sem comprometer seu orçamento mensal.
          </h2>

          <p className="text-slate-500 text-xs italic">
            *Cálculo baseado em uma projeção para os próximos 30 dias e saldo
            total previsto de{" "}
            <span>
              {" "}
              R${" "}
              {predictedRemainingAmount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <Button
            to={"/dashboard"}
            className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 py-4"
          >
            Voltar
          </Button>

          <Button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finalizando...
              </span>
            ) : (
              "Finalizar Mês"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}

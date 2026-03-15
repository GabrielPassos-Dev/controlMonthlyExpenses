import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CiFolderOff } from "react-icons/ci";

export default function HistoryList({ panel }) {
  const [listExpense, setListExpense] = useState(null);

  const displayList = (id) => {
    setListExpense((prev) => (prev === id ? null : id));
  };

  if (!panel || panel.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-700 rounded-xl mt-10">
        <div className="bg-slate-800 p-4 rounded-full mb-4 text-slate-500">
          <CiFolderOff size={30} className="rotate-180" />
        </div>
        <p className="text-slate-400 font-medium text-center">
          Nenhum painel encontrado no seu histórico.
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Seus meses finalizados aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {panel.map((cPanel) => (
        <section key={cPanel.id} className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-2 ml-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h1 className="text-slate-200 font-bold text-lg tracking-tight">
              {`Painel de ${String(cPanel.month).padStart(2, "0")}/${cPanel.year}`}
            </h1>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-lg border-l-4 border-indigo-500 hover:bg-slate-750 transition-all">
            <div className="flex gap-4 sm:gap-8 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Renda
                </span>
                <span className="text-slate-200 font-mono text-sm md:text-base">
                  R$ {cPanel.salarySnapshot.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Saldo Restante
                </span>
                <span
                  className={`font-mono font-bold text-sm md:text-base ${cPanel.remainingAmount >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  R$ {cPanel.remainingAmount.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <button
              onClick={() => displayList(cPanel.id)}
              className="p-2 hover:bg-slate-700 rounded-full text-indigo-400 transition-transform active:scale-90"
            >
              {listExpense === cPanel.id ? (
                <IoMdClose size={24} />
              ) : (
                <IoIosArrowDown size={24} />
              )}
            </button>
          </div>

          {listExpense === cPanel.id && (
            <div className="flex flex-col gap-5 pl-4 border-l-2 border-slate-800 mt-2 animate-in slide-in-from-top-2 duration-300 ">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                  Fixos
                </h3>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5">
                  {cPanel.expenses
                    ?.filter((e) => e.type === "FIXED")
                    .map((cExpense) => (
                      <div
                        key={cExpense.id}
                        className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center border-l-4 border-emerald-500/50"
                      >
                        <span className="text-slate-200 text-sm font-medium truncate max-w-[150px] sm:max-w-none">
                          {cExpense.name}
                        </span>
                        <div className="flex gap-4 items-center shrink-0">
                          <span className="text-emerald-400 font-mono text-sm">
                            R$ {cExpense.amount.toFixed(2).replace(".", ",")}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${cExpense.paid ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"}`}
                          >
                            {cExpense.paid ? "PAGO" : "PENDENTE"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">
                  Variáveis
                </h3>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5">
                  {cPanel.expenses
                    ?.filter((e) => e.type !== "FIXED")
                    .map((cExpense) => (
                      <div
                        key={cExpense.id}
                        className="bg-slate-600/30 p-3 rounded-lg flex justify-between items-center border-l-4 border-amber-500/50"
                      >
                        <span className="text-slate-200 text-sm font-medium truncate max-w-[150px] sm:max-w-none">
                          {cExpense.name}
                        </span>
                        <div className="flex gap-4 items-center shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-slate-500 uppercase font-bold">
                              Gasto
                            </span>
                            <span className="text-amber-400 font-mono text-sm font-bold">
                              R${" "}
                              {(cExpense.spentAmount ?? 0)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                          <div className="flex flex-col items-end border-l border-slate-700 pl-4">
                            <span className="text-[9px] text-slate-500 uppercase font-bold">
                              Total
                            </span>
                            <span className="text-slate-400 font-mono text-xs">
                              R$ {cExpense.amount.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}

import { useEffect, useState } from "react";
import { finishedPanel } from "../services/panelService";

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
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 justify-center items-center px-4 overflow-x-hidden">
      <div className="flex flex-col gap-4  max-w-2xl">
        {panel.length === 0 && (
          <p className="text-white">Nenhum panel no historico.</p>
        )}
        {panel.map((cPanel) => (
          <section key={cPanel.id} className="flex flex-col gap-0">
            <div className="bg-slate-700 p-2 rounded-md flex gap-12 justify-between items-center">
              <span className="text-white">
                {`Painel ${cPanel.month}/${cPanel.year}`}
              </span>
              <span className="text-gray-300 flex flex-row">
                {`Salário: R$ ${cPanel.salarySnapshot.toFixed(2).replace(".", ",")}`}
              </span>
              <span className="text-gray-300 flex flex-row">
                {`Restante: R$ ${cPanel.remainingAmount.toFixed(2).replace(".", ",")} `}
              </span>
            </div>
            <div>
              {cPanel.expenses.map((cExpense) => (
                <section key={cExpense.id}>
                  <div className="bg-slate-600 p-2 rounded-md flex gap-12 justify-between items-center">
                    <span>{cExpense.name}</span>
                    <span className="text-green-400">
                      R$ {cExpense.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

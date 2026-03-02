import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function CreateFinancial() {
  const navigate = useNavigate();
  const [hasActivePanel, setHasActivePanel] = useState(null);

  useEffect(() => {
    async function checkPanel() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:3000/dashboard/panel/active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 404) {
          setHasActivePanel(false);
        } else if (response.ok) {
          setHasActivePanel(true);
        }
      } catch (error) {
        console.error("Erro ao carregar painel:", error);
        alert("Erro ao conectar com o servidor");
      }
    }
    checkPanel();
  }, []);

  async function createPanel() {
    const token = localStorage.getItem("token");

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      const response = await fetch("http://localhost:3000/dashboard/panel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          month,
          year,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/financial");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro ao criar o Painel Financeiro:", error);
      alert("Erro ao conectar com o servidor");
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
    <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
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
        <Button onClick={createPanel}>Criar Novo</Button>
      )}
    </div>
  );
}

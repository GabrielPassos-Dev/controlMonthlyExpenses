import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function CreateFinancial() {
  const navigate = useNavigate();

  async function goToPanel() {
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

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h1 className="text-[24px] font-bold text-center"> Criar novo Painel</h1>
      <Button onClick={goToPanel}>Criar</Button>
    </div>
  );
}

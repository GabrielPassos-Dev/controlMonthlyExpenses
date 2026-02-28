import { useNavigate } from "react-router-dom";
import CreateFinancial from "../components/CreateFinancial";
import ViwHistoryFinancial from "../components/ViwHistoryFinancial";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="bg-gray-400 min-h-screen w-full flex flex-col gap-4 justify-center items-center px-4 overflow-x-hidden">
      <CreateFinancial />
      <ViwHistoryFinancial />
      <Button onClick={logout}>Sair da conta</Button>
    </div>
  );
}

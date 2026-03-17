import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { registerUser } from "../services/authService";

export default function FormRegister({ onSwitchForm }) {
  const navigate = useNavigate();
  const [salary, setSalary] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    try {
      const data = await registerUser(name, email, password, salary);

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no registro:", error);
      alert(error.message);
    }
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800/50 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Criar <span className="text-indigo-500">Conta</span>
        </h1>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
          Comece seu controle financeiro hoje
        </p>
      </header>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 group">
          <label
            htmlFor="name"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-indigo-400 transition-colors"
          >
            Nome Completo
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Como quer ser chamado?"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 group">
          <label
            htmlFor="email"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-indigo-400 transition-colors"
          >
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 group">
          <label
            htmlFor="password"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-indigo-400 transition-colors"
          >
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {/* Campo Salário - Destaque em Esmeralda */}
        <div className="flex flex-col gap-1 group">
          <label
            htmlFor="salary"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-emerald-400 transition-colors"
          >
            Salário Base (R$)
          </label>
          <NumericFormat
            id="salary"
            className="w-full px-5 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-emerald-400 font-mono font-bold placeholder-slate-600 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-inner"
            value={salary || ""}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            placeholder="R$ 0,00"
            onValueChange={(values) => setSalary(values.floatValue ?? 0)}
          />
        </div>

        <Button
          variant="primary"
          className="mt-4 py-4 font-bold shadow-indigo-600/20"
        >
          Finalizar Cadastro
        </Button>

        {/* Link para Voltar ao Login */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <p className="text-slate-400 text-sm">Já possui cadastro?</p>
          <button
            onClick={onSwitchForm}
            type="button"
            className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4"
          >
            Entrar na minha conta
          </button>
        </div>
      </form>
    </div>
  );
}

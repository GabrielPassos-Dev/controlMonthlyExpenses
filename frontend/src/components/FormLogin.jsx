import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { loginUser } from "../services/authService.js";

export default function FormLogin({ onSwitchForm }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800/50 flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Bem-vindo <span className="text-indigo-500">de volta</span>
        </h1>
        <p className="text-slate-500 text-xs uppercase font-bold tracking-[0.2em]">
          Acesse sua conta financeira
        </p>
      </header>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 group">
          <label
            htmlFor="email"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-indigo-400 transition-colors"
          >
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 group">
          <label
            htmlFor="password"
            className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-widest group-focus-within:text-indigo-400 transition-colors"
          >
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl animate-shake">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-200 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          disabled={isLoading}
          className="mt-4 py-4 text-lg shadow-indigo-600/20 active:scale-95 font-bold"
        >
          {isLoading ? "Autenticando..." : "Entrar na Conta"}
        </Button>

        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-slate-400 text-sm">Não possui cadastro?</p>
          <button
            onClick={onSwitchForm}
            type="button"
            className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-500/30"
          >
            Criar uma nova conta
          </button>
        </div>
      </form>
    </div>
  );
}

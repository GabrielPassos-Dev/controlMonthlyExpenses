import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Text from "./ui/text";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";

export default function FormLogin({ onSwitchForm }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-center">Login</h1>
      </header>

      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <label htmlFor="email">
          <Text>E-mail</Text>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password">
          <Text>Senha</Text>
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button className="mt-6 mb-2">Entrar</Button>
        <div className="flex flex-row gap-1 justify-center items-center">
          <p>Não possui cadastro?</p>
          <button
            onClick={onSwitchForm}
            type="button"
            className="text-1xl font-bold cursor-pointer underline underline-offset-2"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}

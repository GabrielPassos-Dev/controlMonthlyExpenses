import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Text from "./ui/text";

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
    <form
      onSubmit={handleLogin}
      className="bg-white p-8 rounded-xl shadow-md w-full flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <label htmlFor="email">
        <Text>E-mail</Text>
      </label>
      <input
        id="email"
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="password">
        <Text>Senha</Text>
      </label>
      <input
        id="password"
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
        Entrar
      </button>
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
  );
}

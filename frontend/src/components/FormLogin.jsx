import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormLogin({ onSwitchForm }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function sendForm(event) {
    event.preventDefault();

    console.log(email, password);

    navigate("/dashboard");
  }

  return (
    <form
      onSubmit={sendForm}
      className="bg-white p-8 rounded-xl shadow-md w-full flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
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

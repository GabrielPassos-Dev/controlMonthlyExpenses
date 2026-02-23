import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormLogin({changeForm}) {
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
      className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4"
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
      <div>
        <button onClick={changeForm} type="button" className="text-1xl">Crie sua conta</button>
      </div>
    </form>
  );
}

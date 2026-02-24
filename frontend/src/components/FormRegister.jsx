import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

export default function FormRegister({ changeForm }) {
  const navigate = useNavigate();
  
  const [salary, setSalary] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function sendForm(event) {
    event.preventDefault();

    console.log(name, email, password, salary);

    navigate("/dashboard");
  }

  return (
    <form
      onSubmit={sendForm}
      className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center">Criar conta</h1>

      <input
        type="text"
        placeholder="Digite seu nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

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

      <NumericFormat
        className="h-8 p-2 bg-white text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={salary || ""}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        placeholder="Digite seu salario R$ 0,00"
        onValueChange={(values) => setSalary(values.floatValue ?? 0)}
      />

      <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
        criar conta
      </button>
      <div>
        <button onClick={changeForm} type="button">
          Acesse sua conta
        </button>
      </div>
    </form>
  );
}

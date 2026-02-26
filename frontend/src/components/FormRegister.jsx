import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import Text from "./ui/text";

export default function FormRegister({ onSwitchForm }) {
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
      className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-2"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Cadastro</h1>

      <Text>Nome completo</Text>

      <input
        type="text"
        placeholder="Digite seu nome completo"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Text>E-mail</Text>
      <input
        type="email"
        placeholder="Ex: seuemail@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Text>Senha</Text>
      <input
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Text>Salario</Text>
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
      <div className="flex flex-row gap-1 justify-center items-center">
        <p>Já possui cadastro?</p>
        <button
          onClick={onSwitchForm}
          type="button"
          className="text-1xl font-bold cursor-pointer underline underline-offset-2"
        >
          Entrar
        </button>
      </div>
    </form>
  );
}

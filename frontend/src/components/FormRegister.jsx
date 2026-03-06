import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import Text from "./ui/text";
import { Button } from "./ui/button";
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
    <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full flex flex-col gap-">
      <header>
        <h1 className="text-3xl font-bold text-center">Cadastro</h1>
      </header>

      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <label htmlFor="name">
          <Text>Nome completo</Text>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="email">
          <Text>E-mail</Text>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Ex: seuemail@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">
          <Text>Senha</Text>
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="salary">
          <Text>Salario</Text>
        </label>
        <NumericFormat
          id="salary"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300"
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

        <Button className="mt-6 mb-2">criar conta</Button>

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
    </div>
  );
}

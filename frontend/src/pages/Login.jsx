import { useState } from "react";
import FormLogin from "../components/FormLogin";
import FormRegister from "../components/FormRegister";

export default function Login() {
  const [isLoginView, setisLoginView] = useState(true);

  const toggleForm = () => setisLoginView((prev) => !prev);

  return (
    <main className="bg-gray-400 min-h-screen w-full flex items-center justify-center p-4">
      <section className="w-full max-w-2xl">
        {isLoginView ? (
          <FormLogin onSwitchForm={toggleForm} />
        ) : (
          <FormRegister onSwitchForm={toggleForm} />
        )}
      </section>
    </main>
  );
}

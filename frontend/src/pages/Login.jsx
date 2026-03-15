import { useState } from "react";
import FormLogin from "../components/FormLogin";
import FormRegister from "../components/FormRegister";

export default function Login() {
  const [isLoginView, setisLoginView] = useState(true);

  const toggleForm = () => setisLoginView((prev) => !prev);

  return (
    <main className="bg-slate-950 min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <section className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        {isLoginView ? (
          <FormLogin onSwitchForm={toggleForm} />
        ) : (
          <FormRegister onSwitchForm={toggleForm} />
        )}

        <footer className="mt-8 text-center">
          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.3em]">
            Controle Financeiro • v1.0
          </p>
        </footer>
      </section>
    </main>
  );
}

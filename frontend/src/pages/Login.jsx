import { useState } from "react";
import FormLogin from "../components/FormLogin";
import FormRegister from "../components/FormRegister";

export default function Login() {
  const [isActive, setIsActive] = useState(true);

  function changeForm() {
    setIsActive(!isActive);
  }

  return (
    <div className="bg-gray-400 min-h-screen w-full flex items-center justify-center">
      {isActive ? (
        <FormLogin changeForm={changeForm} />
      ) : (
        <FormRegister changeForm={changeForm} />
      )}
    </div>
  );
}

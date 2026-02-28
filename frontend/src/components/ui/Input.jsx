export function Input({
  children,
  onChange,
  className = "",
  id,
  type,
  placeholder,
  value,
}) {
  const classBase =
    " w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-300";

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${classBase} ${className}`}
    >
      {children}
    </input>
  );
}

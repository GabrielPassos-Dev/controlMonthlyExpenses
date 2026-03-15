export function Input({
  onChange,
  className = "",
  id,
  type,
  placeholder,
  value,
  ...props
}) {
  const classBase =
    "w-full px-5 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 shadow-inner hover:border-slate-600 focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${classBase} ${className}`}
      {...props}
    />
  );
}

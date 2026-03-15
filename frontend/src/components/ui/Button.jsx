import { Link } from "react-router-dom";

export function Button({
  children,
  onClick,
  disabled,
  to,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const baseStyles =
    "text-center flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    primary:
      "bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 hover:shadow-indigo-500/20 border border-indigo-400/20",

    secondary:
      "bg-slate-800 text-slate-200 rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white shadow-md",

    smallBlue:
      "bg-indigo-600/90 text-white rounded-lg text-sm hover:bg-indigo-500 shadow-md",

    danger:
      "bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white shadow-sm",

    ghost:
      "bg-transparent text-indigo-400 border-2 border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = className.includes("w-") ? "" : "w-full";
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

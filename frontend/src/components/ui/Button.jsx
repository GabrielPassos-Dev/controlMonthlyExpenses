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
  const variants = {
    primary:
      "text-center relative w-full py-3 px-6 rounded-2xl font-semibold text-white text-base tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95",

    smallBlue:
      "text-center p-3 rounded-2xl font-semibold text-white text-base tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95",

    smallDanger:
      "text-center p-3 rounded-2xl font-semibold text-white text-base tracking-wide bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/20 transition-all duration-300 ease-in-out hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30 active:scale-95",

    danger:
      "bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition text-center",

    ghost:
      "relative w-full py-3 px-6 rounded-2xl font-semibold text-base tracking-wide bg-gradient-to-r shadow-lg shadow-blue-500/20 transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-800 hover:text-white text-center",
  };

  const sizes = {
    sm: "text-sm",
    md: "text-md",
    lg: "px-8 py-3 text-lg",
  };

  const classes = `${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} disabled={disabled} className={`${classes}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${classes}`}
      {...props}
    >
      {children}
    </button>
  );
}

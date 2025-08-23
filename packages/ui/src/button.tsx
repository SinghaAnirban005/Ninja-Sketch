import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "lg";
  className?: string;
  onClick?: (arg?: any) => void;
  children: React.ReactNode;
  disabled?: boolean;
};

//@ts-ignore
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "lg",
  className = "",
  onClick,
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 focus-visible:ring-white",
    secondary:
      "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600 focus-visible:ring-gray-500",
    outline:
      "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white focus-visible:ring-gray-500",
    ghost: "text-gray-400 hover:text-white hover:bg-gray-800",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      //@ts-ignore
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

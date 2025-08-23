import { type JSX } from "react";

//@ts-ignore
export const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

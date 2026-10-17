import { useState, type ReactNode } from "react";

export interface ButtonProps {
  children?: ReactNode;
  initialCount?: number;
  onClick?: () => void;
}

export const Button = ({ children, initialCount = 0, onClick }: ButtonProps) => {
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    setCount((prev) => prev + 1);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        backgroundColor: "#646cff",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "background-color 0.2s ease",
      }}
    >
      {children ? children : "Cliques"}: {count}
    </button>
  );
};

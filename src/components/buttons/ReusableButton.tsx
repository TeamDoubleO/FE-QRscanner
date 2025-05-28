import React from "react";
import "./css/ReusableButton.css";

interface ReusableButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  onClick,
  className = "",
  style,
  type = "button",
  children,
}) => {
  return (
    <button
      type={type}
      className={`reusable-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default ReusableButton;

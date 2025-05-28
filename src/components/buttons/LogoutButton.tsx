import React from "react";
import "./css/LogoutButton.css";

interface LogoutButtonProps {
  onClick?: () => void;
  children: React.ReactNode; 
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, children }) => {
  return (
    <button className="logout-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default LogoutButton;

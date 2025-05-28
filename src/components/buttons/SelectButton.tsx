import React from "react";
import "./css/SelectButton.css";

interface SelectButtonProps {
  onClick?: () => void;
  children: React.ReactNode; 
}

const SelectButton: React.FC<SelectButtonProps> = ({ onClick, children }) => {
  return (
    <button className="select-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default SelectButton;

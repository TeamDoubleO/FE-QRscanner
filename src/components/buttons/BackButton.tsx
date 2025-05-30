import React from "react";
import "./css/BackButton.css";

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button className="back-button" onClick={onClick}>
        이전
    </button>
  );
};

export default BackButton;

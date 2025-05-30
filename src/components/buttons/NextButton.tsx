import React from "react";
import "./css/NextButton.css";

interface NextButtonProps {
  onClick?: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick }) => {
  return (
    <button className="next-button" onClick={onClick}>
        다음
    </button>
  );
};

export default NextButton;

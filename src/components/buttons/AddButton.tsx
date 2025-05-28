import React from "react";
import { MdAdd } from "react-icons/md";
import "./css/AddButton.css";

const AddButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert("추가되었습니다.");
    }
  };

  return (
    <button className="add-button" onClick={handleClick}>
      <MdAdd className="add-button-icon" />
    </button>
  );
};

export default AddButton;

import React from "react";
import { MdDelete } from "react-icons/md";
import "./css/DeleteButton.css";

const DeleteButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert("삭제되었습니다.");
    }
  };

  return (
    <button className="delete-button" onClick={handleClick}>
      <MdDelete className="delete-button-icon" />
    </button>
  );
};

export default DeleteButton;

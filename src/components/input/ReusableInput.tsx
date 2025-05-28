import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import "./css/ReusableInput.css";

interface ReusableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showToggle?: boolean;
  iconClassName?: string;
}

const ReusableInput: React.FC<ReusableInputProps> = ({
  label,
  className = "",
  type,
  showToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password" && showToggle;
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="reusable-input-wrapper">
      {label && <label className="reusable-input-label">{label}</label>}
      <div className="reusable-input-inner">
        <input
          type={inputType}
          className={`reusable-input-field ${className}`}
          {...props}
        />
        {isPassword && (
          <span
            className="reusable-input-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoEyeOff /> : <IoEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReusableInput;

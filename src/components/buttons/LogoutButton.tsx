import React from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../apis/loginApi";

import "./css/LogoutButton.css";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;

    try {
      await adminLogout();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (err: any) {
      localStorage.clear();
      sessionStorage.clear();
      const message = err?.message ?? "로그아웃 실패";
      alert(message);
      console.warn("관리자 로그아웃 실패:", err);
      navigate("/login");
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutButton;

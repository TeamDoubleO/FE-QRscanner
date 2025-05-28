import './css/ZoneLoginCard.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { adminLogin } from '../../apis/loginApi';

interface Props {
  onSwitch: () => void;
  isExiting: boolean;
  direction: 'up' | 'down';
  onLogin: () => void;
}

const ZoneLoginCard: React.FC<Props> = ({ onSwitch: _, isExiting, direction, onLogin }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await adminLogin({
        username: adminId,
        password: password,
      });
    const token = response.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        onLogin();
        navigate("/zone/select");
      } else {
        setError("로그인 실패: 엑세스 토큰이 없음");
      }
    } catch (error: any) {
      setError(error.message); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div
      className={`zone-login-card ${
        isExiting ? (direction === 'up' ? 'zone-slide-left' : 'zone-slide-right') : ''
      }`}
    >
      <div
        className={`zone-card-content ${
          isExiting ? 'zone-fade-out-up' : 'zone-fade-in-down'
        }`}
      >
        <h2>구역용 로그인</h2>
        <p className="description">구역 관리자 계정으로 로그인하세요.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="관리자 ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default ZoneLoginCard;

import './css/ZoneLoginCard.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { adminLogin } from '../../apis/loginApi';
import ReusableInput from '../input/ReusableInput';
import ReusableButton from '../buttons/ReusableButton';

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
        sessionStorage.clear();
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
          isExiting 
          ? 'zone-login-card-fade-out-up' 
          : 'zone-login-card-fade-in-down'
        }`}
      >
        <h2>구역용 로그인</h2>
        <p className="description">구역 관리자 계정으로 로그인하세요.</p>
        <form onSubmit={handleSubmit}>
          <ReusableInput
            type="text"
            placeholder="관리자 ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="zone-login-input"
          />
          <ReusableInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showToggle
            className="zone-login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <ReusableButton type="submit" className="zone-login-button">
            로그인
          </ReusableButton>
        </form>
      </div>
    </div>
  );
};

export default ZoneLoginCard;

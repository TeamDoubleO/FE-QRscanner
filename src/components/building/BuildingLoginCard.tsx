import './css/BuildingLoginCard.css';
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

const BuildingLoginCard: React.FC<Props> = ({ onSwitch: _, isExiting, direction, onLogin }) => {
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
        navigate("/building/select");
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
      className={`building-login-card ${
        isExiting ? (direction === 'up' ? 'building-slide-left' : 'building-slide-right') : ''
      }`}
    >
      <div
        className={`building-card-content ${
          isExiting 
          ? 'building-login-card-fade-out-up'
          : 'building-login-card-fade-in-down'
        }`}
      >
        <h2>건물용 로그인</h2>
        <p className="description">건물 관리자 계정으로 로그인하세요.</p>
        <form onSubmit={handleSubmit}>
          <ReusableInput
            type="text"
            placeholder="관리자 ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="building-login-input"
          />
          <ReusableInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showToggle
            className="building-login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <ReusableButton type="submit" className="building-login-button">
            로그인
          </ReusableButton>
        </form>
      </div>
    </div>
  );
};

export default BuildingLoginCard;

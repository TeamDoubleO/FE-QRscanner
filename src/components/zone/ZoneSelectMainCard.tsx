import { useNavigate } from 'react-router-dom'; 

import './css/ZoneSelectMainCard.css';

import LogoutButton from '../buttons/LogoutButton';
import { adminLogout } from '../../apis/loginApi';

const ZoneSelectMainCard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;

    try {
      await adminLogout();
      localStorage.clear();
      navigate("/login");
    } catch (err: any) {
      localStorage.clear();
      const message = err?.message ?? "로그아웃 실패";
      alert(message); 
      console.warn("관리자 로그아웃 실패:", err);
      navigate("/login");
    }
  };

  return (
    <div className="zone-select-main-card">
      <h2>구역 선택</h2>
      <p>내용 배치</p>

      <div className="building-select-main-card-logout-button-wrapper">
      <LogoutButton
        onClick={handleLogout}
      > 로그아웃
    </LogoutButton>
    </div>
    </div>
  );
};

export default ZoneSelectMainCard;

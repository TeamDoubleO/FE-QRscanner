import { useNavigate } from 'react-router-dom';

import './css/ZoneSelectMainBuildingCard.css';

import LogoutButton from '../buttons/LogoutButton';
import { adminLogout } from '../../apis/loginApi';

interface Props {
  onNext: () => void;
}

const ZoneSelectMainBuildingCard: React.FC<Props> = ({ onNext }) => {
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
    <div className="zone-select-main-building-card">
      <h2>건물 선택</h2>
      <div className="zone-select-main-building-card-logout-button-wrapper">
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </div>
      <div className="zone-select-main-building-card-next-button-wrapper">
        <button onClick={onNext}>다음</button>
      </div>
    </div>
  );
};

export default ZoneSelectMainBuildingCard;

import { useNavigate } from 'react-router-dom';

import './css/ZoneSelectMainBuildingCard.css';

import LogoutButton from '../buttons/LogoutButton';

interface Props {
  onNext: () => void;
}

const ZoneSelectMainBuildingCard: React.FC<Props> = ({ onNext }) => {
  const navigate = useNavigate();

  return (
    <div className="zone-select-main-building-card">
      <h2>건물 선택</h2>
      <div className="zone-select-main-building-card-logout-button-wrapper">
        <LogoutButton />
      </div>
      <div className="zone-select-main-building-card-next-button-wrapper">
        <button onClick={onNext}>다음</button>
      </div>
    </div>
  );
};

export default ZoneSelectMainBuildingCard;

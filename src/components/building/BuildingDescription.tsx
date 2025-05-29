import './css/BuildingDescription.css';
import buildingboxBackground from '../../assets/images/building-description-background.png';
import ReusableButton from '../buttons/ReusableButton';

interface Props {
  onSwitch: () => void;
}

const BuildingDescription: React.FC<Props> = ({ onSwitch }) => {
  return (
    <div
      className="building-description"
      style={{ backgroundImage: `url(${buildingboxBackground})` }}
    >
      <div className="building-description-text-group">
        <h1>건물용</h1>
        <p>
          건물 출입구를 스캔하여 <br />
          출입 권한을 효율적으로 관리합니다.
        </p>
        <p className="warning">※ 서비스를 이용하려면 로그인 후 시작해 주세요.</p>
      </div>

      <ReusableButton onClick={onSwitch} className="building-description-button">
        구역 모드로 이동
      </ReusableButton>
    </div>
  );
};

export default BuildingDescription;

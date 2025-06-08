import './css/BuildingDescription.css';
import buildingboxBackground from '../../assets/images/building-description-background.png';
import zoneboxBackground from '../../assets/images/zone-description-background.png';
import ReusableButton from '../buttons/ReusableButton';

interface Props {
  onSwitch: () => void;
}

const BuildingDescription: React.FC<Props> = ({ onSwitch }) => {
  return (
    <div className="building-description">
      <div
        className="building-description-preview"
        style={{ backgroundImage: `url(${zoneboxBackground})` }}
      >
        <h2>구역용</h2>
        <p>
          건물 내 개별 구역의 출입문을 스캔하여 <br />
          해당 구역의 출입 권한을 관리합니다.
        </p>
        <p className="warning">※ 서비스를 이용하려면 로그인 후 시작해 주세요.</p>
        <ReusableButton onClick={onSwitch}>
          건물 모드로 이동
        </ReusableButton>
      </div>

      <div
        className="building-description-text-group"
        style={{ backgroundImage: `url(${buildingboxBackground})` }}
      >
        <h1>건물용</h1>
        <p>
          건물 출입구를 스캔하여 <br />
          출입 권한을 효율적으로 관리합니다.
        </p>
        <p className="warning">※ 서비스를 이용하려면 로그인 후 시작해 주세요.</p>
        <ReusableButton onClick={onSwitch}>
          구역 모드로 이동
        </ReusableButton>
      </div>
    </div>
  );
};

export default BuildingDescription;
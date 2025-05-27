import './css/ZoneDescription.css';
import zoneboxBackground from '../../assets/images/zone-description-background.png';

interface Props {
  onSwitch: () => void;
}

const ZoneDescription: React.FC<Props> = ({ onSwitch }) => {
  return (
    <div
      className="zone-description"
      style={{ backgroundImage: `url(${zoneboxBackground})` }}
    >
      <div className="zone-text-group">
        <h1>구역용</h1>
        <p>
          건물 내 개별 구역의 출입문을 스캔하여 <br />
          해당 구역의 출입 권한을 관리합니다.
        </p>
        <p className="warning">※ 서비스를 이용하려면 로그인 후 시작해 주세요.</p>
      </div>

      <button onClick={onSwitch}>건물 모드로 이동</button>
    </div>
  );
};

export default ZoneDescription;

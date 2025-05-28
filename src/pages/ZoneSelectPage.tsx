import './css/ZoneSelectPage.css';
import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectMainCard from '../components/zone/ZoneSelectMainCard';
import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        <ZoneSelectMainCard />
      </div>
    </div>
  );
};

export default ZoneSelectPage;

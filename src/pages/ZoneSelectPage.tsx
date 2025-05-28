import './css/ZoneSelectPage.css';
import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectWhiteCard from '../components/zone/ZoneSelectWhiteCard';
import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        <ZoneSelectWhiteCard />
      </div>
    </div>
  );
};

export default ZoneSelectPage;

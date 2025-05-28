import './css/BuildingSelectPage.css';
import BuildingSelectGreenCard from '../components/building/BuildingSelectGreenCard';
import BuildingSelectWhiteCard from '../components/building/BuildingSelectWhiteCard';
import buildingWrapperBackground from '../assets/images/building-background.png';

const BuildingSelectPage: React.FC = () => {
  return (
    <div
      className="building-select-page-wrapper"
      style={{ backgroundImage: `url(${buildingWrapperBackground})` }}
    >
      <div className="building-select-page-card-wrapper">
        <BuildingSelectGreenCard />
        <BuildingSelectWhiteCard />
      </div>
    </div>
  );
};

export default BuildingSelectPage;

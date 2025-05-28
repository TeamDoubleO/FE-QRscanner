import './css/BuildingSelectPage.css';
import { useEffect, useState } from 'react';
import BuildingSelectGreenCard from '../components/building/BuildingSelectGreenCard';
import BuildingSelectWhiteCard from '../components/building/BuildingSelectWhiteCard';
import BuildingSelectMainCard from '../components/building/BuildingSelectMainCard';
import buildingWrapperBackground from '../assets/images/building-background.png';

const BuildingSelectPage: React.FC = () => {
  const [showMainCard, setShowMainCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainCard(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="building-select-page-wrapper"
      style={{ backgroundImage: `url(${buildingWrapperBackground})` }}
    >
      <div className="building-select-page-card-wrapper">
        <BuildingSelectGreenCard />
        {showMainCard ? <BuildingSelectMainCard /> : <BuildingSelectWhiteCard />}
      </div>
    </div>
  );
};

export default BuildingSelectPage;

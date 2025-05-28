import './css/ZoneSelectPage.css';
import { useEffect, useState } from 'react';
import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectWhiteCard from '../components/zone/ZoneSelectWhiteCard';
import ZoneSelectMainCard from '../components/zone/ZoneSelectMainCard';
import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  const [showMainCard, setShowMainCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainCard(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        {showMainCard ? <ZoneSelectMainCard /> : <ZoneSelectWhiteCard />}
      </div>
    </div>
  );
};

export default ZoneSelectPage;

import './css/ZoneSelectPage.css';
import { useEffect, useState } from 'react';

import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectWhiteCard from '../components/zone/ZoneSelectWhiteCard';
import ZoneSelectMainBuildingCard from '../components/zone/ZoneSelectMainBuildingCard';
import ZoneSelectMainZoneCard from '../components/zone/ZoneSelectMainZoneCard';

import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'white' | 'building' | 'zone'>('white');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep('building');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep === 'building') {
      setCurrentStep('zone');
    }
  };

  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        {currentStep === 'white' && <ZoneSelectWhiteCard />}
        {currentStep === 'building' && <ZoneSelectMainBuildingCard onNext={handleNext} />}
        {currentStep === 'zone' && <ZoneSelectMainZoneCard />}
      </div>
    </div>
  );
};

export default ZoneSelectPage;

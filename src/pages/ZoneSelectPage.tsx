import './css/ZoneSelectPage.css';
import { useEffect, useState } from 'react';

import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectWhiteCard from '../components/zone/ZoneSelectWhiteCard';
import ZoneSelectMainBuildingCard from '../components/zone/ZoneSelectMainBuildingCard';
import ZoneSelectMainZoneCard from '../components/zone/ZoneSelectMainZoneCard';

import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  const [buildingId, setBuildingId] = useState<string | null>(sessionStorage.getItem("buildingId"));
  const [buildingName, setBuildingName] = useState<string | null>(sessionStorage.getItem("buildingName"));
  const [currentStep, setCurrentStep] = useState<'white' | 'building' | 'zone'>('white');

  useEffect(() => {
    const savedStep = sessionStorage.getItem("zoneSelectStep") as 'white' | 'building' | 'zone' | null;
    if (savedStep) {
      setCurrentStep(savedStep);
    } else {
      const timer = setTimeout(() => {
        setCurrentStep('building');
        sessionStorage.setItem("zoneSelectStep", 'building');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = (selectedBuildingId: string, selectedBuildingName: string) => {
    setBuildingId(selectedBuildingId);
    setBuildingName(selectedBuildingName);
    localStorage.setItem("buildingName", selectedBuildingName);

    sessionStorage.setItem("buildingId", selectedBuildingId); 
    sessionStorage.setItem("buildingName", selectedBuildingName);
    sessionStorage.setItem("zoneSelectStep", 'zone');
    setCurrentStep('zone');
  };

  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        {currentStep === 'white' && <ZoneSelectWhiteCard />}
        {currentStep === 'building' && (
          <ZoneSelectMainBuildingCard onNext={handleNext} />
        )}
        {currentStep === 'zone' && buildingId && buildingName && (
          <ZoneSelectMainZoneCard 
            buildingId={buildingId} 
            buildingName={buildingName} 
            onBack={() => {
              sessionStorage.setItem("zoneSelectStep", 'building');
              setCurrentStep('building');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ZoneSelectPage;

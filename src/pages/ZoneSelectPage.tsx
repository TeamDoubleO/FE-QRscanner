import './css/ZoneSelectPage.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ZoneSelectGreenCard from '../components/zone/ZoneSelectGreenCard';
import ZoneSelectWhiteCard from '../components/zone/ZoneSelectWhiteCard';
import ZoneSelectMainBuildingCard from '../components/zone/ZoneSelectMainBuildingCard';
import ZoneSelectMainZoneCard from '../components/zone/ZoneSelectMainZoneCard';

import zonewrapperBackground from '../assets/images/zone-background.png';

const ZoneSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [buildingId, setBuildingId] = useState<string | null>(sessionStorage.getItem("buildingId"));
  const [buildingName, setBuildingName] = useState<string | null>(sessionStorage.getItem("buildingName"));
  const [currentStep, setCurrentStep] = useState<'white' | 'building' | 'zone'>('white');
  const [isInternalChange, setIsInternalChange] = useState(false);

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

    setIsInternalChange(true);
    setCurrentStep('zone');
  };

  const handleBack = () => {
    sessionStorage.setItem("zoneSelectStep", 'building');
    setIsInternalChange(true);
    setCurrentStep('building');
  };

  useEffect(() => {
    const handlePopState = () => {
      const savedStep = sessionStorage.getItem("zoneSelectStep") as 'white' | 'building' | 'zone' | null;
      if (savedStep) {
        setCurrentStep(savedStep);
      } else {
        setCurrentStep('building');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isInternalChange) return;

    if (currentStep === 'building' && location.pathname !== '/zone/select/building') {
      navigate('/zone/select/building', { replace: false });
    } else if (currentStep === 'zone' && location.pathname !== '/zone/select/zone') {
      navigate('/zone/select/zone', { replace: false });
    }

    setIsInternalChange(false); // reset flag
  }, [currentStep, navigate, location.pathname, isInternalChange]);

  useEffect(() => {
    if (location.pathname === '/zone/select') {
      navigate('/zone/select/building', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname === '/zone/select/building') {
      sessionStorage.setItem('zoneSelectStep', 'building');
    } else if (location.pathname === '/zone/select/zone') {
      sessionStorage.setItem('zoneSelectStep', 'zone');
    }
  }, [location.pathname]);

  return (
    <div
      className="zone-select-page-wrapper"
      style={{ backgroundImage: `url(${zonewrapperBackground})` }}
    >
      <div className="zone-select-page-card-wrapper">
        <ZoneSelectGreenCard />
        {currentStep === 'white' && <ZoneSelectWhiteCard />}
        {currentStep === 'building' && <ZoneSelectMainBuildingCard onNext={handleNext} />}
        {currentStep === 'zone' && buildingId && buildingName && (
          <ZoneSelectMainZoneCard 
            buildingId={buildingId} 
            buildingName={buildingName} 
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default ZoneSelectPage;

import './css/BuildingLoginPage.css';
import BuildingDescription from '../components/building/BuildingDescription';
import BuildingLoginCard from '../components/building/BuildingLoginCard';
import { useEffect, useState } from 'react';

import buildingwrapperBackground from '../assets/images/building-background.png';
import zonewrapperBackground from '../assets/images/zone-background.png';

interface Props {
  onSwitch: () => void;
  isExiting: boolean;
  direction: 'up' | 'down';
}

const BuildingLoginPage: React.FC<Props> = ({ onSwitch, isExiting, direction }) => {
  const [step, setStep] = useState<'idle' | 'slide'>('idle');

  useEffect(() => {
    if (isExiting) {
      setStep('slide');

      const timer = setTimeout(() => {
        onSwitch();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isExiting, onSwitch]);

  return (
    <div className="building-login-page-description-wrapper">
      <div
        className={`building-login-page-bg-overlay ${step === 'slide' ? 'fade-in' : ''}`}
        style={{ backgroundImage: `url(${zonewrapperBackground})` }}
      />

      <div
        className={`building-login-page-bg-base ${step === 'slide' ? 'fade-out' : ''}`}
        style={{ backgroundImage: `url(${buildingwrapperBackground})` }}
      />

      <BuildingDescription onSwitch={onSwitch} />
      <div className={`building-login-page-card-wrapper ${step === 'slide' ? 'building-slide-right' : ''}`}>
        <BuildingLoginCard
          onSwitch={onSwitch}
          isExiting={isExiting}
          direction={direction}
        />
      </div>
    </div>
  );
};

export default BuildingLoginPage;

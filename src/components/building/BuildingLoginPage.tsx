import './css/BuildingLoginPage.css';
import BuildingDescription from './BuildingDescription';
import BuildingLoginCard from './BuildingLoginCard';
import { useEffect, useState } from 'react';

import buildingwrapperBackground from '../../assets/images/building-background.png';
import zonewrapperBackground from '../../assets/images/zone-background.png';

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
    <div className="building-description-wrapper">
      <div
        className={`building-bg-overlay ${step === 'slide' ? 'fade-in' : ''}`}
        style={{ backgroundImage: `url(${zonewrapperBackground})` }}
      />

      <div
        className={`building-bg-base ${step === 'slide' ? 'fade-out' : ''}`}
        style={{ backgroundImage: `url(${buildingwrapperBackground})` }}
      />

      <BuildingDescription onSwitch={onSwitch} />
      <div className={`building-login-card-wrapper ${step === 'slide' ? 'building-slide-right' : ''}`}>
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

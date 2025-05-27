import './css/ZoneLoginPage.css';
import ZoneDescription from './ZoneDescription';
import ZoneLoginCard from './ZoneLoginCard';
import { useEffect, useState } from 'react';

import zonewrapperBackground from '../../assets/images/zone-background.png';
import buildingwrapperBackground from '../../assets/images/building-background.png';

interface Props {
  onSwitch: () => void;
  isExiting: boolean;
  direction: 'up' | 'down';
}

const ZoneLoginPage: React.FC<Props> = ({ onSwitch, isExiting, direction }) => {
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
    <div className="zone-description-wrapper">
      <div
        className={`zone-bg-overlay ${step === 'slide' ? 'fade-in' : ''}`}
        style={{ backgroundImage: `url(${buildingwrapperBackground})` }}
      />

      <div
        className={`zone-bg-base ${step === 'slide' ? 'fade-out' : ''}`}
        style={{ backgroundImage: `url(${zonewrapperBackground})` }}
      />

      <ZoneDescription onSwitch={onSwitch} />
      <div className={`zone-login-card-wrapper ${step === 'slide' ? 'zone-slide-left' : ''}`}>
        <ZoneLoginCard
          onSwitch={onSwitch}
          isExiting={isExiting}
          direction={direction}
        />
      </div>
    </div>
  );
};

export default ZoneLoginPage;

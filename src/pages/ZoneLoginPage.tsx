import './css/ZoneLoginPage.css';
import ZoneDescription from '../components/zone/ZoneDescription';
import ZoneLoginCard from '../components/zone/ZoneLoginCard';
import { useEffect, useState } from 'react';

import zonewrapperBackground from '../assets/images/zone-background.png';
import buildingwrapperBackground from '../assets/images/building-background.png';

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

  const handleLogin = () => {
    console.log('로그인 성공');
  };

  return (
    <div className="zone-login-page-description-wrapper">
      <div
        className={`zone-login-page-bg-overlay ${step === 'slide' ? 'zone-login-page-fade-in' : ''}`}
        style={{ backgroundImage: `url(${buildingwrapperBackground})` }}
      />

      <div
        className={`zone-login-page-bg-base ${step === 'slide' ? 'zone-login-page-fade-out' : ''}`}
        style={{ backgroundImage: `url(${zonewrapperBackground})` }}
      />

      <ZoneDescription onSwitch={onSwitch} />
      <div className={`zone-login-page-card-wrapper ${step === 'slide' ? 'zone-login-page-slide-left' : ''}`}>
        <ZoneLoginCard
          onSwitch={onSwitch}
          isExiting={isExiting}
          direction={direction}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
};

export default ZoneLoginPage;

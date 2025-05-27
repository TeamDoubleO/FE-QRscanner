import { useEffect, useState } from 'react';
import BuildingLoginPage from '../../pages/BuildingLoginPage';
import ZoneLoginPage from '../../pages/ZoneLoginPage';

const LoginSwitcher = () => {
  const [isBuildingMode, setIsBuildingMode] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [pendingMode, setPendingMode] = useState<'building' | 'zone'>('zone');

  const handleSwitch = () => {
    setIsExiting(true);
    setPendingMode(isBuildingMode ? 'zone' : 'building');
  };

  const handleExited = () => {
    setIsBuildingMode(pendingMode === 'building');
    setIsExiting(false);
  };

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(handleExited, 800);
      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  return isBuildingMode ? (
    <BuildingLoginPage onSwitch={handleSwitch} isExiting={isExiting} direction="down" />
  ) : (
    <ZoneLoginPage onSwitch={handleSwitch} isExiting={isExiting} direction="up" />
  );
};

export default LoginSwitcher;

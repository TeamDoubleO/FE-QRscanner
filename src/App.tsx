import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import LoginSwitcher from './components/switcher/LoginSwitcher';
import BuildingSelectPage from './pages/BuildingSelectPage';
import ZoneSelectPage from './pages/ZoneSelectPage';
import QRCodeScanner from './pages/QRCodeScanner';

function GlobalPopStateHandler() {
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      console.log("[Global] popstate 발생:", currentPath);

      const scannerInstance = (window as any).scannerRef?.current;
      if (scannerInstance?.clear) {
        scannerInstance.clear()
          .then(() => {
            console.log("[Global] 카메라 정리 완료 (popstate)");
          })
          .catch(console.error)
          .finally(() => {
            (window as any).scannerRef = null;
          });
      } else {
        console.log("[Global] scannerRef가 없음 (이미 null?)");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return null;
}

function LocationWatcher() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/qr')) {
      const scannerInstance = (window as any).scannerRef?.current;
      if (scannerInstance?.clear) {
        scannerInstance.clear()
          .then(() => {
            console.log("[Global] 카메라 정리 완료 (location change)");
          })
          .catch(console.error)
          .finally(() => {
            (window as any).scannerRef = null;
          });
      }
    }
  }, [location.pathname]);

  return null;
}

function App() {

  return (
    <Router>
      <GlobalPopStateHandler />
      <LocationWatcher />
      <Routes>
        <Route path="/" element={<LoginSwitcher />} /> 
        <Route path="/login" element={<LoginSwitcher />} />
        <Route path="/building/select" element={<BuildingSelectPage />} />
        <Route path="/zone/select" element={<ZoneSelectPage />} />
        <Route path="/qr" element={<QRCodeScanner />} />
      </Routes>
    </Router>
  );
}

export default App;

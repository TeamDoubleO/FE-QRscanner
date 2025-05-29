import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSwitcher from './components/switcher/LoginSwitcher';
import BuildingSelectPage from './pages/BuildingSelectPage';
import ZoneSelectPage from './pages/ZoneSelectPage';
import QRCodeScanner from './pages/QRCodeScanner';

function App() {

  return (
    <Router>
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

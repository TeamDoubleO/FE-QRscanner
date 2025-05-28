import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';

import PrivateRoute from './contexts/PrivateRoute';

import LoginSwitcher from './components/switcher/LoginSwitcher';
import BuildingSelectPage from './pages/BuildingSelectPage';
import ZoneSelectPage from './pages/ZoneSelectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSwitcher />} />
        <Route element={<PrivateRoute />}>
        <Route path="/building/select" element={<BuildingSelectPage />} />
        <Route path="/zone/select" element={<ZoneSelectPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

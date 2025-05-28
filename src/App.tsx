import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSwitcher from './components/switcher/LoginSwitcher';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSwitcher />} />
      </Routes>
    </Router>
  );
}

export default App;

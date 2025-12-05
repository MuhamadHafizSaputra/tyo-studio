// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import CalculatorIMT from './Pages/CalculatorIMT';

function App() {
  return (
    <Routes>
      {/* Route for Home Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Route for Calculator Page */}
      <Route path="/calculator" element={<CalculatorIMT />} />
    </Routes>
  );
}

export default App;
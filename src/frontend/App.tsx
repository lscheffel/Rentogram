import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Reservations from './pages/Reservations';
import Navbar from './components/Navbar';
import './styles.css';
import { API_ENDPOINTS } from './config';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Reservations from './pages/Reservations';
import Navbar from './components/Navbar';
import { API_ENDPOINTS } from './config';

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/reservations" element={<Reservations />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;
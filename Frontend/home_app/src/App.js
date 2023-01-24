import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import TemperatureCard from './components/TemperatureCard';
import LineChart from './components/LineChart';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <Router>
      <Navbar toggleMenu={toggleMenu} menuOpen={menuOpen} />
      {menuOpen && <div className="backdrop" onClick={toggleMenu} />}
      <TemperatureCard className="temperature-card" />
      <LineChart />
    </Router>
  );
};

export default App;

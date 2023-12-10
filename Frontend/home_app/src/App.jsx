import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import StreamPage from './pages/StreamPage';
import SpotifyPage from './pages/SpotifyPage';
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
      <Routes>
        <Route exact path="" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/spotify" element={<SpotifyPage />} />
      </Routes>
    </Router>
  );
};

export default App;

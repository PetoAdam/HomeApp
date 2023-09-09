import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarStyle.css';

import discordImg from '../images/discord.png'

const Navbar = ({ menuOpen, toggleMenu }) => {

  const handleZigbeeClick = () => {
    // Redirect the user to the external URL
    window.location.href = 'https://homeapp.ddns.net/mqtt/';
  };

  return (
    <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
      <div className="navbar-left">
      <div className={`hamburger-menu ${menuOpen ? 'rotate' : ''}`} onClick={toggleMenu}>
          <div className={`bar1 ${menuOpen ? 'change' : ''}`}></div>
          <div className={`bar2 ${menuOpen ? 'change' : ''}`}></div>
          <div className={`bar3 ${menuOpen ? 'change' : ''}`}></div>
        </div>
      </div>
      <div className="navbar-middle">
        <Link to="/">
          
          <span className="navbar-text">HomeApp</span>
        </Link>
      </div>
      <div className="navbar-right">
        <a href="https://discord.gg/hXCwzF4JkX">
          <img src={discordImg} alt="Discord" />
        </a>
      </div>
      <div className="navbar-menu">
        <ul className={`nav-menu ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/details">Details</Link></li>
          <li><Link to="/stream">Stream</Link></li>
          <li><Link to="/spotify">Spotify</Link></li>
          <li><Link onClick={handleZigbeeClick}>Zigbee</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
    </nav>
  );
}


export default Navbar;

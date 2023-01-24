import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarStyle.css';

import houseImg from '../images/house.svg'
import discordImg from '../images/discord.png'

const Navbar = ({ menuOpen, toggleMenu }) => {
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
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
    </nav>
  );
}


export default Navbar;

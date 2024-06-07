// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-title">Astro Simulator</h2>
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`navbar-links ${isMobile && isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/ellipse-maker" onClick={() => setIsMenuOpen(false)}>Ellipse Maker</Link>
        </li>
        <li>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Orbit Visualizer</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

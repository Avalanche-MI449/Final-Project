import React from 'react';
import './Navbar.css';
import LogoWhite from './assets/LogoWhite.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo" aria-label="Home">
        <img src={LogoWhite} alt="TourFinder logo" />
      </a>
    </nav>
  );
};

export default Navbar;
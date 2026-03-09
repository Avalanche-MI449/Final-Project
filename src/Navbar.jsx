import React from 'react';
import './Navbar.css';
import TFlogo from './assets/TFlogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo" aria-label="Home">
        <img src={LogoWhite} alt="TF Logo" />
      </a>
    </nav>
  );
};

export default Navbar;
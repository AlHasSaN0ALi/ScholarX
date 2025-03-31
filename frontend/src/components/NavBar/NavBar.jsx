import React, { useState } from 'react';
import './NavBar.css';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      
      <div className="navbar-logo">
        <a href="/">ScholarX</a>
      </div>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        <a href="/about">About Us</a>
        <a href="/services">Our Services</a>
        <a href="/courses">Courses</a>
        <a href="/contact">Contact Us</a>
      
        <div className="navbar-auth mobile-auth">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Get Started</button>
        </div>
      </div>

      <div className="navbar-auth desktop-auth">
        <button className="login-btn">Log In</button>
        <button className="signup-btn">Get Started</button>
      </div>
    </nav>
  );
}

export default NavBar;

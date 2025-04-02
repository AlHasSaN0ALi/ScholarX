import React, { useState, useEffect } from 'react';
import './NavBar.css';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    // Check if there's a hash in URL and scroll to that section when component mounts
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure DOM is fully loaded
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    // If not on homepage, redirect to homepage with contact hash
    if (currentPath !== '/') {
      window.location.href = '/#contact';
      return; // Stop execution here when redirecting
    }
    
    // If already on homepage, scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Contact section not found. Make sure there is an element with id="contact"');
    }
  };

  return (
    <nav className="sx-navbar">
      
      <div className="sx-navbar-logo">
        <a href="/">ScholarX</a>
      </div>

      <button className="sx-mobile-menu-btn" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`sx-navbar-links ${mobileMenuOpen ? 'sx-active' : ''}`}>
        <a href="/" className={currentPath === '/' ? 'sx-active' : ''}>Home</a>
        <a href="/about" className={currentPath === '/about' ? 'sx-active' : ''}>About Us</a>
        <a href="/services" className={currentPath === '/services' ? 'sx-active' : ''}>Our Services</a>
        <a href="/courses" className={currentPath === '/courses' ? 'sx-active' : ''}>Courses</a>
        <a href="/#contact" onClick={scrollToContact}>Contact Us</a>
      
        <div className="sx-navbar-auth sx-mobile-auth">
          <button className="sx-login-btn">Log In</button>
          <button className="sx-signup-btn">Get Started</button>
        </div>
      </div>

      <div className="sx-navbar-auth sx-desktop-auth">
        <button className="sx-login-btn">Log In</button>
        <button className="sx-signup-btn">Get Started</button>
      </div>
    </nav>
  );
}

export default NavBar;

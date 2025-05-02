import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './NavBar.css';
import "bootstrap/dist/css/bootstrap.min.css";

function NavBar({ activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    setIsAuthenticated(authService.isAuthenticated());
  };

  useEffect(() => {
    // If activePage prop is provided, use it; otherwise use window.location.pathname
    setCurrentPath(activePage || window.location.pathname);
    checkAuth();
    
    // Add event listener for auth state changes
    window.addEventListener('authStateChanged', checkAuth);
    
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); 
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, [activePage]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    // Dispatch event to notify other components about logout
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <button className="sx-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      );
    }
    return (
      <>
        <Link to="/signup">
          <button className="sx-signup-btn">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="sx-login-btn">Login</button>
        </Link>
      </>
    );
  };

  return (
    <nav className="sx-navbar">
      <div className="sx-container">
        <div className="sx-navbar-logo">
          <Link to="/">
            <img src="/home-page/logo.png" alt="ScholarX Logo" />
            <span></span>
          </Link>
        </div>

        <button className="sx-mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`sx-navbar-links ${mobileMenuOpen ? 'sx-active' : ''}`}>
          <Link to="/" className={currentPath === '/' ? 'sx-active' : ''}>Home</Link>
          <Link to="/about" className={currentPath === '/about' ? 'sx-active' : ''}>About Us</Link>
          <Link to="/services" className={currentPath === '/services' ? 'sx-active' : ''}>Our Services</Link>
          <div className="sx-dropdown">
            <Link to="/courses" className={currentPath === '/courses' ? 'sx-active' : ''}>Courses</Link>
          </div>
          <Link to="/contact" className={currentPath === '/contact' ? 'sx-active' : ''}>Contact</Link>
        </div>

        <div className="sx-navbar-auth">
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

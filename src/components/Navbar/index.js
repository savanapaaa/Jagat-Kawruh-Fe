import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Jagat Kawruh" className="logo-image" />
          </Link>

          <div className="navbar-right">
            <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/tentang-kami" className="nav-link">Tentang Kami</Link>
            </div>

            <div className="navbar-actions">
              <button className="btn btn-login" onClick={handleLoginClick}>Login</button>
            </div>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

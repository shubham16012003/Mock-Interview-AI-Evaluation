import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import './navbar.css';
import '../components/SignupLogin';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="logo-text">Interactive</span>
          <span className="logo-highlight">ResumeAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/upload" className="nav-link">Upload Resume</Link>
          <Link to="/build" className="nav-link">Build Resume</Link>
          <Link to="/interview" className="nav-link">Mock Interview</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="navbar-auth">
          <Link to="/login" className="auth-link">
            <FiLogIn className="auth-icon" />
            Login
          </Link>
          <Link to="/signup" className="auth-button">
            <FiUser className="auth-icon" />
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/upload" className="mobile-nav-link" onClick={toggleMenu}>Upload Resume</Link>
        <Link to="/build" className="mobile-nav-link" onClick={toggleMenu}>Build Resume</Link>
        <Link to="/interview" className="mobile-nav-link" onClick={toggleMenu}>Mock Interview</Link>
        <Link to="/pricing" className="mobile-nav-link" onClick={toggleMenu}>Pricing</Link>
        
        <div className="mobile-auth-links">
          <Link to="/login" className="mobile-auth-link" onClick={toggleMenu}>
            <FiLogIn className="auth-icon" />
            Login
          </Link>
          <Link to="/signup" className="mobile-auth-button" onClick={toggleMenu}>
            <FiUser className="auth-icon" />
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


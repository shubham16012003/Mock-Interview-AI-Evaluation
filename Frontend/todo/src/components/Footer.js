import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiGithub, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col">
            <h3 className="footer-logo">
              Interactive<span>ResumeAI</span>
            </h3>
            <p className="footer-description">
              Empowering job seekers with AI-powered tools to build better resumes, 
              practice interviews, and land dream jobs.
            </p>
            <div className="footer-socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FiLinkedin className="social-icon" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FiGithub className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/upload">Upload Resume</Link></li>
              <li><Link to="/build">Build Resume</Link></li>
              <li><Link to="/interview">Mock Interview</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><Link to="/templates">Resume Templates</Link></li>
              <li><Link to="/examples">Examples</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FiMail className="contact-icon" />
                info@interactiveresumeai.com
              </li>
              <li>
                <FiPhone className="contact-icon" />
                +1 (555) 123-4567
              </li>
              <li>
                <FiMapPin className="contact-icon" />
                Kothrud Pune
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} InteractiveResumeAI. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
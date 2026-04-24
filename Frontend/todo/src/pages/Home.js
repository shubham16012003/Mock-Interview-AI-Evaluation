import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiEdit2, FiMic, FiArrowRight, FiCheck, FiUsers, FiStar, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-quart',
    });
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="home-content">
        {/* Hero Section */}
        <section className="hero-section" data-aos="fade-down" data-aos-delay="100">
          <h1 className="hero-title">
            Welcome to <span className="highlight">InteractiveResumeAI</span>
          </h1>
          <p className="hero-subtitle">
            Build stunning resumes, get AI-powered interview practice, and unlock your dream career path — all in one place.
          </p>
          
          <div className="badge-container">
            <span className="badge"><FiCheck /> AI-Powered</span>
            <span className="badge"><FiUsers /> User Friendly</span>
            <span className="badge"><FiStar /> Free to Use</span>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section" data-aos="fade-up" data-aos-delay="200">
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Resumes Created</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="100">
            <FiUpload className="feature-icon" />
            <h2>Upload Resume</h2>
            <p>
              Get instant, personalized feedback on your existing resume with our AI-powered analysis tool. 
              We'll identify areas for improvement and help you stand out.
            </p>
            <Link to="/upload" className="cta-button">
              Upload Now <FiArrowRight />
            </Link>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
            <FiEdit2 className="feature-icon" />
            <h2>Build Resume</h2>
            <p>
              Create a professional resume from scratch using our modern templates tailored to your industry. 
              Our builder makes it easy to highlight your strengths.
            </p>
            <Link to="/build" className="cta-button">
              Start Building <FiArrowRight />
            </Link>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="300">
            <FiMic className="feature-icon" />
            <h2>AI Mock Interview</h2>
            <p>
              Practice with realistic interview simulations tailored to your target job. 
              Receive instant feedback on your answers and improve your interview skills.
            </p>
            <Link to="/interview" className="cta-button">
              Start Interview <FiArrowRight />
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="main-cta" data-aos="fade-up" data-aos-delay="400">
          <h2>Ready to level up your career journey?</h2>
          <p>Join thousands of professionals who landed their dream jobs with our tools</p>
          <Link to="/upload" className="primary-button">
            Get Started <FiArrowRight />
          </Link>
        </section>

        {/* Contact Section */}
        <section className="contact-section" data-aos="fade-up" data-aos-delay="500">
          <h2>Contact Us</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          
          <div className="contact-methods">
            <div className="contact-card">
              <FiMapPin className="contact-icon" />
              <h3>Address</h3>
              <p>Happy colony Kothrud Lane 3<br />City, Country</p>
            </div>
            
            <div className="contact-card">
              <FiMail className="contact-icon" />
              <h3>Email</h3>
              <p>shubham16012003@gmail.com </p>
            </div>
            
            <div className="contact-card">
              <FiPhone className="contact-icon" />
              <h3>Phone</h3>
              <p> 8767839411</p>
            </div>
          </div>

          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit" className="primary-button">
              Send Message <FiArrowRight />
            </button>
          </form>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
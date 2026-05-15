import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Background3D from '../components/Background3D';
import './LandingPage.css';
import { FaLeaf, FaTruck, FaChartLine, FaCity, FaArrowRight, FaCheckCircle, FaMobileAlt, FaRecycle, FaGift, FaBrain } from 'react-icons/fa';

const LandingPage = () => {
  
  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-in-section');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="landing-wrapper">
      <Background3D />
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div className="hero-section">
        <div className="hero-content fade-in-section">
          <div className="hero-badge">🚀 Civic Autonomy, Now.</div>
          <h1 className="hero-title">
            Municipal Efficiency, <br />
            <span className="highlight-text">Reimagined.</span>
          </h1>
          <p className="hero-subtitle">
            The single platform for modern cities to automate operations, track fleets in real-time, 
            and drive data-driven recycling. Zero Waste. Zero Stress.
          </p>
          <div className="hero-buttons">
            <button className="btn-glow" onClick={() => window.location.href='/register'}>
              Start Free Trial
            </button>
            <button className="btn-glass" onClick={() => window.location.href='/services'}>
              Explore Solutions
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS STRIP ================= */}
      <div className="stats-strip fade-in-section">
        <div className="container">
          <p className="stats-intro">Trusted by leading municipalities to drive efficiency</p>
          <div className="stats-grid">
            <div className="stat-item"><h2>50+</h2><p>Partner Cities</p></div>
            <div className="stat-item"><h2>10k+</h2><p>Daily Collections</p></div>
            <div className="stat-item"><h2>500T</h2><p>Waste Diverted</p></div>
            <div className="stat-item"><h2>98%</h2><p>Route Efficiency</p></div>
          </div>
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features-section fade-in-section">
        <div className="container">
          {/* Fixed alignment in CSS, structure is correct here */}
          <div className="section-header">
            <span className="section-tag">CORE CAPABILITIES</span>
            <h2>Operational Excellence</h2>
            <p>We merge civic responsibility with advanced technology to streamline the waste lifecycle.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card"><div className="icon-box"><FaLeaf /></div><h3>Zero-Landfill Protocol</h3><p>Maximize recycling compliance with end-to-end, segregated waste processing.</p></div>
            <div className="feature-card"><div className="icon-box"><FaTruck /></div><h3>Live Fleet Command</h3><p>Achieve complete operational visibility with live GPS tracking and dynamic routing.</p></div>
            <div className="feature-card"><div className="icon-box"><FaChartLine /></div><h3>Visual Verification</h3><p>Instantly validate waste volume and type through advanced image recognition.</p></div>
            <div className="feature-card"><div className="icon-box"><FaCity /></div><h3>Municipal Integration</h3><p>Connects directly with city databases and IoT sensor networks.</p></div>
            <div className="feature-card"><div className="icon-box"><FaGift /></div><h3>Citizen Rewards</h3><p>Gamified 'Eco-Points' system to incentivize household recycling.</p></div>
            <div className="feature-card"><div className="icon-box"><FaBrain /></div><h3>Demand Forecasting</h3><p>Predictive models identify hotspots to prevent bin overflow before it happens.</p></div>
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW SECTION ================= */}
      <section className="process-section">
        <div className="container">
          <div className="section-header fade-in-section">
            <span className="section-tag">HOW IT WORKS</span>
            <h2>From Bin to Processing</h2>
          </div>

          {/* Step 1: Request & Analyze (UPDATED IMAGE) */}
          <div className="process-row fade-in-section">
            <div className="process-text">
              <div className="step-number">01</div>
              <h3>Request & Analyze</h3>
              <p>Residents schedule a pickup directly in the app. Our system geotags the location and visually verifies content instantly.</p>
              <ul className="process-list">
                <li><FaCheckCircle /> One-Tap Scheduling</li>
                <li><FaCheckCircle /> Automated Categorization</li>
              </ul>
            </div>
            
            {/* Removed special class, now using default hover effect with accurate image */}
            <div className="process-img-wrapper">
               <img 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                 alt="Person using mobile app for waste request" 
               />
               <div className="floating-card"><FaMobileAlt /> Citizen App</div>
            </div>
          </div>

          {/* Step 2: Route & Collect */}
          <div className="process-row reverse fade-in-section">
            <div className="process-text">
              <div className="step-number">02</div>
              <h3>Route & Collect</h3>
              <p>Dynamic dispatching assigns the nearest driver via an optimized route to reduce fuel usage and response time.</p>
              <ul className="process-list">
                <li><FaCheckCircle /> Fleet Management</li>
                <li><FaCheckCircle /> Live Status Tracking</li>
              </ul>
            </div>
            <div className="process-img-wrapper">
               <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Fleet GPS Tracking" />
               <div className="floating-card"><FaTruck /> Fleet Command</div>
            </div>
          </div>

          {/* Step 3: Reward & Process */}
          <div className="process-row fade-in-section">
            <div className="process-text">
              <div className="step-number">03</div>
              <h3>Reward & Process</h3>
              <p>Waste is certified processed. Citizens earn Eco-Points instantly, closing the loop on the circular economy.</p>
              <ul className="process-list">
                <li><FaCheckCircle /> Circular Economy</li>
                <li><FaCheckCircle /> Instant User Incentives</li>
              </ul>
            </div>
            <div className="process-img-wrapper">
               <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Recycling Facility" />
               <div className="floating-card"><FaRecycle /> Sustainability</div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CTA FOOTER ================= */}
      <section className="cta-section fade-in-section">
        <div className="cta-content">
          <h2>Transform Your City's Future.</h2>
          <p>Join the movement driving civic efficiency and sustainability for all.</p>
          <button className="btn-glow" onClick={() => window.location.href='/register'}>
            Get Started Today <FaArrowRight style={{marginLeft:'10px'}}/>
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
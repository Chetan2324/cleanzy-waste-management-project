import React from 'react';
import Navbar from '../components/Navbar';
import './Services.css';
import { FaTruck, FaRecycle, FaCity, FaIndustry, FaWifi, FaLeaf, FaArrowRight, FaCheckCircle, FaStar } from 'react-icons/fa';

const Services = () => {
  return (
    <div className="services-page">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div className="services-hero">
        <div className="services-hero-content">
          <h1 className="services-title">
            Smart Solutions for <br /> <span>Every Sector</span>
          </h1>
          <p className="services-subtitle">
            From automated residential pickups to industrial-scale waste analytics. 
            We provide the digital infrastructure to keep your environment clean.
          </p>
        </div>
      </div>

      {/* ================= MAIN SERVICES GRID ================= */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            
            {/* Service 1: Residential */}
            <div className="service-card">
              <span className="service-label">FOR HOUSEHOLDS</span>
              <div className="service-icon-box"><FaTruck /></div>
              <h3>Door-to-Door Collection</h3>
              <p>
                Automated scheduling and GPS-tracked collection.
                <span className="outcome-text">Outcome: Never miss a trash day again.</span>
              </p>
              <a href="/login" className="service-link">Schedule Pickup <FaArrowRight /></a>
            </div>

            {/* Service 2: Municipal (CORE HIGHLIGHT) */}
            <div className="service-card core-featured">
              <div className="core-tag"><FaStar style={{fontSize:'0.7rem', marginRight:'5px'}}/> MOST DEPLOYED</div>
              <span className="service-label">FOR MUNICIPALITIES</span>
              <div className="service-icon-box"><FaCity /></div>
              <h3>Smart City Integration</h3>
              <p>
                IoT sensor networks for bin fill-level analysis.
                <span className="outcome-text">Outcome: Reduce fleet fuel costs by 30%.</span>
              </p>
              <span className="service-link">Explore Integration <FaArrowRight /></span>
            </div>

            {/* Service 3: E-Waste */}
            <div className="service-card">
              <span className="service-label">FOR EVERYONE</span>
              <div className="service-icon-box"><FaRecycle /></div>
              <h3>Certified E-Waste</h3>
              <p>
                Secure disposal and recycling of electronics.
                <span className="outcome-text">Outcome: 100% Zero-Landfill compliance.</span>
              </p>
              <a href="/login" className="service-link">Book Disposal <FaArrowRight /></a>
            </div>

            {/* Service 4: Commercial */}
            <div className="service-card">
              <span className="service-label">FOR BUSINESSES</span>
              <div className="service-icon-box"><FaIndustry /></div>
              <h3>Enterprise Bulk Waste</h3>
              <p>
                High-volume logistics for malls and retail.
                <span className="outcome-text">Outcome: Audit-ready ESG sustainability reports.</span>
              </p>
              <span className="service-link">Get Custom Quote <FaArrowRight /></span>
            </div>

            {/* Service 5: Organic */}
            <div className="service-card">
              <span className="service-label">SUSTAINABILITY</span>
              <div className="service-icon-box"><FaLeaf /></div>
              <h3>Organic Processing</h3>
              <p>
                Transforming wet waste into compost resources.
                <span className="outcome-text">Outcome: Turn waste liabilities into assets.</span>
              </p>
              <span className="service-link">View Process <FaArrowRight /></span>
            </div>

            {/* Service 6: Analytics */}
            <div className="service-card">
              <span className="service-label">FOR PLANNERS</span>
              <div className="service-icon-box"><FaWifi /></div>
              <h3>Data & Predictive AI</h3>
              <p>
                A command center for city sanitation planning.
                <span className="outcome-text">Outcome: Predict infrastructure needs before overflow.</span>
              </p>
              <span className="service-link">See Demo <FaArrowRight /></span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PLANS / SECTORS SECTION ================= */}
      <section className="solutions-section">
        <div className="container">
          <div className="solutions-header">
            {/* TRANSITION LINE */}
            <p className="transition-line">
              From individual households to metropolitan infrastructures, our platform adapts to your scale.
            </p>
            
            <h2>Tailored Plans</h2>
            <p style={{color: 'var(--text-muted)'}}>Choose the tier that fits your operations.</p>
          </div>

          <div className="solutions-container">
            
            {/* Residential Plan */}
            <div className="solution-card">
              <h3>For Homes</h3>
              <span className="solution-price">Free / Pay-per-pickup</span>
              <p className="plan-desc">Convenience for households and apartments.</p>
              <ul className="solution-features">
                <li><FaCheckCircle className="check-icon"/> On-Demand Scheduling</li>
                <li><FaCheckCircle className="check-icon"/> Real-time Driver Tracking</li>
                <li><FaCheckCircle className="check-icon"/> Earn Eco-Points Rewards</li>
                <li><FaCheckCircle className="check-icon"/> 24/7 App Support</li>
              </ul>
              {/* NOTE: Class matches CSS fix below */}
              <button className="plan-btn btn-secondary">Get Started</button>
            </div>

            {/* Commercial Plan */}
            <div className="solution-card featured">
              <div className="popular-tag">RECOMMENDED FOR BUSINESS</div>
              <h3>For Enterprise</h3>
              <span className="solution-price">Custom Contract</span>
              <p className="plan-desc">Comprehensive logistics for businesses & cities.</p>
              <ul className="solution-features">
                <li><FaCheckCircle className="check-icon"/> Bulk & Hazardous Handling</li>
                <li><FaCheckCircle className="check-icon"/> Compliance Certificates</li>
                <li><FaCheckCircle className="check-icon"/> API Access for Analytics</li>
                <li><FaCheckCircle className="check-icon"/> Dedicated Account Manager</li>
              </ul>
              {/* NOTE: Class matches CSS fix below */}
              <button className="plan-btn btn-primary">Contact Sales</button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */ }
      <section className="services-cta">
        <div className="container">
          <h2 style={{fontSize: '2.5rem', color: 'white', marginBottom: '20px'}}>Ready to optimize your waste?</h2>
          <button className="btn btn-primary" onClick={() => window.location.href='/contact'}>Get a Custom Quote</button>
        </div>
      </section>
    </div>
  );
};

export default Services;
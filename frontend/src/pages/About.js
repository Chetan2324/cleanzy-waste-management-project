import React from 'react';
import Navbar from '../components/Navbar';
import './About.css';
import { 
  FaLeaf, FaLightbulb, FaUsers, FaLock, 
  FaLinkedin, FaGithub, FaTwitter, FaInstagram, 
  FaBrain, FaGlobe, FaMobileAlt 
} from 'react-icons/fa';

// ✅ IMPORTING LOCAL IMAGES
import FounderImg from '../assets/Founder.png';
import CoFounder1Img from '../assets/CoFounder1.png';
import CoFounder2Img from '../assets/CoFounder2.png';

const About = () => {
  
  // Leadership Data Configuration
  const teamMembers = [
    {
      name: 'Chetan Sharma',
      role: 'Founder & CEO',
      desc: 'Visionary driving CleanZy’s mission. Specializes in MERN architecture, scalable backend systems, and citizen-centric platforms.',
      img: FounderImg,
      links: {
        linkedin: 'https://www.linkedin.com/in/chetansharma3114',
        github: 'https://github.com/Chetan2324',
        instagram: 'https://www.instagram.com/chetansharma_2324'
      }
    },
    {
      name: 'Firoj Khan',
      role: 'Co-Founder & Operations',
      desc: 'Operations strategist focused on execution, logistics optimization, and coordination between citizens and municipalities.',
      img: CoFounder1Img,
      links: {
        linkedin: 'https://www.linkedin.com/in/firoj-khan786',
        github: 'https://github.com/imfiroj123-gif',
        instagram: 'https://www.instagram.com/f_i_r_o_j05'
      }
    },
    {
      name: 'Ankit Raj',
      role: 'Co-Founder & Tech Lead',
      desc: 'Responsible for frontend architecture, real-time dashboards, system performance, and API integrations.',
      img: CoFounder2Img,
      links: {
        linkedin: 'https://www.linkedin.com/in/ankit-raj-006667218',
        github: 'https://github.com/Ankit-CSE-01',
        instagram: null // Ankit does not have an instagram link in requirements
      }
    }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      {/* ================= HERO SECTION ================= */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">Engineered for a <br/> <span>Cleaner Tomorrow</span></h1>
          <p className="about-subtitle">
            Leveraging AI, IoT, and community collaboration to build the <br /> 
            smart waste management infrastructure of the future.
          </p>
        </div>
      </div>

      {/* ================= MISSION SECTION ================= */}
      <section className="mission-section">
        <div className="container mission-container">
          <div className="mission-text">
            <span className="mission-label">Our Mission</span>
            
            {/* MICRO STORYTELLING HOOK */}
            <div className="mission-hook">
              <p>Waste management shouldn't be a black box. <br/>
              <span style={{color: 'white'}}>We engineered CleanZy to make sanitation predictive, transparent, and citizen-centric.</span></p>
            </div>

            <h2>Digital Infrastructure for Green Cities</h2>
            <p>
              By combining IoT sensor data with user-reported issues, we optimize fleet routes 
              in real-time, reducing fuel consumption and ensuring zero-overflow compliance.
            </p>

            {/* KEY DIFFERENTIATORS */}
            <div className="differentiator-row">
              <div className="diff-item">
                <FaBrain className="diff-icon"/> <span>AI-Driven Insights</span>
              </div>
              <div className="diff-item">
                <FaGlobe className="diff-icon"/> <span>Real-Time Transparency</span>
              </div>
              <div className="diff-item">
                <FaMobileAlt className="diff-icon"/> <span>Citizen-First Design</span>
              </div>
            </div>

          </div>

          <div className="mission-image tech-img-box">
            <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop" alt="Smart Urban Infrastructure" />
          </div>
        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="values-section">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center', marginBottom: '60px'}}>
            <span className="mission-label">Our DNA</span>
            <h2 style={{fontSize: '3rem', color: 'white', marginBottom: '10px'}}>Core Values</h2>
            <p style={{color: 'var(--text-secondary)'}}>The engineering principles guiding our platform.</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <FaLightbulb className="value-icon"/>
              <h3>Innovation First</h3>
              <p>Leveraging MERN stack architecture to solve age-old sanitation problems with scalable, modern code.</p>
            </div>
            <div className="value-card">
              <FaLeaf className="value-icon"/>
              <h3>Sustainability</h3>
              <p>Optimizing truck routes to drastically reduce carbon footprint and fuel consumption.</p>
            </div>
            <div className="value-card">
              <FaLock className="value-icon"/>
              <h3>Transparency</h3>
              <p>Open protocols ensure citizens see exactly when, where, and how their waste is processed.</p>
            </div>
            <div className="value-card">
              <FaUsers className="value-icon"/>
              <h3>Community Driven</h3>
              <p>Empowering locals to take charge of their neighborhoods through instant reporting tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP SECTION ================= */}
      <section className="team-section">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center', marginBottom: '60px'}}>
            <span className="mission-label">The Founders</span>
            <h2 style={{fontSize: '3rem', color: 'white', marginBottom: '10px'}}>Meet the Leadership</h2>
            <p style={{color: 'var(--text-secondary)'}}>Architecting the future of urban sanitation.</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-image-wrapper">
                  {/* Inline style fixes the zoom issue by prioritizing the top of the image (faces) */}
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    style={{ objectPosition: 'top center' }} 
                  />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p>{member.desc}</p>
                  <div className="social-bar">
                    {member.links.linkedin && (
                      <a href={member.links.linkedin} target="_blank" rel="noreferrer" className="social-icon">
                        <FaLinkedin />
                      </a>
                    )}
                    {member.links.github && (
                      <a href={member.links.github} target="_blank" rel="noreferrer" className="social-icon">
                        <FaGithub />
                      </a>
                    )}
                    {member.links.instagram && (
                      <a href={member.links.instagram} target="_blank" rel="noreferrer" className="social-icon">
                        <FaInstagram />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
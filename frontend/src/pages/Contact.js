import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import emailjs from '@emailjs/browser';
import './Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaChevronDown, FaPaperPlane, FaCheck, FaSpinner, FaChevronUp, FaInfoCircle } from 'react-icons/fa';

const Contact = () => {
  const form = useRef();

  // Form State
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [formValid, setFormValid] = useState(false);
  const [touched, setTouched] = useState({});

  // FAQ State
  const [activeFaq, setActiveFaq] = useState(null);

  // FAQ Data (Reordered by User Priority: Cost -> Service -> Tech -> Partner)
  const faqData = [
    { question: "Is the service free for residents?", answer: "Basic municipal collection is free. Specialized pickups (E-waste, Bulk) may incur a nominal convenience fee depending on your city." },
    { question: "What types of waste do you collect?", answer: "We handle household dry/wet waste, e-waste, construction debris, and bulk furniture. Hazardous waste requires a special request." },
    { question: "How do I track my pickup driver?", answer: "Once your pickup is confirmed, a live tracking link will be available on your dashboard 30 minutes before the scheduled slot." },
    { question: "How do I become a partner?", answer: "If you are a recycling facility or a transport provider, please fill out the form above and select 'Business / Partnership' as the subject." }
  ];

  // Validation Effect
  useEffect(() => {
    const isValid = 
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.includes('@') &&
      formData.message.trim().length > 10;
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;

    setStatus('loading');

    emailjs.sendForm(
      'service_9ej82rq',   // Your Service ID
      'template_gef6xw6',  // Your Template ID
      form.current,
      '4-FpOP2IlOXRwz4aA'  // Your Public Key
    )
    .then((result) => {
        console.log(result.text);
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
        setTouched({});
    }, (error) => {
        console.log(error.text);
        setStatus('error');
        alert("Failed to send. Please check your connection.");
    });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-header">
        <h1>Get in <span>Touch</span></h1>
        <p>Have a question about Smart Waste Portal? We are here to help you optimize your sanitation solutions.</p>
      </div>

      <div className="container contact-container">
        
        {/* ================= LEFT SIDE: INFO CARDS ================= */}
        <div className="contact-info-column">
          
          <div className="info-card" role="button" tabIndex="0">
            <div className="icon-circle"><FaPhone aria-hidden="true"/></div>
            <div>
              <h3>Call Us</h3>
              <p>Mon-Fri from 9am to 6pm</p>
              <a href="tel:+916377635940" className="contact-link">+91 63776 35940</a>
            </div>
          </div>

          <div className="info-card" role="button" tabIndex="0">
            <div className="icon-circle"><FaEnvelope aria-hidden="true"/></div>
            <div>
              <h3>Email Support</h3>
              <p>We usually reply within 24 hours</p>
              <a href="mailto:chetansharma32652@gmail.com" className="contact-link">chetansharma32652@gmail.com</a>
            </div>
          </div>

          <div className="info-card" role="button" tabIndex="0">
            <div className="icon-circle"><FaMapMarkerAlt aria-hidden="true"/></div>
            <div>
              <h3>Headquarters</h3>
              <p>School of Computer Science & Engineering,<br/>Lovely Professional University, Punjab</p>
            </div>
          </div>

          <div className="social-connect-card">
            <h3>Connect with the Team</h3>
            <p>Follow our building journey</p>
            <div className="social-icons">
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="GitHub"><FaGithub /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FORM ================= */}
        <div className="contact-form-column">
          <div className="form-card">
            <h2>Send a Message</h2>
            <p className="form-subtitle">Fill out the form below. We usually respond within 24 hours.</p>

            {status === 'success' ? (
              <div className="success-message">
                <FaCheck className="success-icon" />
                <h3>Message Sent!</h3>
                <p>We'll get back to you shortly.</p>
                <button className="reset-btn" onClick={() => setStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name <span className="req">*</span></label>
                    <input 
                      type="text" id="firstName" name="firstName" 
                      value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur}
                      placeholder="John" required 
                      className={touched.firstName && !formData.firstName ? "input-error" : ""}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name <span className="req">*</span></label>
                    <input 
                      type="text" id="lastName" name="lastName" 
                      value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur}
                      placeholder="Doe" required 
                      className={touched.lastName && !formData.lastName ? "input-error" : ""}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="req">*</span></label>
                  <input 
                    type="email" id="email" name="email" 
                    value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                    placeholder="john@example.com" required 
                    className={touched.email && !formData.email.includes('@') ? "input-error" : ""}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="select-wrapper">
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange}>
                      <option>General Inquiry</option>
                      <option>Pickup Request</option>
                      <option>Business / Partnership</option>
                      <option>Technical Support</option>
                    </select>
                    <FaChevronDown className="select-icon"/>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="req">*</span></label>
                  <textarea 
                    id="message" name="message" 
                    value={formData.message} onChange={handleInputChange} onBlur={handleBlur}
                    placeholder="How can we help you?" rows="5" required
                    className={touched.message && formData.message.length < 10 ? "input-error" : ""}
                  ></textarea>
                  {touched.message && formData.message.length < 10 && <span className="error-hint">Message must be at least 10 characters.</span>}
                </div>

                <button 
                  type="submit" 
                  className={`contact-btn btn-primary ${!formValid ? 'disabled' : ''}`} 
                  disabled={!formValid || status === 'loading'}
                >
                  {status === 'loading' ? <><FaSpinner className="spin" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                </button>

                {/* PRIVACY MICRO-COPY */}
                <p className="privacy-text">
                  <FaInfoCircle style={{fontSize:'0.8rem', marginRight:'5px'}}/> 
                  We respect your privacy. Your information is never shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ================= FAQ SECTION ================= */}
      <div className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Quick answers to common questions.</p>
          
          <div className="faq-grid">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-card ${activeFaq === index ? 'active' : ''}`} 
                onClick={() => toggleFaq(index)}
                role="button"
                aria-expanded={activeFaq === index}
              >
                <div className="faq-header">
                  <h3>{faq.question}</h3>
                  {activeFaq === index ? <FaChevronUp className="faq-icon"/> : <FaChevronDown className="faq-icon"/>}
                </div>
                <div className="faq-body">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Form.css'; 
import { 
  FaUser, FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, 
  FaCheckCircle, FaLeaf, FaGift, FaGlobe, FaSpinner, 
  FaExclamationCircle, FaInfoCircle
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [formValid, setFormValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Validation Effect
  useEffect(() => {
    const isMatch = formData.password === formData.confirmPassword || formData.confirmPassword === '';
    setPasswordsMatch(isMatch);

    setFormValid(
      formData.name.trim().length > 2 &&
      formData.email.includes('@') && 
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    setStatus('loading');

    try {
      // --- REAL BACKEND CALL ---
      // Role is implicit 'resident' for public signup
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'resident' 
      };

      await axios.post('http://localhost:5000/api/auth/register', payload);

      // Success Logic
      setStatus('success');
      toast.success('Registration successful! Please login.');
      
      // Redirect to Login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Registration Failed:", error);
      setStatus('idle'); // Allow retrying
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      
      <div className="auth-container">
        
        {/* ================= LEFT SIDE: BENEFITS PANEL ================= */}
        <div className="auth-left">
          <div className="auth-welcome-content">
            <h1>Join <br /> <span className="brand-green">CleanZy</span></h1>
            <p>Become a part of the smart city revolution. Track waste, earn points, and keep your city clean.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><FaGlobe /></div>
                <span>Citizen Impact Dashboard</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaGift /></div>
                <span>Earn Eco-Points</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaLeaf /></div>
                <span>Green Community Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: REGISTER FORM ================= */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Resident Sign Up</h2>
            <p className="auth-subtitle">Create your personal citizen account.</p>

            {/* Helper Banner */}
            <div style={{ backgroundColor: '#27272a', padding: '10px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem', color: '#a1a1aa' }}>
              <FaInfoCircle className="text-blue-400" />
              <span>Waste Collectors & Admin accounts are managed internally.</span>
            </div>

            {status === 'success' ? (
              <div className="success-state">
                <FaCheckCircle className="success-icon" />
                <h3>Account Created!</h3>
                <p>Redirecting to login page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon left" />
                    <input 
                      type="text" id="name" name="name" 
                      value={formData.name} onChange={handleInputChange} 
                      placeholder="John Doe" required 
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon left" />
                    <input 
                      type="email" id="email" name="email" 
                      value={formData.email} onChange={handleInputChange} 
                      placeholder="name@example.com" required 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon left" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" name="password" 
                      value={formData.password} onChange={handleInputChange} 
                      placeholder="Create a strong password" required 
                    />
                    <button 
                      type="button" className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon left" />
                    <input 
                      type="password" id="confirmPassword" name="confirmPassword" 
                      value={formData.confirmPassword} onChange={handleInputChange} 
                      placeholder="Repeat password" required 
                      className={!passwordsMatch ? 'input-error' : ''}
                    />
                  </div>
                  {!passwordsMatch && (
                    <span className="error-hint">
                      <FaExclamationCircle style={{marginRight: '5px'}}/> Passwords do not match
                    </span>
                  )}
                </div>

                {/* Create Account Button */}
                <button 
                  type="submit" 
                  className={`auth-btn ${!formValid || status === 'loading' ? 'disabled' : ''}`}
                  disabled={!formValid || status === 'loading'}
                >
                  {status === 'loading' ? <><FaSpinner className="spin" /> Creating...</> : "Create Citizen Account"}
                </button>

                <div className="divider">
                  <span>OR JOIN WITH</span>
                </div>

                <button type="button" className="btn-social">
                  <FaGoogle /> Sign up with Google
                </button>

                <p className="auth-footer">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>

              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
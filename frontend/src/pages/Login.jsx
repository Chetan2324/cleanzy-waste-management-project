import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Form.css'; 
import { 
  FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, 
  FaExclamationTriangle, FaSpinner, FaCheckCircle, 
  FaLeaf, FaChartBar, FaShieldAlt 
} from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // Simple client-side validation
    setFormValid(formData.email.includes('@') && formData.password.length > 0);
  }, [formData]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    setStatus('loading');

    try {
      // --- BACKEND AUTH CALL ---
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // ✅ SUCCESSFUL LOGIN (Admin or Citizen when Maintenance is OFF)
      if (response.data && response.data.token) {
        setStatus('success');
        
        // 1. Save User Data
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        // 2. Check Role (Case Insensitive)
        const userRole = response.data.role ? response.data.role.toLowerCase() : 'resident';

        // 3. Redirect Logic
        setTimeout(() => {
          if (userRole === 'admin' || userRole === 'administrator') {
            toast.success(`Welcome Admin ${response.data.name}!`);
            navigate('/admin/dashboard'); 
          } else {
            toast.success(`Welcome back, ${response.data.name}`);
            navigate('/dashboard'); 
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login Failed:", error.response);
      setStatus('error');
      
      // ✅ SPECIFIC MAINTENANCE HANDLING (503)
      if (error.response && error.response.status === 503) {
        // User is a Citizen trying to access during Maintenance
        toast.warn("Citizen access is temporarily disabled due to maintenance.");
        
        // 🚀 CRITICAL FIX: Redirect to Maintenance Page immediately
        setTimeout(() => {
          navigate('/maintenance'); 
        }, 1500); 
        
      } else {
        // Generic Authentication Errors (400, 401, 404)
        const errorMessage = error.response?.data?.message || 'Login failed. Please check credentials.';
        toast.error(errorMessage);
        
        // Reset status so user can try again (only if NOT maintenance redirecting)
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      
      <div className="auth-container">
        
        {/* Left Side Branding */}
        <div className="auth-left">
          <div className="auth-welcome-content">
            <h1>Welcome to <br /> <span className="brand-green">CleanZy</span></h1>
            <p>Access your dashboard to track pickups, report issues, and view analytics.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><FaChartBar /></div>
                <span>Real-time Waste Analytics</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaLeaf /></div>
                <span>Carbon Footprint Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaShieldAlt /></div>
                <span>Secure & Transparent Reporting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your email and password.</p>

            {status === 'error' && (
              <div className="error-banner">
                <FaExclamationTriangle /> Login Failed. Check your details.
              </div>
            )}

            {status === 'success' ? (
              <div className="success-state">
                <FaCheckCircle className="success-icon" />
                <h3>Welcome Back!</h3>
                <p>Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">Password</label>
                    <Link to="/forgot-password" style={{fontSize: '0.85rem', color: '#22c55e', textDecoration: 'none'}}>Forgot password?</Link>
                  </div>
                  <div className="input-wrapper">
                    <FaLock className="input-icon left" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" name="password" 
                      value={formData.password} onChange={handleInputChange} 
                      placeholder="Enter your password" required 
                    />
                    <button 
                      type="button" className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`auth-btn ${!formValid || status === 'loading' ? 'disabled' : ''}`}
                  disabled={!formValid || status === 'loading'}
                >
                  {status === 'loading' ? <><FaSpinner className="spin" /> Verifying...</> : "Login to Dashboard"}
                </button>

                <div className="divider"><span>OR CONTINUE WITH</span></div>
                <button type="button" className="btn-social"><FaGoogle /> Sign in with Google</button>
                <p className="auth-footer">
                  Don't have an account? <Link to="/register">Create Account</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
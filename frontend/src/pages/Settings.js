import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaCog, FaBell, FaSignOutAlt, FaTrashAlt, 
  FaSave, FaCheckCircle, FaExclamationTriangle, FaTimes 
} from 'react-icons/fa';
import './Settings.css'; // We will create this next

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: 'Chetan Sharma',
    email: 'chetan@example.com',
    pickupTime: 'Morning',
    wasteType: 'Mixed',
    notifications: true
  });

  useEffect(() => {
    // Simulate fetching user settings
    setTimeout(() => setLoading(false), 500);
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Simulate API Call
    alert('Account deleted. Goodbye!');
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="loading-screen">Loading Settings...</div>;

  return (
    <div className="settings-page">
      <Navbar />
      
      <div className="settings-container">
        
        {/* HEADER */}
        <div className="settings-header">
          <h1><FaCog className="spin-icon"/> Account Settings</h1>
          <p>Manage your profile, preferences, and account security.</p>
        </div>

        <div className="settings-grid">
          
          {/* 1. PROFILE SETTINGS */}
          <div className="settings-card">
            <div className="card-header">
              <h3><FaUser /> Profile Details</h3>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="input-dark"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="verified-input-wrapper">
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="input-dark disabled"
                />
                <span className="badge-verified"><FaCheckCircle/> Verified</span>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="btn-save" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>

          {/* 2. PREFERENCES */}
          <div className="settings-card">
            <div className="card-header">
              <h3><FaBell /> Preferences</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Preferred Pickup Time</label>
                <select 
                  name="pickupTime" 
                  value={formData.pickupTime} 
                  onChange={handleChange}
                  className="input-dark"
                >
                  <option value="Morning">Morning (9AM - 11AM)</option>
                  <option value="Afternoon">Afternoon (12PM - 3PM)</option>
                  <option value="Evening">Evening (4PM - 7PM)</option>
                </select>
              </div>
              <div className="form-group half">
                <label>Default Waste Type</label>
                <select 
                  name="wasteType" 
                  value={formData.wasteType} 
                  onChange={handleChange}
                  className="input-dark"
                >
                  <option value="Mixed">Mixed Waste</option>
                  <option value="Dry">Dry Waste Only</option>
                  <option value="E-Waste">E-Waste</option>
                </select>
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-text">
                <span>Email Notifications</span>
                <small>Receive updates about your pickup status.</small>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  name="notifications" 
                  checked={formData.notifications} 
                  onChange={handleChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* 3. DANGER ZONE */}
          <div className="settings-card danger-zone">
            <div className="card-header danger">
              <h3><FaExclamationTriangle /> Danger Zone</h3>
            </div>
            <div className="danger-actions">
              <div className="danger-row">
                <div>
                  <strong>Log Out</strong>
                  <p>End your session on this device.</p>
                </div>
                <button className="btn-outline" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
              <div className="divider"></div>
              <div className="danger-row">
                <div>
                  <strong>Delete Account</strong>
                  <p>Permanently remove your account and data.</p>
                </div>
                <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <FaTrashAlt /> Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Are you sure?</h3>
              <button onClick={() => setShowDeleteModal(false)}><FaTimes/></button>
            </div>
            <p>This action cannot be undone. All your EcoPoints and history will be lost.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleDeleteAccount}>Yes, Delete My Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
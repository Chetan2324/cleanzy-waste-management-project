import React from 'react';
import { FaServer, FaTools, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Maintenance.css';

const MaintenancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="maintenance-container">
      <div className="maintenance-content animate-fade-in">
        <div className="maintenance-icon-wrapper">
          <FaServer className="maintenance-icon" />
          <div className="maintenance-gear"><FaTools /></div>
        </div>
        
        <h1 className="maintenance-title">System Under Maintenance</h1>
        
        <p className="maintenance-desc">
          CleanZy is currently undergoing scheduled upgrades to improve your experience.
          <br />
          Citizen access is temporarily unavailable.
        </p>

        <div className="maintenance-footer">
          <p className="admin-prompt"><FaLock style={{marginRight:'5px'}}/> Administrator Access</p>
          <button onClick={() => navigate('/login')} className="admin-login-btn">
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
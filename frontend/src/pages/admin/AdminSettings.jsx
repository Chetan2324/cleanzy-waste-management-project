import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaCogs, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCalendarCheck, 
  FaClipboardList, 
  FaServer 
} from 'react-icons/fa';

// Styles & Components
import '../../assets/css/AdminDashboard.css'; // Generic layout
import '../../assets/css/AdminSettings.css';  // Specific styles
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

const AdminSettings = () => {
  const adminName = JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin';

  // --- STATE ---
  const [settings, setSettings] = useState({
    allowIssueReporting: true,
    allowPickupScheduling: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Track which key is updating

  // --- FETCH SETTINGS ---
  const fetchSettings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.get('http://localhost:5000/api/admin/settings', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setSettings(data);
    } catch (error) {
      console.error("Fetch Settings Error:", error);
      toast.error("Failed to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  // --- TOGGLE HANDLER ---
  const handleToggle = async (key, currentValue) => {
    setUpdating(key); // Lock specific switch
    const newValue = !currentValue;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const payload = { [key]: newValue };

      const { data } = await axios.put(
        'http://localhost:5000/api/admin/settings',
        payload,
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      // Update State on Success
      setSettings(prev => ({ ...prev, [key]: newValue }));
      
      if (key === 'maintenanceMode' && newValue === true) {
        toast.warn("System is now in Maintenance Mode!");
      } else {
        toast.success("Settings updated successfully");
      }

    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update setting");
    } finally {
      setUpdating(null); // Unlock switch
    }
  };

  return (
    <div className="admin-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="main-content">
        <Navbar adminName={adminName} />

        <div className="content-wrapper animate-fade-in">
          
          {/* HEADER */}
          <div className="settings-header">
            <h1 className="settings-title">
              <FaCogs className="text-gray-400" /> System Configuration
            </h1>
            <p className="settings-subtitle">Manage global availability of citizen features and system status.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="spin text-3xl text-green-500" />
            </div>
          ) : (
            <div className="settings-grid">
              
              {/* 1. ISSUE REPORTING TOGGLE */}
              <div className="setting-card">
                <div className="setting-info">
                  <div className="flex items-center gap-2 mb-1">
                    <FaClipboardList className="text-blue-400" />
                    <span className="setting-label">Issue Reporting</span>
                  </div>
                  <p className="setting-desc">Allow citizens to submit new waste complaints and issues.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.allowIssueReporting} 
                    disabled={updating === 'allowIssueReporting'}
                    onChange={() => handleToggle('allowIssueReporting', settings.allowIssueReporting)}
                  />
                  <span className="slider"></span>
                  {updating === 'allowIssueReporting' && <FaSpinner className="switch-loading" />}
                </label>
              </div>

              {/* 2. PICKUP SCHEDULING TOGGLE */}
              <div className="setting-card">
                <div className="setting-info">
                  <div className="flex items-center gap-2 mb-1">
                    <FaCalendarCheck className="text-yellow-400" />
                    <span className="setting-label">Pickup Scheduling</span>
                  </div>
                  <p className="setting-desc">Allow citizens to schedule waste pickups for their address.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.allowPickupScheduling}
                    disabled={updating === 'allowPickupScheduling'}
                    onChange={() => handleToggle('allowPickupScheduling', settings.allowPickupScheduling)}
                  />
                  <span className="slider"></span>
                  {updating === 'allowPickupScheduling' && <FaSpinner className="switch-loading" />}
                </label>
              </div>

              {/* 3. MAINTENANCE MODE TOGGLE (DANGER) */}
              <div className={`setting-card danger-zone`}>
                <div className="setting-info">
                  <div className="flex items-center gap-2 mb-1">
                    <FaServer className="text-red-500" />
                    <span className="setting-label text-red-400">Maintenance Mode</span>
                  </div>
                  <p className="setting-desc">Suspend all citizen activities temporarily.</p>
                  
                  {settings.maintenanceMode && (
                     <div className="warning-text">
                       <FaExclamationTriangle /> BLOCKING ALL ACCESS
                     </div>
                  )}
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.maintenanceMode}
                    disabled={updating === 'maintenanceMode'}
                    onChange={() => handleToggle('maintenanceMode', settings.maintenanceMode)}
                  />
                  <span className="slider danger-slider"></span>
                  {updating === 'maintenanceMode' && <FaSpinner className="switch-loading" />}
                </label>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
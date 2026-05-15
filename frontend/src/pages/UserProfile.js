import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaHistory, FaCog, FaShieldAlt, FaCamera, FaMedal, 
  FaLeaf, FaRecycle, FaArrowLeft, FaCheckCircle, FaTree, FaBolt,
  FaTrophy, FaLock, FaArrowUp, FaPen, FaStar, 
  FaTruck, FaExclamationTriangle, FaGift, FaLevelUpAlt, FaCalendarCheck,
  FaBell, FaMapMarkerAlt, FaGlobe, FaMoon, FaSave, 
  FaMobileAlt, FaLaptop, FaTimes, FaExclamationCircle, FaKey
} from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security'); // Default to Security for demo
  const [activityFilter, setActivityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- SECURITY STATE ---
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-3
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // --- MOCK DATA STATE ---
  const [user, setUser] = useState({
    name: "Chetan Sharma",
    email: "chetan@example.com",
    phone: "+91 98765 43210",
    address: "B-402, Green Valley Apartments, Pune",
    avatar: null, 
    joined: "Nov 2024",
    status: "Active",
    roleBadge: "Top 10% Contributor",
    lastPasswordChange: "Oct 25, 2024",
    stats: {
      level: 5,
      xp: 850,
      nextXp: 1000,
      pickups: 12,
      pickupTrend: "+2 this week",
      diverted: 45.5,
      divertedTrend: "+5kg this month",
      points: 1250,
      pointsTrend: "Top 5% in area",
      co2: 120, 
      trees: 6,
      energy: 300 
    },
    settings: {
      pickupTime: "Morning",
      wasteType: "Mixed",
      autoSchedule: false,
      language: "English",
      theme: "Dark"
    },
    notifications: {
      email: true,
      sms: false,
      reminder: true,
      rewards: true
    },
    sessions: [
      { id: 1, device: 'MacBook Pro', location: 'Pune, India', ip: '192.168.1.1', current: true, type: 'laptop' },
      { id: 2, device: 'iPhone 13', location: 'Pune, India', ip: '192.168.1.45', current: false, type: 'mobile' }
    ],
    badges: [
      { id: 1, name: "Early Adopter", icon: <FaStar/>, desc: "Joined in Beta", unlocked: true, date: "Nov 10, 2024" },
      { id: 2, name: "Eco Warrior", icon: <FaLeaf/>, desc: "10+ Pickups", unlocked: true, date: "Dec 05, 2024" },
      { id: 3, name: "Recycle Pro", icon: <FaRecycle/>, desc: "50kg Diverted", unlocked: false, progress: "45.5/50 kg" },
      { id: 4, name: "Community Hero", icon: <FaTrophy/>, desc: "Refer 5 friends", unlocked: false, progress: "2/5" }
    ],
    activity: [
      { id: 1, type: 'pickup', title: 'Weekly Pickup Completed', desc: '4.5kg Dry Waste collected', date: '2 hours ago', xp: '+50 XP', icon: <FaTruck/> },
      { id: 2, type: 'reward', title: 'Level Up!', desc: 'Reached Level 5 (Scholar)', date: 'Yesterday', xp: 'Reward', icon: <FaLevelUpAlt/> },
      { id: 3, type: 'report', title: 'Issue Resolved', desc: 'Overflow report verified & cleared', date: '3 days ago', xp: '+20 XP', icon: <FaCheckCircle/> },
      { id: 4, type: 'pickup', title: 'E-Waste Collection', desc: 'Old batteries & cables', date: '5 days ago', xp: '+75 XP', icon: <FaTruck/> },
      { id: 5, type: 'system', title: 'Email Verified', desc: 'Account security updated', date: '1 week ago', xp: '', icon: <FaShieldAlt/> },
      { id: 6, type: 'reward', title: 'Badge Earned', desc: 'Unlocked "Eco Warrior"', date: '2 weeks ago', xp: '+100 XP', icon: <FaMedal/> },
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- HANDLERS ---
  const getFilteredActivity = () => {
    if (activityFilter === 'all') return user.activity;
    return user.activity.filter(item => item.type === activityFilter);
  };

  const handleToggle = (key) => {
    setUser(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }));
  };

  const handleSettingChange = (key, value) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings Saved Successfully!");
    }, 1500);
  };

  // Security Handlers
  const handlePasswordChange = (field, value) => {
    const updated = { ...passwords, [field]: value };
    setPasswords(updated);
    
    if (field === 'new') {
        // Simple strength check logic
        let score = 0;
        if (value.length > 6) score++;
        if (value.match(/[A-Z]/)) score++;
        if (value.match(/[0-9]/)) score++;
        setPasswordStrength(score);
    }
  };

  const handleUpdatePassword = () => {
      if (passwords.new !== passwords.confirm) {
          alert("Passwords do not match!");
          return;
      }
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          setPasswords({ current: '', new: '', confirm: '' });
          alert("Password updated successfully.");
      }, 1500);
  };

  const handleLogoutAll = () => {
      setShowLogoutModal(false);
      alert("Logged out from all other devices.");
      setUser(prev => ({
          ...prev,
          sessions: prev.sessions.filter(s => s.current)
      }));
  };

  // --- RENDER: OVERVIEW TAB ---
  const renderOverview = () => (
    <div className="tab-content fade-in">
      <div className="stats-grid-premium">
        <div className="stat-card hero-stat">
          <div className="stat-icon-glow green"><FaLeaf /></div>
          <div className="stat-info">
            <span className="stat-label">EcoPoints Balance</span>
            <h3 className="stat-value">{user.stats.points}</h3>
            <span className="stat-trend positive"><FaArrowUp/> {user.stats.pointsTrend}</span>
          </div>
          <div className="stat-bg-decoration"></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-glow blue"><FaRecycle /></div>
          <div className="stat-info">
            <span className="stat-label">Total Pickups</span>
            <h3 className="stat-value">{user.stats.pickups}</h3>
            <span className="stat-trend positive"><FaArrowUp/> {user.stats.pickupTrend}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-glow purple"><FaMedal /></div>
          <div className="stat-info">
            <span className="stat-label">Waste Diverted</span>
            <h3 className="stat-value">{user.stats.diverted} <small>kg</small></h3>
            <span className="stat-trend positive"><FaArrowUp/> {user.stats.divertedTrend}</span>
          </div>
        </div>
      </div>

      <div className="section-card level-section">
        <div className="level-header">
           <div className="level-info">
             <h3>Level {user.stats.level} <span className="level-tag">Scholar</span></h3>
             <p className="next-reward">Next Reward: <strong>Silver Badge & 5% Bonus Points</strong></p>
           </div>
           <span className="xp-text">{user.stats.xp} / {user.stats.nextXp} XP</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill animated-bar" style={{ width: `${(user.stats.xp / user.stats.nextXp) * 100}%` }}>
            <div className="glare"></div>
          </div>
        </div>
        <p className="motivation-text">🔥 Only <strong>{user.stats.nextXp - user.stats.xp} XP</strong> needed to level up!</p>
      </div>

      <div className="section-header">
        <h3>Achievements</h3>
        <span className="view-all">View All</span>
      </div>
      <div className="achievements-grid">
        {user.badges.map(b => (
          <div key={b.id} className={`achievement-card ${!b.unlocked ? 'locked' : ''}`}>
            <div className="badge-icon-circle">
              {b.unlocked ? b.icon : <FaLock />}
            </div>
            <div className="badge-details">
              <h4>{b.name}</h4>
              <p>{b.desc}</p>
              {b.unlocked ? <span className="badge-date">Earned: {b.date}</span> : <div className="mini-progress"><span>Progress: {b.progress}</span><div className="mini-bar"><div className="mini-fill" style={{width: '40%'}}></div></div></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- RENDER: ACTIVITY TAB ---
  const renderActivity = () => {
    const activityList = getFilteredActivity();
    return (
      <div className="tab-content fade-in">
        <div className="activity-summary">
          <div className="summary-chip">
            <span className="lbl">This Month</span>
            <span className="val green">+250 XP</span>
          </div>
          <div className="summary-chip">
            <span className="lbl">Pickups</span>
            <span className="val">4 Completed</span>
          </div>
          <div className="summary-chip">
            <span className="lbl">Reports</span>
            <span className="val">1 Filed</span>
          </div>
        </div>

        <div className="activity-filters">
          {['all', 'pickup', 'reward', 'report', 'system'].map(filter => (
            <button key={filter} className={`filter-pill ${activityFilter === filter ? 'active' : ''}`} onClick={() => setActivityFilter(filter)}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="timeline-container">
          {activityList.length > 0 ? (
            activityList.map((item, index) => (
              <div key={item.id} className="timeline-row">
                <div className="timeline-left"><span className="t-time">{item.date}</span></div>
                <div className="timeline-divider">
                  <div className={`t-dot ${item.type}`}>{item.icon}</div>
                  {index !== activityList.length - 1 && <div className="t-line"></div>}
                </div>
                <div className="timeline-right">
                  <div className="activity-card">
                    <div className="ac-header"><h4>{item.title}</h4>{item.xp && <span className="xp-badge">{item.xp}</span>}</div>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><FaCalendarCheck /></div>
              <h3>No activity found</h3>
              <p>You haven't performed any {activityFilter} actions yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- RENDER: SETTINGS TAB ---
  const renderSettings = () => (
    <div className="tab-content fade-in">
      <div className="settings-grid-layout">
        <div className="setting-card">
          <div className="card-header-row"><h3><FaUser className="header-icon"/> Profile Details</h3></div>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <div className="verified-input">
              <input type="text" value={user.email} disabled />
              <span className="v-badge"><FaCheckCircle/> Verified</span>
            </div>
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="text" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
          </div>
        </div>

        <div className="setting-card">
          <div className="card-header-row"><h3><FaTruck className="header-icon"/> Pickup Preferences</h3></div>
          <div className="input-row">
            <div className="input-group half">
              <label>Preferred Time</label>
              <select value={user.settings.pickupTime} onChange={(e) => handleSettingChange('pickupTime', e.target.value)}>
                <option value="Morning">Morning (9-11 AM)</option>
                <option value="Afternoon">Afternoon (12-3 PM)</option>
                <option value="Evening">Evening (4-7 PM)</option>
              </select>
            </div>
            <div className="input-group half">
              <label>Default Waste Type</label>
              <select value={user.settings.wasteType} onChange={(e) => handleSettingChange('wasteType', e.target.value)}>
                <option value="Mixed">Mixed Waste</option>
                <option value="Dry">Dry Only</option>
                <option value="E-Waste">E-Waste</option>
              </select>
            </div>
          </div>
          <div className="toggle-row">
            <div className="toggle-info"><span>Auto-schedule Weekly</span><small>Every Monday.</small></div>
            <label className="switch">
              <input type="checkbox" checked={user.settings.autoSchedule} onChange={(e) => handleSettingChange('autoSchedule', e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="setting-card">
          <div className="card-header-row"><h3><FaBell className="header-icon"/> Notifications</h3></div>
          <div className="toggle-list">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receipts and summaries.' },
              { id: 'sms', label: 'SMS Alerts', desc: 'Urgent driver updates.' },
              { id: 'reminder', label: 'Pickup Reminders', desc: '1 hour before arrival.' },
            ].map(item => (
              <div className="toggle-row" key={item.id}>
                <div className="toggle-info"><span>{item.label}</span><small>{item.desc}</small></div>
                <label className="switch">
                  <input type="checkbox" checked={user.notifications[item.id]} onChange={() => handleToggle(item.id)} />
                  <span className="slider round"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-card">
          <div className="card-header-row"><h3><FaCog className="header-icon"/> App Settings</h3></div>
          <div className="location-preview">
            <div className="loc-icon"><FaMapMarkerAlt/></div>
            <div className="loc-text"><strong>Saved Address</strong><p>{user.address}</p></div>
            <button className="btn-text">Update</button>
          </div>
          <div className="input-row">
            <div className="input-group half">
              <label><FaGlobe style={{marginRight:'5px'}}/> Language</label>
              <select value={user.settings.language} onChange={(e) => handleSettingChange('language', e.target.value)}>
                <option>English</option><option>Hindi</option>
              </select>
            </div>
            <div className="input-group half">
              <label><FaMoon style={{marginRight:'5px'}}/> Theme</label>
              <select value={user.settings.theme} onChange={(e) => handleSettingChange('theme', e.target.value)}>
                <option>Dark</option><option>System</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-footer">
        <button className="btn-save-large" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving Changes...' : <><FaSave/> Save Preferences</>}
        </button>
      </div>
    </div>
  );

  // --- RENDER: SECURITY TAB (UPDATED) ---
  const renderSecurity = () => (
    <div className="tab-content fade-in">
      <div className="settings-grid-layout">
        
        {/* 1. Password Management */}
        <div className="setting-card">
          <div className="card-header-row">
            <h3><FaKey className="header-icon"/> Password Management</h3>
          </div>
          <div className="input-group">
            <label>Current Password</label>
            <input 
              type="password" 
              value={passwords.current} 
              onChange={(e) => handlePasswordChange('current', e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={passwords.new} 
              onChange={(e) => handlePasswordChange('new', e.target.value)} 
              placeholder="Enter new password" 
            />
            {/* Strength Meter */}
            {passwords.new && (
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength >= 1 ? 'weak' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength >= 2 ? 'medium' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength >= 3 ? 'strong' : ''}`}></div>
                <span>{['Weak', 'Medium', 'Strong'][passwordStrength - 1] || 'Weak'}</span>
              </div>
            )}
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={passwords.confirm} 
              onChange={(e) => handlePasswordChange('confirm', e.target.value)} 
              placeholder="Confirm new password" 
            />
          </div>
          <div className="settings-footer">
            <button 
              className="btn-outline" 
              onClick={handleUpdatePassword}
              disabled={!passwords.current || !passwords.new || !passwords.confirm || isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* 2. Login Details & 2FA */}
        <div className="setting-card">
          <div className="card-header-row">
            <h3><FaShieldAlt className="header-icon"/> Account Security</h3>
          </div>
          <div className="security-row">
            <div>
              <strong>Email Status</strong>
              <p>{user.email}</p>
            </div>
            <span className="verified-badge"><FaCheckCircle/> Verified</span>
          </div>
          <div className="security-row">
            <div>
              <strong>Last Password Change</strong>
              <p>{user.lastPasswordChange}</p>
            </div>
          </div>
          
          <hr className="divider"/>
          
          <div className="toggle-row disabled">
            <div className="toggle-info">
              <span>Two-Factor Authentication</span>
              <small>Add an extra layer of security.</small>
            </div>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
        </div>

        {/* 3. Active Sessions */}
        <div className="setting-card full-width">
          <div className="card-header-row">
            <h3><FaLaptop className="header-icon"/> Active Sessions</h3>
          </div>
          <div className="session-list">
            {user.sessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-icon">
                  {session.type === 'mobile' ? <FaMobileAlt/> : <FaLaptop/>}
                </div>
                <div className="session-info">
                  <strong>{session.device} {session.current && <span className="current-badge">This Device</span>}</strong>
                  <p>{session.location} • {session.ip}</p>
                </div>
                {!session.current && (
                  <button className="btn-text danger">Revoke</button>
                )}
              </div>
            ))}
          </div>
          <div className="settings-footer">
            <button className="btn-outline danger" onClick={() => setShowLogoutModal(true)}>
              Logout from all devices
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // --- RENDER: LOGOUT MODAL ---
  const LogoutModal = () => (
    <div className="modal-overlay">
      <div className="modal-card danger-theme">
        <div className="modal-header">
          <h3>Confirm Logout?</h3>
          <button className="btn-close" onClick={() => setShowLogoutModal(false)}><FaTimes/></button>
        </div>
        <div className="modal-body">
          <div className="warning-box">
            <FaExclamationTriangle />
            <p>You will be logged out of all active sessions except this one. Are you sure?</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          <button className="btn-confirm-danger" onClick={handleLogoutAll}>Confirm Logout</button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="loading-screen" style={{color:'white', textAlign:'center', marginTop:'100px'}}>Loading Profile...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-card glow-border">
            <div className="avatar-container">
              <div className="avatar-ring level-5">
                <div className="avatar-img">{user.avatar ? <img src={user.avatar} alt="Profile" /> : user.name.charAt(0)}</div>
              </div>
              <button className="edit-btn"><FaPen /></button>
            </div>
            <h2 className="profile-name">{user.name} <FaCheckCircle className="verified-icon"/></h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-tags"><span className="tag-pill active">Active</span><span className="tag-pill role">{user.roleBadge}</span></div>
            <div className="mini-stats-row">
              <div className="ms-item"><strong>{user.stats.level}</strong><small>Level</small></div>
              <div className="ms-line"></div>
              <div className="ms-item"><strong>{user.stats.pickups}</strong><small>Pickups</small></div>
              <div className="ms-line"></div>
              <div className="ms-item"><strong>{user.stats.points}</strong><small>XP</small></div>
            </div>
            <button className="btn-back-dash" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="profile-content">
          <div className="profile-tabs">
            {['overview', 'activity', 'settings', 'security'].map(tab => (
              <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-render-area">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'security' && renderSecurity()}
          </div>
        </main>

        {/* MODALS */}
        {showLogoutModal && <LogoutModal />}
      </div>
    </div>
  );
};

export default UserProfile;
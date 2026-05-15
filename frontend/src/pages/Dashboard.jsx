import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaExclamationTriangle, FaTruck, FaLeaf, FaServer, 
  FaClipboardList, FaTrophy, FaArrowUp, FaCheckCircle, 
  FaLightbulb, FaPlus, FaCalendarCheck, FaTree, FaClock
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import EmptyState from '../components/common/EmptyState';
import '../assets/css/Dashboard.css'; 
import '../assets/css/Maintenance.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', city: 'Metro City' });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  // --- 1. SIMULATED FRONTEND LOGIC (The "Brain" of the Demo) ---
  // In a real app, this comes from an API. For Viva, we calculate it here.
  
  // Base Data
  const basePickups = 28; 
  const multiplier = timeRange === 'week' ? 1 : 4; // Scale data based on toggle
  
  // Derived Math (So numbers make sense)
  const simulatedData = {
    ecoPoints: (basePickups * 50 * multiplier), // 50 pts per pickup
    co2Saved: ((basePickups * 2.5) * multiplier).toFixed(1), // 2.5kg per pickup
    reportsFiled: timeRange === 'week' ? 1 : 5,
    treesPlanted: Math.floor((basePickups * 2.5 * multiplier) / 20), // 1 Tree per 20kg CO2
    nextPickupDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' }), // Always "Tomorrow"
  };

  // Activity Log Simulation
  const activityLog = [
    { id: 1, type: 'pickup', title: 'Organic Waste Collection', date: 'Yesterday, 8:30 AM', status: 'Completed', points: '+50', icon: <FaCheckCircle /> },
    { id: 2, type: 'report', title: 'Missed Pickup Report', date: 'Oct 24, 2:15 PM', status: 'Resolved', points: null, icon: <FaClipboardList /> },
    { id: 3, type: 'system', title: 'Weekly Impact Summary', date: 'Oct 20, 9:00 AM', status: 'Viewed', points: null, icon: <FaTrophy /> },
  ];

  // Time-Based Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // -----------------------------------------------------------

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(userInfo);
      checkSettings(userInfo.token);
    }
  }, [navigate]);

  const checkSettings = async (token) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
      setSettings({ allowIssueReporting: true, allowPickupScheduling: true, maintenanceMode: false });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path, isAllowed) => {
    if (isAllowed) navigate(path);
  };

  // Maintenance View
  if (!loading && settings?.maintenanceMode) {
    return (
      <div className="maintenance-container">
        <FaServer className="maintenance-icon" />
        <h1 className="maintenance-title">System Under Maintenance</h1>
        <p className="maintenance-desc">We are currently upgrading the CleanZy platform. Please check back shortly.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container animate-fade-in">
        
        {/* 1. WELCOME HEADER (Time-Aware) */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px' }}>
              {getGreeting()}, {user.name.split(' ')[0]}.
            </h1>
            <p className="status-badge" style={{ color: '#a1a1aa', fontSize: '1rem' }}>
              Let's keep <strong>{user.city || 'your city'}</strong> clean today.
            </p>
          </div>
          
          <div className="header-right">
             <div className="time-toggle">
              <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>Week</button>
              <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>Month</button>
            </div>
            
            <div className="action-group" style={{display: 'flex', gap: '10px'}}>
              <button 
                className={`btn-secondary-action ${settings && !settings.allowPickupScheduling ? 'btn-disabled-style' : ''}`} 
                onClick={() => handleNavigate('/schedule-pickup', settings?.allowPickupScheduling)}
                disabled={settings && !settings.allowPickupScheduling}
              >
                <FaTruck /> Schedule Pickup
              </button>
              <button 
                className={`btn-primary-action ${settings && !settings.allowIssueReporting ? 'btn-disabled-style' : ''}`} 
                onClick={() => handleNavigate('/report', settings?.allowIssueReporting)}
                disabled={settings && !settings.allowIssueReporting}
              >
                <FaPlus /> Report Issue
              </button>
            </div>
          </div>
        </header>

        {/* 2. HERO STATUS CARD (Action Oriented) */}
        <div className="summary-strip" style={{
            background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, rgba(0,0,0,0) 100%)', 
            border: '1px solid rgba(34, 197, 94, 0.3)',
            padding: '20px', borderRadius: '12px', marginBottom: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
            <div style={{background: '#22c55e', padding: '10px', borderRadius: '8px', color: 'black'}}>
              <FaTruck size={20} />
            </div>
            <div>
              <h4 style={{color: 'white', margin: 0, fontSize: '1.1rem'}}>Next Collection: {simulatedData.nextPickupDate}, 7:00 AM</h4>
              <p style={{color: '#d4d4d8', margin: '4px 0 0 0', fontSize: '0.9rem'}}>
                Category: <span style={{color: '#4ade80'}}>Organic & Wet Waste</span>. Please segregate bins.
              </p>
            </div>
          </div>
          <div className="status-tag" style={{background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600'}}>
            On Schedule
          </div>
        </div>

        {/* 3. DERIVED METRICS GRID (The Logic Showcase) */}
        <div className="stats-grid">
          {/* Card A: Points */}
          <div className="stat-card achievement-card">
            <div className="stat-top">
              <div className="icon-box gold"><FaTrophy /></div>
              <span className="badge-pill">Top 5% in Ward</span>
            </div>
            <div className="stat-value">{simulatedData.ecoPoints.toLocaleString()}</div>
            <div className="stat-label">Lifetime Eco Credits</div>
            <p className="stat-subtext">
              Earned from consistent pickups
            </p>
          </div>

          {/* Card B: CO2 (Derived from points) */}
          <div className="stat-card">
            <div className="stat-top">
              <div className="icon-box green"><FaLeaf /></div>
              <span className="trend positive"><FaArrowUp/> Impact</span>
            </div>
            <div className="stat-value">{simulatedData.co2Saved} <span style={{fontSize: '1rem', color:'#71717a'}}>kg</span></div>
            <div className="stat-label">CO₂ Emissions Saved</div>
            <p className="stat-subtext">
              Equiv. to planting <strong>{simulatedData.treesPlanted} Trees</strong> <FaTree style={{color: '#22c55e'}}/>
            </p>
          </div>

          {/* Card C: Reports */}
          <div className="stat-card">
            <div className="stat-top">
              <div className="icon-box blue"><FaClipboardList /></div>
              <span className="badge-pill blue">Trust Score: 100%</span>
            </div>
            <div className="stat-value">{simulatedData.reportsFiled}</div>
            <div className="stat-label">Issues Resolved</div>
            <p className="stat-subtext">Thank you for reporting</p>
          </div>
        </div>

        {/* 4. CONTENT SPLIT */}
        <div className="content-split">
          
          {/* LEFT: ACTIVITY & TIMELINE */}
          <div className="activity-section">
             {/* Smart CTA */}
             <div className="next-action-card">
              <div className="action-text">
                <h3><FaLightbulb style={{color: '#eab308'}}/> Suggestion</h3>
                <p>You have accumulated <strong>{simulatedData.ecoPoints} points</strong>. You are eligible for a priority pickup!</p>
              </div>
              <button 
                className={`btn-action-sm ${settings && !settings.allowPickupScheduling ? 'btn-disabled-style' : ''}`} 
                onClick={() => handleNavigate('/schedule-pickup', settings?.allowPickupScheduling)}
              >
                Schedule Special Pickup
              </button>
            </div>

            <div className="section-tabs">
              <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
                Recent Activity
              </button>
              <button className={`tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                Upcoming Pickups
              </button>
            </div>

            {activeTab === 'activity' ? (
              <div className="timeline-list">
                {activityLog.map((log) => (
                  <div key={log.id} className="timeline-item">
                    <div className={`timeline-icon ${log.type === 'pickup' ? 'green' : log.type === 'report' ? 'blue' : 'gold'}`}>
                      {log.icon}
                    </div>
                    <div className="timeline-content">
                      <h4>{log.title}</h4>
                      <p>{log.status}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <span className="timeline-time" style={{display:'block'}}>{log.date}</span>
                      {log.points && <span className="timeline-points">{log.points}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State for Schedule Tab
              <EmptyState 
                icon={<FaCalendarCheck />}
                title="No Upcoming Special Pickups"
                description="Your regular daily collection is active. Need a bulk pickup?"
                actionLabel="Schedule Now"
                onAction={() => handleNavigate('/schedule-pickup', settings?.allowPickupScheduling)}
                theme="blue"
              />
            )}
          </div>

          {/* RIGHT: SIDEBAR GAMIFICATION */}
          <div className="sidebar-section">
            <div className="sidebar-widget impact-widget">
              <div className="widget-header">
                <h3>Citizen Level</h3>
                <span className="level-text" style={{color: '#eab308'}}>Waste Warrior</span>
              </div>
              <div className="impact-box">
                <div className="progress-info">
                  <span>Level Progress</span>
                  <span className="green-text">1,400 / 2,000 XP</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '70%'}}></div>
                </div>
                <p className="impact-tip" style={{marginTop: '15px', fontSize: '0.85rem', color: '#a1a1aa'}}>
                  <FaClock style={{marginRight:'5px'}}/> Reach 2,000 XP to unlock the "Neighborhood Guardian" badge.
                </p>
              </div>
            </div>

            <div className="sidebar-widget">
              <h3>Community Status</h3>
              <div className="pickup-card" style={{opacity: 0.8}}>
                <div className="pickup-info">
                  <h4 style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e'}}></div>
                    Sector 14
                  </h4>
                  <p>Collection Status: <strong>Active</strong></p>
                  <p>Trucks Deployed: <strong>3</strong></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
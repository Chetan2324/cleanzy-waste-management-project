import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaUsers, FaTruck, FaExclamationTriangle, FaRecycle, FaSpinner, FaServer, FaDatabase, FaCheckCircle 
} from 'react-icons/fa';

// Styles
import '../../assets/css/AdminDashboard.css';

// Components
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import StatCard from '../../components/admin/StatCard';
import DashboardCharts from '../../components/admin/DashboardCharts';
import RecentActivityTable from '../../components/admin/RecentActivityTable';
import EmptyState from '../../components/common/EmptyState'; // ✅ New Import

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock Data for Charts
  const pickupData = [
    { name: 'Mon', waste: 45 },
    { name: 'Tue', waste: 55 },
    { name: 'Wed', waste: 40 },
    { name: 'Thu', waste: 70 },
    { name: 'Fri', waste: 90 },
    { name: 'Sat', waste: 85 },
    { name: 'Sun', waste: 60 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setStats(data.data);
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="admin-container flex-center">
        <div style={{ textAlign: 'center' }}>
          <FaSpinner className="text-green" style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Initializing Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="admin-container flex-center">Error Loading Data</div>;

  const pieData = [
    { name: 'Resolved', value: stats.issues.resolved, color: '#22c55e' },
    { name: 'Pending', value: stats.issues.pending, color: '#eab308' },
  ];

  const adminName = JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin';

  return (
    <div className="admin-container">
      {/* 1. FIXED SIDEBAR */}
      <Sidebar handleLogout={handleLogout} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* FIXED HEADER */}
        <Navbar adminName={adminName} />

        {/* SCROLLABLE CONTENT */}
        <div className="content-wrapper animate-fade-in">
          
          {/* STATS GRID */}
          <div className="dashboard-grid">
            <StatCard 
              title="Total Users" 
              value={stats.users.total} 
              icon={<FaUsers />} 
              color="blue" 
              trend="+12%" 
            />
            <StatCard 
              title="Pickups Done" 
              value={stats.pickups.completed} 
              icon={<FaTruck />} 
              color="green" 
              trend="+8%" 
            />
            <StatCard 
              title="Open Issues" 
              value={stats.issues.pending} 
              icon={<FaExclamationTriangle />} 
              color="yellow" 
              trend="-2%" 
            />
            <StatCard 
              title="Waste (kg)" 
              value={stats.pickups.totalWasteCollected} 
              icon={<FaRecycle />} 
              color="purple" 
              trend="+5%" 
            />
          </div>

          {/* ANALYTICS SECTION */}
          <DashboardCharts pickupData={pickupData} pieData={pieData} />

          {/* BOTTOM GRID */}
          <div className="bottom-grid">
            
            {/* RECENT ACTIVITY with EMPTY STATE */}
            {stats.recentActivity.pickups.length > 0 ? (
              <RecentActivityTable pickups={stats.recentActivity.pickups} />
            ) : (
              // ✅ Scenario B: Admin Dashboard (No Activity)
              <EmptyState 
                icon={<FaCheckCircle />}
                title="All Caught Up!"
                description="There are no pending requests or issues reported by residents at this time. Great job keeping the community clean."
                theme="green" 
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--primary-glow), transparent)', borderColor: 'var(--primary)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>💡 Admin Pro Tip</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                  Review pending issues before 10 AM to improve community satisfaction scores by 40%.
                </p>
              </div>

              <div className="glass-card">
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>System Health</h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                    <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><FaServer /> Server Uptime</span>
                    <span className="text-green">99.9%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px' }}>
                    <div style={{ width: '99%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                    <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><FaDatabase /> Database Load</span>
                    <span className="text-info" style={{ color: 'var(--info)' }}>12%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px' }}>
                    <div style={{ width: '12%', height: '100%', background: 'var(--info)', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
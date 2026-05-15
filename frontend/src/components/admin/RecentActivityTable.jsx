import React from 'react';
import { FaEye } from 'react-icons/fa';
import '../../assets/css/AdminDashboard.css';

const RecentActivityTable = ({ pickups }) => {
  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontWeight: 'bold' }}>Recent Pickups</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}>View All</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '500' }}>{p.user?.name || 'Unknown'}</td>
                <td>{p.wasteType}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${p.status.toLowerCase().replace(' ', '-')}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
            {pickups.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaExclamationTriangle, 
  FaSpinner, 
  FaInbox,
  FaTools,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

// Styles & Components
import '../../assets/css/AdminDashboard.css'; 
import '../../assets/css/AdminIssues.css';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

const AdminIssues = () => {
  // --- STATE ---
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Stores ID of issue being processed

  // Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [rejectRemark, setRejectRemark] = useState('');

  const adminName = JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin';

  // --- FETCH DATA ---
  const fetchIssues = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/issues/all', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setIssues(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  // --- ACTION HANDLERS ---

  // 1. Open Reject Modal
  const openRejectModal = (id) => {
    setSelectedIssueId(id);
    setRejectRemark('');
    setShowRejectModal(true);
  };

  // 2. Submit Status Update (Used for In Progress, Resolve, and Reject)
  const handleStatusUpdate = async (id, newStatus, remark = '') => {
    setActionLoading(id); // Disable buttons for this row
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const payload = {
        status: newStatus,
        adminRemark: remark
      };

      const { data } = await axios.patch(
        `https://cleanzy-waste-management-backend.onrender.com/api/issues/${id}/status`, 
        payload, 
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      // Update UI instantly
      setIssues(prevIssues => 
        prevIssues.map(issue => issue._id === id ? data.issue : issue)
      );

      toast.success(`Issue marked as ${newStatus.replace('_', ' ')}`);
      
      if (newStatus === 'REJECTED') {
        setShowRejectModal(false);
      }

    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="main-content">
        <Navbar adminName={adminName} />

        <div className="content-wrapper animate-fade-in">
          
          {/* HEADER */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Issue Reporting</h1>
              <p className="page-subtitle">Monitor and resolve citizen complaints.</p>
            </div>
            
            <div className="stats-badge">
              <FaExclamationTriangle style={{ color: '#fbbf24' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{issues.length}</span>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Total Reports</span>
            </div>
          </div>

          {/* TABLE */}
          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Resident Details</th>
                  <th>Issue Info</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                      <FaSpinner className="spin" style={{ fontSize: '2rem', color: '#22c55e' }} />
                    </td>
                  </tr>
                ) : issues.length > 0 ? (
                  issues.map((issue) => (
                    <tr key={issue._id}>
                      {/* Resident */}
                      <td>
                        <div className="user-cell">
                          <span className="user-name">{issue.user?.name || 'Unknown'}</span>
                          <span className="user-email">{issue.user?.email}</span>
                        </div>
                      </td>

                      {/* Info */}
                      <td>
                        <span className="issue-title">{issue.title}</span>
                        {issue.adminRemark && (
                          <span style={{fontSize:'0.75rem', color: '#a1a1aa', fontStyle:'italic'}}>
                            Note: {issue.adminRemark}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td><span className="category-tag">{issue.category}</span></td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge status-${issue.status.toLowerCase()}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="actions-cell">
                        {/* PENDING ACTIONS */}
                        {issue.status === 'PENDING' && (
                          <>
                            <button 
                              className={`btn-action btn-progress ${actionLoading === issue._id ? 'btn-disabled' : ''}`}
                              onClick={() => handleStatusUpdate(issue._id, 'IN_PROGRESS')}
                            >
                              <FaTools /> Start
                            </button>
                            <button 
                              className={`btn-action btn-reject ${actionLoading === issue._id ? 'btn-disabled' : ''}`}
                              onClick={() => openRejectModal(issue._id)}
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        )}

                        {/* IN_PROGRESS ACTIONS */}
                        {issue.status === 'IN_PROGRESS' && (
                          <>
                            <button 
                              className={`btn-action btn-resolve ${actionLoading === issue._id ? 'btn-disabled' : ''}`}
                              onClick={() => handleStatusUpdate(issue._id, 'RESOLVED')}
                            >
                              <FaCheck /> Resolve
                            </button>
                            <button 
                              className={`btn-action btn-reject ${actionLoading === issue._id ? 'btn-disabled' : ''}`}
                              onClick={() => openRejectModal(issue._id)}
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        )}

                        {/* COMPLETED/REJECTED */}
                        {(issue.status === 'RESOLVED' || issue.status === 'REJECTED') && (
                          <span style={{color:'#71717a', fontSize:'0.8rem', fontStyle:'italic'}}>
                            No actions available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                      <FaInbox style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} /><br/>
                      No issues reported yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Issue</h3>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}><FaTimes /></button>
            </div>
            
            <p style={{color:'#a1a1aa', marginBottom:'10px'}}>Please provide a reason for rejecting this issue.</p>
            
            <textarea 
              className="modal-textarea"
              placeholder="e.g. Invalid location, duplicate report, etc."
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
            />

            <div className="modal-actions">
              <button 
                className="btn-action" 
                style={{background:'transparent', color:'#a1a1aa', border:'1px solid #3f3f46'}}
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-action btn-reject"
                onClick={() => handleStatusUpdate(selectedIssueId, 'REJECTED', rejectRemark)}
                disabled={!rejectRemark.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminIssues;
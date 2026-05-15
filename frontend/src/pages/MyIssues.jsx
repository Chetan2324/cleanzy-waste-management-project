import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/MyIssues.css'; // Import the CSS created above

import { 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTools, 
  FaSpinner, 
  FaClipboardList,
  FaCommentDots
} from 'react-icons/fa';

const MyIssues = () => {
  // --- STATE ---
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchMyIssues = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo?.token) {
        toast.error('Please login to view issues.');
        return;
      }

      const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/issues/my', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      setIssues(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load your issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  // --- HELPER: Status Badge Logic ---
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { icon: <FaClock />, label: 'Pending', class: 'status-pending' };
      case 'IN_PROGRESS':
        return { icon: <FaTools />, label: 'In Progress', class: 'status-in_progress' };
      case 'RESOLVED':
        return { icon: <FaCheckCircle />, label: 'Resolved', class: 'status-resolved' };
      case 'REJECTED':
        return { icon: <FaTimesCircle />, label: 'Rejected', class: 'status-rejected' };
      default:
        return { icon: <FaClock />, label: status, class: 'status-pending' };
    }
  };

  return (
    <div className="my-issues-page">
      <Navbar />

      <div className="issues-container animate-fade-in">
        
        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1>My Reported Issues</h1>
            <p>Track the status of your complaints and view admin feedback.</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '1.5rem'}}>
              {issues.length}
            </span>
            <span style={{display:'block', fontSize:'0.8rem', color:'#71717a'}}>Total Reports</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spin" />
            <p>Loading your reports...</p>
          </div>
        ) : issues.length === 0 ? (
          /* EMPTY STATE */
          <div className="empty-container">
            <FaClipboardList className="empty-icon" />
            <h2>No issues reported yet</h2>
            <p>Help keep the community clean by reporting overflowing bins or other concerns.</p>
            <Link to="/report-issue" className="btn-report">Report an Issue</Link>
          </div>
        ) : (
          /* ISSUES GRID */
          <div className="issues-grid">
            {issues.map((issue) => {
              const statusConfig = getStatusConfig(issue.status);

              return (
                <div key={issue._id} className="issue-card">
                  
                  {/* Card Header: Category & Date */}
                  <div className="card-header">
                    <span className="issue-category">{issue.category}</span>
                    <span className="issue-date">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="issue-title">{issue.title}</h3>
                  <p className="issue-desc">{issue.description}</p>

                  {/* Admin Remark (Conditional) */}
                  {issue.adminRemark && (
                    <div className="admin-remark-box">
                      <span className="remark-label">
                        <FaCommentDots style={{marginRight:'5px'}}/> Admin Note
                      </span>
                      <p className="remark-text">"{issue.adminRemark}"</p>
                    </div>
                  )}

                  {/* Footer: Status Badge */}
                  <div className="card-footer">
                    <span className={`status-badge ${statusConfig.class}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
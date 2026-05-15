import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaBoxOpen, FaSpinner, 
  FaTimes, FaFilter, FaInfoCircle, FaHistory, FaMapMarkerAlt
} from 'react-icons/fa';

// Styles & Components
import '../../assets/css/AdminDashboard.css';
import '../../assets/css/AdminPickups.css';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

const AdminPickups = () => {
  // --- STATE ---
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Controls
  const [modalType, setModalType] = useState(null); // 'approve' | 'complete' | 'cancel' | 'view'
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [formData, setFormData] = useState({
    driverName: '',
    driverContact: '',
    vehicleNumber: '',
    wasteCollected: '',
    adminRemark: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Admin Data
  const adminName = JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin';

  // --- 1. FETCH DATA ---
  const fetchPickups = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/admin/pickups', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setPickups(data);
      setFilteredPickups(data); // Initialize filter
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load pickups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  // --- 2. FILTERING LOGIC ---
  useEffect(() => {
    let result = pickups;

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter(p => p.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by Search (Name or Email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.userName && p.userName.toLowerCase().includes(query)) || 
        (p.email && p.email.toLowerCase().includes(query))
      );
    }

    setFilteredPickups(result);
  }, [pickups, statusFilter, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  // --- 3. MODAL LOGIC ---
  const openModal = (type, pickup) => {
    setModalType(type);
    setSelectedPickup(pickup);
    setFormData({ driverName: '', driverContact: '', vehicleNumber: '', wasteCollected: '', adminRemark: '' });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPickup(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 4. SUBMIT UPDATE ---
  const handleSubmitAction = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let payload = {};
      let newStatus = '';

      if (modalType === 'approve') {
        newStatus = 'approved';
        payload = { 
          status: newStatus, 
          driverDetails: { 
            name: formData.driverName, 
            contact: formData.driverContact, 
            vehicleNumber: formData.vehicleNumber 
          } 
        };
      } else if (modalType === 'complete') {
        newStatus = 'completed';
        payload = { 
          status: newStatus, 
          wasteCollected: Number(formData.wasteCollected) 
        };
      } else if (modalType === 'cancel') {
        newStatus = 'cancelled';
        payload = { 
          status: newStatus, 
          adminRemark: formData.adminRemark 
        };
      }

      await axios.patch(
        `https://cleanzy-waste-management-backend.onrender.com/api/admin/pickups/${selectedPickup._id}/status`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      toast.success(`Pickup ${newStatus} successfully!`);
      
      // Refresh Data to get updated Timeline from backend
      fetchPickups(); 
      closeModal();

    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="main-content">
        <Navbar adminName={adminName} />

        <div className="content-wrapper animate-fade-in">
          
          {/* HEADER & FILTERS */}
          <div className="page-header" style={{ alignItems: 'flex-end' }}>
            <div>
              <h1 className="page-title">Pickup Requests</h1>
              <p className="page-subtitle">Track lifecycle: Pending → Approved → Completed</p>
            </div>

            {/* TOOLBAR */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              
              {/* Search */}
              <input 
                type="text" 
                placeholder="Search Resident..." 
                className="modal-input" 
                style={{ width: '220px', padding: '10px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Status Filter */}
              <div style={{ position: 'relative' }}>
                <select 
                  className="modal-input" 
                  style={{ width: '160px', padding: '10px', appearance: 'none', cursor: 'pointer' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <FaFilter style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa', pointerEvents: 'none' }} />
              </div>

              {/* Total Count */}
              <div className="stats-badge">
                <FaBoxOpen className="text-green" />
                <span style={{ fontWeight: 'bold', color: 'white' }}>{filteredPickups.length}</span>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="pickups-table-container">
            <table className="pickups-table">
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Waste Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                      <FaSpinner className="text-green animate-spin" style={{ fontSize: '2rem' }} />
                    </td>
                  </tr>
                ) : filteredPickups.length > 0 ? (
                  filteredPickups.map((pickup) => {
                    const statusLower = pickup.status ? pickup.status.toLowerCase() : 'pending';
                    
                    return (
                      <tr key={pickup._id}>
                        {/* 1. Resident */}
                        <td>
                          <div className="user-cell">
                            <span className="user-name">{pickup.userName || 'Unknown'}</span>
                            <span className="user-email">{pickup.email}</span>
                          </div>
                        </td>
                        
                        {/* 2. Type */}
                        <td><span style={{ color: 'white', fontWeight: '500' }}>{pickup.wasteType}</span></td>

                        {/* 3. Date */}
                        <td>
                          <span className="date-cell">
                            {new Date(pickup.scheduledDate).toLocaleDateString()}
                          </span>
                        </td>

                        {/* 4. Status */}
                        <td>
                          <span className={`status-badge status-${statusLower}`}>
                            {statusLower}
                          </span>
                        </td>

                        {/* 5. Actions */}
                        <td>
                          <div className="actions-group">
                            {/* View Details */}
                            <button 
                              className="btn-action" 
                              style={{ background: '#3f3f46', color: 'white', border: '1px solid #52525b' }}
                              onClick={() => openModal('view', pickup)}
                            >
                              <FaInfoCircle /> View
                            </button>
                            
                            {/* Approve (Only Pending) */}
                            {statusLower === 'pending' && (
                              <button 
                                className="btn-action btn-approve"
                                onClick={() => openModal('approve', pickup)}
                              >
                                <FaCheckCircle /> Approve
                              </button>
                            )}

                            {/* Complete (Only Approved) */}
                            {statusLower === 'approved' && (
                              <button 
                                className="btn-action btn-complete"
                                onClick={() => openModal('complete', pickup)}
                              >
                                <FaTruck /> Complete
                              </button>
                            )}

                            {/* Cancel (Not Completed/Cancelled) */}
                            {!['completed', 'cancelled'].includes(statusLower) && (
                              <button 
                                className="btn-action btn-cancel"
                                onClick={() => openModal('cancel', pickup)}
                              >
                                <FaTimesCircle /> Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                      No pickups found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* --- SHARED MODAL SYSTEM --- */}
      {modalType && selectedPickup && (
        <div className="sidebar-overlay visible">
          <div className="glass-card-modal">
            
            {/* Header */}
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textTransform: 'capitalize' }}>
                {modalType === 'view' ? 'Pickup Details' : `${modalType} Pickup`}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FaTimes />
              </button>
            </div>

            {/* --- VIEW ONLY MODE --- */}
            {modalType === 'view' ? (
              <div style={{ color: '#d4d4d8' }}>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <p style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.9rem', color:'#a1a1aa' }}><FaMapMarkerAlt /> Address</p>
                  <p style={{ color: 'white', marginTop: '4px' }}>{selectedPickup.address}</p>
                  {selectedPickup.instructions && (
                    <p style={{ marginTop: '8px', fontSize: '0.9rem', fontStyle: 'italic' }}>Note: "{selectedPickup.instructions}"</p>
                  )}
                </div>

                {selectedPickup.driverDetails?.name && (
                   <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.05)', border:'1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}>
                      <p style={{ fontSize:'0.9rem', color:'#4ade80', fontWeight:'bold' }}>Driver Assigned</p>
                      <p>{selectedPickup.driverDetails.name} ({selectedPickup.driverDetails.vehicleNumber})</p>
                      <p style={{ fontSize:'0.85rem' }}>{selectedPickup.driverDetails.contact}</p>
                   </div>
                )}

                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '10px', display:'flex', alignItems:'center', gap:'6px' }}>
                    <FaHistory /> Timeline History
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedPickup.timeline?.map((event, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ textTransform: 'capitalize', color: event.status==='completed'?'#4ade80':'white' }}>
                          {event.status}
                        </span>
                        <span style={{ color: '#71717a' }}>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* --- ACTION FORM MODE --- */
              <form onSubmit={handleSubmitAction}>
                <div className="modal-info-text">
                  <FaInfoCircle />
                  <span>Updating status for <strong>{selectedPickup.userName}</strong></span>
                </div>

                {modalType === 'approve' && (
                  <>
                    <div className="modal-form-group">
                      <label className="modal-label">Driver Name</label>
                      <input name="driverName" className="modal-input" required onChange={handleInputChange} placeholder="e.g. Ramesh Kumar" />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-label">Driver Contact</label>
                      <input name="driverContact" className="modal-input" required onChange={handleInputChange} placeholder="+91 9876543210" />
                    </div>
                    <div className="modal-form-group">
                      <label className="modal-label">Vehicle Number</label>
                      <input name="vehicleNumber" className="modal-input" required onChange={handleInputChange} placeholder="MH 12 AB 1234" />
                    </div>
                  </>
                )}

                {modalType === 'complete' && (
                  <div className="modal-form-group">
                    <label className="modal-label">Total Waste Collected (kg)</label>
                    <input type="number" name="wasteCollected" className="modal-input" required min="0.1" step="0.1" onChange={handleInputChange} placeholder="e.g. 12.5" />
                  </div>
                )}

                {modalType === 'cancel' && (
                  <div className="modal-form-group">
                    <label className="modal-label">Reason for Cancellation</label>
                    <textarea name="adminRemark" className="modal-input modal-textarea" required onChange={handleInputChange} placeholder="e.g. Invalid address / Resident not available"></textarea>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                  <button type="button" onClick={closeModal} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #3f3f46', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    style={{ 
                      padding: '10px 20px', 
                      background: modalType === 'cancel' ? '#ef4444' : '#22c55e', 
                      border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                    }}
                  >
                    {submitting ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPickups;
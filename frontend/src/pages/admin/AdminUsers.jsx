import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaSearch, FaFilter, FaEye, FaBan, FaTrash, 
  FaUser, FaUsersSlash, FaSpinner, FaTimes, FaUnlock
} from 'react-icons/fa';

// Styles
import '../../assets/css/AdminDashboard.css';
import '../../assets/css/AdminUsers.css';

// Components
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import EmptyState from '../../components/common/EmptyState'; // ✅ New Import

const AdminUsers = () => {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modals
  const [selectedUser, setSelectedUser] = useState(null); // For View
  const [userToDelete, setUserToDelete] = useState(null); // For Delete Confirm

  // Admin Info
  const adminName = JSON.parse(localStorage.getItem('userInfo'))?.name || 'Admin';

  // --- API CONFIG ---
  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  };

  // --- 1. FETCH RESIDENTS ---
  const fetchResidents = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/admin/residents', 
        getAuthHeader()
      );
      setUsers(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  // --- 2. ACTIONS ---

  // Toggle Block Status
  const handleBlockToggle = async (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if(!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/admin/users/${user._id}/block`,
        {},
        getAuthHeader()
      );
      
      // Update local state optimistically
      setUsers(prev => prev.map(u => 
        u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
      ));
      
      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  // Delete User
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userToDelete._id}`, 
        getAuthHeader()
      );
      
      setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
      toast.success("User deleted successfully.");
      setUserToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  // --- 3. FILTERING LOGIC ---
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && !user.isBlocked;
    if (filterStatus === 'blocked') return matchesSearch && user.isBlocked;
    return matchesSearch;
  });

  return (
    <div className="admin-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="main-content animate-fade-in">
        <Navbar adminName={adminName} />

        <div className="content-wrapper">
          
          {/* HEADER */}
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Residents</h1>
              <p className="text-muted">Manage registered citizens and their account status.</p>
            </div>
            <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FaUser className="text-green" />
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{users.length}</span>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Total Users</span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="users-controls">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search residents..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <FaFilter style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            
            {/* CHECK IF TABLE IS EMPTY */}
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <FaSpinner className="text-green animate-spin" style={{ fontSize: '2rem' }} />
              </div>
            ) : filteredUsers.length > 0 ? (
              // IF DATA EXISTS, SHOW TABLE
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Resident</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar">{user.name.charAt(0)}</div>
                            <div className="user-details">
                              <span className="user-name">{user.name}</span>
                              <span className="user-email">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{user.role}</td>
                        <td>
                          <span className={`status-badge ${!user.isBlocked ? 'status-completed' : 'status-cancelled'}`}>
                            {!user.isBlocked ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="action-btn btn-view" title="View Details" onClick={() => setSelectedUser(user)}>
                              <FaEye />
                            </button>
                            <button className="action-btn btn-block" title={user.isBlocked ? "Unblock" : "Block"} onClick={() => handleBlockToggle(user)}>
                              {user.isBlocked ? <FaUnlock /> : <FaBan />}
                            </button>
                            <button className="action-btn btn-delete" title="Delete User" onClick={() => setUserToDelete(user)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // ✅ Scenario C: Admin Users List (Empty State)
              <EmptyState 
                icon={<FaUsersSlash />}
                title="No Residents Found"
                description={
                  searchTerm 
                  ? "No users match your search criteria. Try a different keyword."
                  : "It seems no residents have registered yet. Share the registration link to get started."
                }
                actionLabel={!searchTerm ? "Copy Invite Link" : "Clear Search"}
                onAction={
                  !searchTerm 
                  ? () => { navigator.clipboard.writeText('http://localhost:3000/register'); toast.success('Copied!'); }
                  : () => setSearchTerm('')
                }
                theme="neutral"
              />
            )}

            {/* Footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {filteredUsers.length} residents
            </div>
          </div>

        </div>
      </main>

      {/* --- VIEW USER MODAL --- */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Resident Details</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: 'white' }}>{selectedUser.name}</h4>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedUser.role}</span>
                </div>
              </div>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              <p><strong>User ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedUser._id}</span></p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {userToDelete && (
        <div className="modal-overlay" onClick={() => setUserToDelete(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title text-red">Delete Resident?</h3>
              <button className="close-btn" onClick={() => setUserToDelete(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to permanently delete <strong>{userToDelete.name}</strong>?</p>
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setUserToDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaLeaf, FaBars, FaTimes, FaSignOutAlt, 
  FaTachometerAlt, FaExclamationTriangle, FaTruck, FaCog, FaUser,
  FaClipboardList, FaUserShield 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user from local storage on mount and route change
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
    setShowDropdown(false);     // Close dropdown on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  // --- NAVIGATION LINKS CONFIG ---
  
  // 1. Public Links (Not Logged In)
  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' }
  ];

  // 2. Resident Links (Logged In as Citizen)
  const residentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Report Issue', path: '/report', icon: <FaExclamationTriangle /> },
    { name: 'My Issues', path: '/my-issues', icon: <FaClipboardList /> }, // ✅ Added My Issues
    { name: 'Schedule Pickup', path: '/schedule-pickup', icon: <FaTruck /> }
  ];

  // 3. Admin Links (Logged In as Admin)
  const adminLinks = [
    { name: 'Admin Panel', path: '/admin/dashboard', icon: <FaUserShield /> },
    { name: 'Issue Management', path: '/admin/issues', icon: <FaExclamationTriangle /> },
    { name: 'Pickup Management', path: '/admin/pickups', icon: <FaTruck /> }
  ];

  // Determine which links to show
  let linksToShow = publicLinks;
  if (user) {
    if (user.role === 'admin') {
      linksToShow = adminLinks;
    } else {
      linksToShow = residentLinks;
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* BRAND LOGO */}
        <Link to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/dashboard") : "/"} className="navbar-logo">
          <FaLeaf className="logo-icon" /> 
          <span>CleanZy</span>
        </Link>

        {/* MOBILE TOGGLE ICON */}
        <div className="mobile-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* CENTER NAVIGATION LINKS */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {linksToShow.map((link, index) => (
            <li key={index} className="nav-item">
              <Link 
                to={link.path} 
                className={`nav-links ${location.pathname === link.path ? 'active-link' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon && <span className="link-icon">{link.icon}</span>}
                {link.name}
              </Link>
            </li>
          ))}

          {/* MOBILE-ONLY AUTH BUTTONS (Visible inside hamburger menu) */}
          <div className="mobile-auth-buttons">
            {user ? (
              <>
                <Link to="/profile" className="mobile-btn">Profile</Link>
                <Link to="/settings" className="mobile-btn">Settings</Link>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-btn">Login</Link>
                <Link to="/register" className="mobile-btn primary">Sign Up</Link>
              </>
            )}
          </div>
        </ul>

        {/* RIGHT SIDE (DESKTOP ONLY) */}
        <div className="nav-auth-desktop">
          {user ? (
            <div className="user-dropdown-container">
              <div className="user-profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </div>

              {/* DROPDOWN MENU */}
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser /> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <FaCog /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="nav-btn login-btn">Login</Link>
              <Link to="/register" className="nav-btn register-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
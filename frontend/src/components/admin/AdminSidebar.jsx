import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaLeaf, FaTachometerAlt, FaUsers, FaTruck, 
  FaExclamationCircle, FaCog, FaSignOutAlt 
} from 'react-icons/fa';
import '../../assets/css/AdminDashboard.css';

const sidebarStyles = {
  container: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    zIndex: 50,
    overflowY: 'auto'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-main)',
    marginBottom: '3rem',
    paddingLeft: '0.5rem'
  },
  logoIcon: {
    color: 'var(--primary)',
    fontSize: '1.8rem'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  activeLink: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--primary)',
    borderLeft: '4px solid var(--primary)',
  },
  logout: {
    marginTop: 'auto',
    color: 'var(--danger)',
    background: 'rgba(239, 68, 68, 0.08)',
    justifyContent: 'center',
    fontWeight: '600'
  }
};

const Sidebar = ({ handleLogout }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Residents', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Pickups', path: '/admin/pickups', icon: <FaTruck /> },
    { name: 'Issues', path: '/admin/issues', icon: <FaExclamationCircle /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <aside style={sidebarStyles.container}>
      <div style={sidebarStyles.logo}>
        <FaLeaf style={sidebarStyles.logoIcon} />
        <span>CleanZy</span>
      </div>

      <nav style={sidebarStyles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...sidebarStyles.link,
              ...(isActive ? sidebarStyles.activeLink : {}),
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        style={{ ...sidebarStyles.link, ...sidebarStyles.logout, border: 'none', cursor: 'pointer' }}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
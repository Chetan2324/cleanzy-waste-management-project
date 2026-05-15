import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import '../../assets/css/AdminDashboard.css';

const styles = {
  header: {
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem', // Matches content padding
    background: 'transparent',
    borderBottom: '1px solid var(--border-light)',
  },
  pageTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  searchBox: {
    position: 'relative',
    width: '280px',
  },
  input: {
    width: '100%',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-light)',
    padding: '10px 15px 10px 40px',
    borderRadius: '20px',
    color: 'white',
    outline: 'none',
    fontSize: '0.9rem'
  },
  iconSearch: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-1px',
    width: '9px',
    height: '9px',
    background: 'var(--danger)',
    borderRadius: '50%',
    border: '2px solid var(--bg-dark)'
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '24px',
    borderLeft: '1px solid var(--border-light)'
  },
  profileInfo: {
    textAlign: 'right'
  },
  adminName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    lineHeight: '1.2'
  },
  adminRole: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '500'
  }
};

const Navbar = ({ adminName }) => {
  return (
    <header style={styles.header}>
      <h2 style={styles.pageTitle}>Overview</h2>
      
      <div style={styles.rightSection}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.iconSearch} />
          <input type="text" placeholder="Search..." style={styles.input} />
        </div>

        <button style={styles.iconBtn}>
          <FaBell />
          <span style={styles.badge}></span>
        </button>
        
        <div style={styles.profile}>
          <div style={styles.profileInfo}>
            <div style={styles.adminName}>{adminName}</div>
            <div style={styles.adminRole}>Administrator</div>
          </div>
          <FaUserCircle style={{ fontSize: '2.5rem', color: 'var(--bg-panel)', background: 'var(--text-muted)', borderRadius: '50%' }} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
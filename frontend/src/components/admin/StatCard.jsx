import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import '../../assets/css/AdminDashboard.css';

const styles = {
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  iconBox: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  value: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
  },
  title: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trend: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '600',
  }
};

const StatCard = ({ title, value, icon, color, trend }) => {
  // Map color names to CSS variables/hex
  const colorMap = {
    green: 'var(--primary)',
    blue: 'var(--info)',
    purple: 'var(--purple)',
    yellow: 'var(--warning)',
    red: 'var(--danger)',
  };

  const themeColor = colorMap[color] || 'white';
  const isPositive = trend.includes('+');

  return (
    <div className="glass-card" style={styles.card}>
      <div style={{ ...styles.iconBox, background: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}40` }}>
        {icon}
      </div>
      
      <div style={styles.value}>{value}</div>
      <div style={styles.title}>{title}</div>

      <div style={{ 
        ...styles.trend, 
        color: isPositive ? 'var(--primary)' : 'var(--danger)',
        background: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
      }}>
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        {trend}
      </div>
    </div>
  );
};

export default StatCard;
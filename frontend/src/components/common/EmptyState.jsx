import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.css'; 

const EmptyState = ({ icon, title, description, actionLabel, onAction, theme = 'neutral' }) => {
  return (
    <div className={`empty-state-container theme-${theme}`}>
      <div className="empty-icon-wrapper">
        {icon}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      
      {actionLabel && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  theme: PropTypes.oneOf(['neutral', 'green', 'blue', 'orange'])
};

export default EmptyState;
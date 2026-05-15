import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-banner"></div>
      <div className="skeleton-grid">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
      <div className="skeleton-table"></div>
    </div>
  );
};

export default SkeletonLoader;
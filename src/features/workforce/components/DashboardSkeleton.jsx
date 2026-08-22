import React from 'react';
import '../styles/hr-dashboard.css';

export const DashboardSkeleton = () => {
  return (
    <div className="hr-dashboard-container">
      <div className="hr-dashboard-header">
        <div className="skeleton skeleton-title" style={{ width: '250px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '350px' }}></div>
      </div>

      <div className="hr-metrics-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="hr-card" style={{ height: '120px' }}>
            <div className="metric-card-header">
              <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
              <div className="skeleton skeleton-circle" style={{ width: '40px', height: '40px' }}></div>
            </div>
            <div className="skeleton skeleton-text" style={{ width: '60px', height: '2rem' }}></div>
          </div>
        ))}
      </div>

      <div className="hr-main-grid">
        <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
        <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
      </div>
    </div>
  );
};

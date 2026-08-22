import React from 'react';
import '../styles/hr-dashboard.css';

export const MetricCard = ({ title, value, icon: Icon, colorClass = "text-blue-500" }) => {
  return (
    <div className="hr-card">
      <div className="metric-card-header">
        <h3 className="metric-card-title">{title}</h3>
        <div className={`metric-card-icon ${colorClass}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="metric-card-value">{value}</div>
    </div>
  );
};

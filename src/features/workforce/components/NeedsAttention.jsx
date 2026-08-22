import React from 'react';
import { AlertCircle, UserX, Clock, CalendarX2 } from 'lucide-react';
import '../styles/hr-dashboard.css';

export const NeedsAttention = ({ pendingLeaves, attendanceAlerts, incompleteProfiles }) => {
  const totalAlerts = pendingLeaves.length + attendanceAlerts.length + incompleteProfiles.length;

  return (
    <div className="hr-card needs-attention-card">
      <h3 className="section-title">
        <AlertCircle size={22} className="text-red-500" />
        Needs Attention
        {totalAlerts > 0 && (
          <span className="ml-2 bg-red-100 text-red-700 text-xs py-1 px-2 rounded-full">
            {totalAlerts}
          </span>
        )}
      </h3>

      {totalAlerts === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <p>You're all caught up!</p>
          <p className="text-sm">No items require immediate attention.</p>
        </div>
      ) : (
        <div className="alert-list">
          {pendingLeaves.map(leave => (
            <div key={leave.id} className="alert-item">
              <CalendarX2 size={18} className="alert-icon" />
              <div className="alert-content">
                <div className="alert-title">Pending Leave Request</div>
                <div className="alert-desc">{leave.employeeName} requested {leave.type}.</div>
              </div>
            </div>
          ))}

          {attendanceAlerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <Clock size={18} className="alert-icon" />
              <div className="alert-content">
                <div className="alert-title">Attendance Alert</div>
                <div className="alert-desc">{alert.message}</div>
              </div>
            </div>
          ))}

          {incompleteProfiles.map(profile => (
            <div key={profile.id} className="alert-item">
              <UserX size={18} className="alert-icon" />
              <div className="alert-content">
                <div className="alert-title">Incomplete Profile</div>
                <div className="alert-desc">{profile.name} is missing required details.</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

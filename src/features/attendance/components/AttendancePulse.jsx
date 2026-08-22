import React from 'react';
import Badge from '@/components/ui/Badge';
import { ATTENDANCE_UI_STATE } from '../hooks/useAttendance';

export const AttendancePulse = ({ state }) => {
  const getPulseConfig = () => {
    switch (state) {
      case ATTENDANCE_UI_STATE.READY:
        return { label: 'Ready to begin your workday', color: 'var(--color-primary)', dot: true, animate: false };
      case ATTENDANCE_UI_STATE.VERIFYING:
        return { label: 'Checking your workplace zone...', color: 'var(--color-warning)', dot: true, animate: true };
      case ATTENDANCE_UI_STATE.WORKING:
        return { label: 'You are working', color: 'var(--color-success)', dot: true, animate: true };
      case ATTENDANCE_UI_STATE.CHECKOUT_LOADING:
        return { label: 'Ending workday...', color: 'var(--color-warning)', dot: true, animate: true };
      case ATTENDANCE_UI_STATE.COMPLETED:
        return { label: 'Day complete', color: 'var(--color-text-secondary)', dot: false, animate: false };
      case ATTENDANCE_UI_STATE.ERROR:
        return { label: 'Error occurred', color: 'var(--color-danger)', dot: false, animate: false };
      default:
        return { label: 'Loading...', color: 'var(--color-text-tertiary)', dot: false, animate: true };
    }
  };

  const config = getPulseConfig();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: config.color }}>
      {config.dot && (
        <span 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: 'currentColor',
            animation: config.animate ? 'pulse 1.5s infinite ease-in-out' : 'none',
          }} 
        />
      )}
      <span style={{ fontWeight: '500' }}>{config.label}</span>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

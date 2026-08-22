import React from 'react';
import Card from '@/components/ui/Card';
import { Activity, Clock, Calendar, UserCheck } from 'lucide-react';

export const MyWorkdayHealth = ({ metrics }) => {
  const score = metrics?.score || 0;
  
  let statusText = 'Needs Attention';
  let statusColor = 'var(--color-danger)';
  if (score >= 90) {
    statusText = 'Excellent';
    statusColor = 'var(--color-success)';
  } else if (score >= 75) {
    statusText = 'Good';
    statusColor = 'var(--color-info)';
  }

  const renderMetric = (label, value, target, icon) => {
    const percent = Math.min(100, Math.round((value / target) * 100));
    return (
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            {icon} {label}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
            {value}%
          </div>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>
    );
  };

  return (
    <Card title="My Workday Health" subtitle="Your overall workforce alignment">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Overall Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                {score}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>/ 100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `color-mix(in srgb, ${statusColor} 15%, transparent)`, color: statusColor, borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)' }}>
              <Activity size={14} />
              {statusText}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color-subtle)' }} />

        <div>
          {renderMetric('Attendance', metrics?.attendance || 0, 100, <Clock size={14} />)}
          {renderMetric('Punctuality', metrics?.punctuality || 0, 100, <Calendar size={14} />)}
          {renderMetric('Profile Completion', metrics?.profile || 0, 100, <UserCheck size={14} />)}
        </div>

      </div>
    </Card>
  );
};

export default MyWorkdayHealth;

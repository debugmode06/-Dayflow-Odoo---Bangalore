import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';

const LEVEL_CFG = {
  low: { color: 'var(--color-success-text)', bg: 'var(--color-success-bg)', label: 'Low' },
  medium: { color: 'var(--color-warning-text)', bg: 'var(--color-warning-bg)', label: 'Moderate' },
  high: { color: 'var(--color-danger-text)', bg: 'var(--color-danger-bg)', label: 'High' },
};

const ImpactBadge = ({ level }) => {
  const cfg = LEVEL_CFG[level] || LEVEL_CFG.low;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
      {cfg.label}
    </span>
  );
};

export const LeaveImpactMap = ({ leave = {} }) => {
  const nav = useNavigate();
  const { today = {}, tomorrow = {}, next7Days = {} } = leave;
  const activeData = today?.byDepartment || [];

  return (
    <Card title="Leave Impact"
      subtitle="Department capacity impact from current leaves"
      headerAction={
        <button onClick={() => nav('/hr/leave')} style={{ fontSize: 11, color: 'var(--color-primary)', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontWeight: 600, cursor: 'pointer' }}>
          View All
        </button>
      }>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {[
          { label: 'Approved Today', value: today.approved || 0, color: 'var(--color-success)' },
          { label: 'Pending', value: today.pending || 0, color: 'var(--color-warning)' },
          { label: 'Next 7 Days', value: next7Days.totalApproved || 0, color: 'var(--color-info)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* By department */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {activeData.map((dept) => (
          <div key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{dept.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dept.count} employees on leave · {dept.impact}% capacity impact</div>
            </div>
            <ImpactBadge level={dept.level} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LeaveImpactMap;

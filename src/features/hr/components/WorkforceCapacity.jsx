import React from 'react';
import Card from '@/components/ui/Card';

export const WorkforceCapacity = ({ capacity = {} }) => {
  const { current = 0, tomorrow = 0, sevenDayAvg = 0, insight = '' } = capacity;
  const getColor = (v) => v >= 85 ? 'var(--color-success)' : v >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';

  const CapBar = ({ label, value }) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: getColor(value) }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg-surface-tertiary)', borderRadius: 99 }}>
        <div style={{ width: `${value}%`, height: '100%', background: getColor(value), borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );

  return (
    <Card title="Team Capacity" subtitle="Available workforce capacity">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <CapBar label="Current" value={current} />
        <CapBar label="Tomorrow" value={tomorrow} />
        <CapBar label="7-Day Average" value={sevenDayAvg} />
      </div>
      {insight && (
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 'var(--space-4)', lineHeight: 1.5, fontStyle: 'italic' }}>
          {insight}
        </p>
      )}
    </Card>
  );
};

export default WorkforceCapacity;

import React from 'react';
import Card from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

const Cap = ({ value }) => {
  const color = value >= 85 ? 'var(--color-success)' : value >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';
  const bg = value >= 85 ? 'var(--color-success-bg)' : value >= 70 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-tertiary)', borderRadius: 99 }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{value}%</span>
      {value < 70 && <AlertTriangle size={13} color="var(--color-danger)" />}
    </div>
  );
};

export const TomorrowWorkforce = ({ tomorrow = {} }) => {
  const { overallCapacity = 0, expectedPresent = 0, expectedOnLeave = 0, expectedAbsent = 0, departments = [], insight = '' } = tomorrow;

  return (
    <Card title="Tomorrow's Workforce" subtitle="Predictive capacity based on approved leave and patterns">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        {[
          { label: 'Expected Present', value: expectedPresent, color: 'var(--color-success)' },
          { label: 'Expected On Leave', value: expectedOnLeave, color: 'var(--color-warning)' },
          { label: 'Expected Absent', value: expectedAbsent, color: 'var(--color-danger)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Overall Capacity</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: overallCapacity >= 85 ? 'var(--color-success)' : overallCapacity >= 70 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{overallCapacity}%</span>
        </div>
        <Cap value={overallCapacity} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {departments.map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 120, flexShrink: 0 }}>{d.name}</span>
            <div style={{ flex: 1 }}><Cap value={d.capacity} /></div>
          </div>
        ))}
      </div>

      {insight && (
        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-warning-text)', lineHeight: 1.5 }}>
          💡 {insight}
        </div>
      )}
    </Card>
  );
};

export default TomorrowWorkforce;

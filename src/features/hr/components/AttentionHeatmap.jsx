import React from 'react';
import Card from '@/components/ui/Card';

const LEVEL_COLORS = {
  low: { color: 'var(--color-success-text)', bg: 'var(--color-success-bg)' },
  medium: { color: 'var(--color-warning-text)', bg: 'var(--color-warning-bg)' },
  high: { color: 'var(--color-danger-text)', bg: 'var(--color-danger-bg)' },
};

const Cell = ({ level }) => {
  const cfg = LEVEL_COLORS[level] || LEVEL_COLORS.low;
  return (
    <div style={{ padding: '5px 8px', borderRadius: 'var(--radius-sm)', background: cfg.bg, textAlign: 'center', fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: 'capitalize' }}>
      {level}
    </div>
  );
};

const COLS = [
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave Load' },
  { key: 'availability', label: 'Availability' },
  { key: 'profile', label: 'Profiles' },
];

export const AttentionHeatmap = ({ heatmap = [] }) => (
  <Card title="Workforce Attention Map" subtitle="Risk concentration across departments and dimensions">
    <div style={{ overflowX: 'auto', marginTop: 'var(--space-2)' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px', minWidth: 120 }}>
              Department
            </th>
            {COLS.map((c) => (
              <th key={c.key} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmap.map((row) => (
            <tr key={row.dept}>
              <td style={{ fontWeight: 600, color: 'var(--text-primary)', padding: '2px 8px' }}>{row.dept}</td>
              {COLS.map((c) => (
                <td key={c.key} style={{ padding: '2px 8px' }}>
                  <Cell level={row[c.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
      Cells show risk level per dimension. Colors indicate severity: green = low, amber = medium, red = high.
    </p>
  </Card>
);

export default AttentionHeatmap;

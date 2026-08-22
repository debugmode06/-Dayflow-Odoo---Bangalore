import React from 'react';
import Card from '@/components/ui/Card';

export const WeeklyComparison = ({ comparison }) => {
  if (!comparison) return null;

  const rows = [
    { label: 'Attendance', current: `${comparison.attendancePercentage.current}%`, prev: `${comparison.attendancePercentage.previous}%` },
    { label: 'On-time', current: `${comparison.onTimePercentage.current}%`, prev: `${comparison.onTimePercentage.previous}%` },
    { label: 'Late', current: comparison.lateCount.current, prev: comparison.lateCount.previous },
    { label: 'Absent', current: comparison.absentCount.current, prev: comparison.absentCount.previous },
  ];

  // Derive a short deterministic summary
  let summary = 'Attendance patterns remained stable.';
  if (comparison.attendancePercentage.trend === 'INCREASING' && comparison.onTimePercentage.trend === 'DECREASING') {
    summary = 'Attendance improved this week, while punctuality declined slightly.';
  } else if (comparison.attendancePercentage.trend === 'INCREASING' && comparison.onTimePercentage.trend === 'INCREASING') {
    summary = 'Both attendance and punctuality improved this week.';
  } else if (comparison.lateCount.trend === 'INCREASING') {
    summary = 'Late arrivals increased compared to last week.';
  }

  return (
    <Card title="This Week vs Last Week" subtitle={summary}>
      <div style={{ marginTop: 'var(--space-6)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ textAlign: 'left', padding: '12px 0', color: 'var(--text-secondary)', fontWeight: '500' }}>Metric</th>
              <th style={{ textAlign: 'right', padding: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>This Week</th>
              <th style={{ textAlign: 'right', padding: '12px 0 12px 12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Last Week</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 0', fontWeight: '500' }}>{row.label}</td>
                <td style={{ textAlign: 'right', padding: '12px', fontWeight: 'bold' }}>{row.current}</td>
                <td style={{ textAlign: 'right', padding: '12px 0 12px 12px', color: 'var(--text-secondary)' }}>{row.prev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

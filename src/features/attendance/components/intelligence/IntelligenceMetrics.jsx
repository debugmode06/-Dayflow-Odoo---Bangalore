import React from 'react';
import Card from '@/components/ui/Card';

const TrendIndicator = ({ trend, difference, isPercentage }) => {
  if (!trend || trend === 'FLAT' || difference === 0) return <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>→ Unchanged</span>;
  
  const isPositiveTrend = trend === 'INCREASING';
  const prefix = isPositiveTrend ? '↑' : '↓';
  const displayDiff = Math.abs(difference);
  
  // Note: Whether increasing is 'good' depends on the metric (e.g. attendance vs lateCount), 
  // but we keep colors neutral for raw numbers to avoid false HR signals, 
  // or apply light context-aware colors.
  return (
    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
      {prefix} {displayDiff}{isPercentage ? '%' : ''}
    </span>
  );
};

export const IntelligenceMetrics = ({ metrics, comparison }) => {
  if (!metrics || !comparison) return null;

  const cards = [
    { label: 'Attendance', value: `${metrics.attendancePercentage}%`, cmp: comparison.attendancePercentage, isPct: true },
    { label: 'On-time', value: `${metrics.onTimePercentage}%`, cmp: comparison.onTimePercentage, isPct: true },
    { label: 'Late', value: metrics.lateCount, cmp: comparison.lateCount, isPct: false },
    { label: 'Absent', value: metrics.absentCount, cmp: comparison.absentCount, isPct: false },
    { label: 'Half-day', value: metrics.halfDayCount, cmp: comparison.halfDayCount, isPct: false },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
      {cards.map((c, idx) => (
        <Card key={idx} style={{ padding: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {c.value}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>
            {c.label}
          </div>
          <div>
            <TrendIndicator trend={c.cmp?.trend} difference={c.cmp?.difference} isPercentage={c.isPct} />
          </div>
        </Card>
      ))}
    </div>
  );
};

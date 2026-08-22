import React from 'react';
import Card from '@/components/ui/Card';

/**
 * Renders a trend indicator using Unicode arrow characters (no emoji, encoding-safe).
 * arrow up = U+2191, arrow down = U+2193, arrow right = U+2192
 */
const TrendIndicator = ({ trend, difference, isPercentage }) => {
  if (!trend || trend === 'FLAT' || difference === 0) {
    return (
      <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
        {'\u2192'} Unchanged
      </span>
    );
  }

  const isIncreasing = trend === 'INCREASING';
  const arrow = isIncreasing ? '\u2191' : '\u2193';
  const displayDiff = Math.abs(difference);

  return (
    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
      {arrow} {displayDiff}{isPercentage ? '%' : ''}
    </span>
  );
};

export const IntelligenceMetrics = ({ metrics, comparison }) => {
  if (!metrics || !comparison) return null;

  const cards = [
    {
      label: 'Attendance',
      value: `${metrics.attendancePercentage}%`,
      cmp: comparison.attendancePercentage,
      isPct: true,
    },
    {
      label: 'On-time',
      value: `${metrics.onTimePercentage}%`,
      cmp: comparison.onTimePercentage,
      isPct: true,
    },
    {
      label: 'Late',
      value: metrics.lateCount,
      cmp: comparison.lateCount,
      isPct: false,
    },
    {
      label: 'Absent',
      value: metrics.absentCount,
      cmp: comparison.absentCount,
      isPct: false,
    },
    {
      label: 'Half-day',
      value: metrics.halfDayCount,
      cmp: comparison.halfDayCount,
      isPct: false,
    },
  ];

  return (
    <div
      role="list"
      aria-label="Attendance metrics"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {cards.map((c, idx) => (
        <Card
          key={idx}
          style={{ padding: '16px' }}
        >
          <div role="listitem">
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
              aria-label={`${c.label}: ${c.value}`}
            >
              {c.value}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                marginBottom: '8px',
              }}
            >
              {c.label}
            </div>
            <div>
              <TrendIndicator
                trend={c.cmp?.trend}
                difference={c.cmp?.difference}
                isPercentage={c.isPct}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

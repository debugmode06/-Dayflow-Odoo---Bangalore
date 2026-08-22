import React from 'react';
import Card from '@/components/ui/Card';

/**
 * Derives a short deterministic summary from the comparison data.
 * No AI, no hardcoded text beyond logical combinations.
 */
const deriveSummary = (comparison) => {
  const { attendancePercentage, onTimePercentage, lateCount, absentCount } = comparison;

  if (
    attendancePercentage.trend === 'INCREASING' &&
    onTimePercentage.trend === 'INCREASING'
  ) {
    return 'Both attendance and punctuality improved this week.';
  }
  if (
    attendancePercentage.trend === 'INCREASING' &&
    onTimePercentage.trend === 'DECREASING'
  ) {
    return 'Attendance improved this week, while punctuality declined slightly.';
  }
  if (
    attendancePercentage.trend === 'DECREASING' &&
    onTimePercentage.trend === 'DECREASING'
  ) {
    return 'Both attendance and punctuality declined this week.';
  }
  if (lateCount.trend === 'INCREASING') {
    return 'Late arrivals increased compared to last week.';
  }
  if (absentCount.trend === 'INCREASING') {
    return 'Absences increased compared to last week.';
  }
  return 'Attendance patterns remained stable this week.';
};

export const WeeklyComparison = ({ comparison }) => {
  if (!comparison) return null;

  const rows = [
    {
      label: 'Attendance',
      current: `${comparison.attendancePercentage.current}%`,
      prev: `${comparison.attendancePercentage.previous}%`,
    },
    {
      label: 'On-time',
      current: `${comparison.onTimePercentage.current}%`,
      prev: `${comparison.onTimePercentage.previous}%`,
    },
    {
      label: 'Late arrivals',
      current: comparison.lateCount.current,
      prev: comparison.lateCount.previous,
    },
    {
      label: 'Absences',
      current: comparison.absentCount.current,
      prev: comparison.absentCount.previous,
    },
  ];

  const summary = deriveSummary(comparison);

  return (
    <Card title="This Week vs Last Week" subtitle={summary}>
      <div style={{ marginTop: 'var(--space-4)', overflowX: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}
          aria-label="Weekly attendance comparison"
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th
                scope="col"
                style={{
                  textAlign: 'left',
                  padding: '10px 0',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}
              >
                Metric
              </th>
              <th
                scope="col"
                style={{
                  textAlign: 'right',
                  padding: '10px 12px',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}
              >
                This Week
              </th>
              <th
                scope="col"
                style={{
                  textAlign: 'right',
                  padding: '10px 0 10px 12px',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}
              >
                Last Week
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 0', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {row.label}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                  }}
                >
                  {row.current}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '10px 0 10px 12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {row.prev}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

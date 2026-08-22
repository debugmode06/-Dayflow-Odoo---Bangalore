import React from 'react';
import { CheckCircle2, CalendarRange } from 'lucide-react';
import Card from '@/components/ui/Card';

const MetricBadge = ({ label, count, colorBg, colorText }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-3) var(--space-2)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: colorBg || 'var(--bg-surface-secondary)',
      border: '1px solid var(--border-color-subtle)',
    }}
  >
    <span
      style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        fontWeight: 'var(--font-weight-medium)',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-bold)',
        color: colorText || 'var(--text-primary)',
      }}
    >
      {count}
    </span>
  </div>
);

/**
 * AttendanceSummary inside Employee 360°.
 * Integration boundary: consumes attendance summary.
 * If no summary is available, displays a professional empty state.
 */
const AttendanceSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <Card title="Attendance Summary" subtitle="Last 30 days snapshot">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Loading attendance data...
          </span>
        </div>
      </Card>
    );
  }

  const hasData = summary && summary.total > 0;

  return (
    <Card
      title="Attendance Summary"
      subtitle="Last 30 days snapshot"
      headerAction={
        hasData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} color="var(--color-success)" />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-text)', fontWeight: 'var(--font-weight-semibold)' }}>
              {summary.percentage}% Active Rate
            </span>
          </div>
        )
      }
    >
      {!hasData ? (
        <div
          style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <CalendarRange size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
          <p>Attendance summary will appear when attendance records are available.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <MetricBadge label="Present" count={summary.present} colorText="var(--color-success-text)" />
          <MetricBadge label="Late" count={summary.late} colorText="var(--color-warning-text)" />
          <MetricBadge label="Half Day" count={summary.halfDay} colorText="var(--color-info-text)" />
          <MetricBadge label="Absent" count={summary.absent} colorText="var(--color-danger-text)" />
        </div>
      )}
    </Card>
  );
};

export default AttendanceSummary;

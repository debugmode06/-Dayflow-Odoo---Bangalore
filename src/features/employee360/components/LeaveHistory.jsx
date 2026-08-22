import React from 'react';
import { CalendarRange } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const formatDateRange = (from, to) => {
  if (!from || !to) return '';
  try {
    const fDate = from.toDate ? from.toDate() : new Date(from);
    const tDate = to.toDate ? to.toDate() : new Date(to);
    const options = { day: 'numeric', month: 'short' };
    return `${fDate.toLocaleDateString('en-IN', options)} - ${tDate.toLocaleDateString('en-IN', { ...options, year: 'numeric' })}`;
  } catch {
    return '';
  }
};

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

/**
 * LeaveHistory list inside Employee 360°.
 * Integration boundary: reads Leave history from leaves collection.
 * If no history is found, displays a professional empty state.
 */
const LeaveHistory = ({ history }) => {
  const hasHistory = history && history.length > 0;

  return (
    <Card title="Leave History" subtitle="Recent time-off applications">
      {!hasHistory ? (
        <div
          style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <CalendarRange size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
          <p>No leave records yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          {history.map((record) => (
            <div
              key={record.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color-subtle)',
                backgroundColor: 'var(--bg-surface-secondary)',
              }}
            >
              <div style={{ minWidth: 0, flex: 1, paddingRight: 'var(--space-2)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                  {record.leaveType || 'Leave Request'}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {formatDateRange(record.startDate, record.endDate)} &nbsp;·&nbsp; {record.duration || 0} days
                </p>
                {record.reason && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    &quot;{record.reason}&quot;
                  </p>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <Badge variant={getStatusVariant(record.status)}>
                  {record.status?.toUpperCase() || 'PENDING'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LeaveHistory;

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

export const LeaveUpcoming = ({ leaves = [] }) => {
  // Find the closest approved leave in the future
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingLeaves = leaves
    .filter(leave => leave.status === 'approved' && new Date(leave.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const nextLeave = upcomingLeaves.length > 0 ? upcomingLeaves[0] : null;

  return (
    <Card title="Upcoming Time Off">
      {nextLeave ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>
              <Calendar size={18} />
              <span>{nextLeave.startDate} — {nextLeave.endDate}</span>
            </div>
            <Badge variant="success" dot>APPROVED</Badge>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <span>{nextLeave.type}</span>
            <span>{nextLeave.duration} {nextLeave.duration === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
            <Calendar size={24} style={{ opacity: 0.5 }} />
          </div>
          <p style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>No upcoming time off</p>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>Your approved leave will appear here.</p>
        </div>
      )}
    </Card>
  );
};

export default LeaveUpcoming;

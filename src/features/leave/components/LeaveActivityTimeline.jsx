import React from 'react';
import Card from '@/components/ui/Card';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export const LeaveActivityTimeline = ({ leaves = [] }) => {
  // Sort leaves by creation date or fallback to start date descending
  const recentActivities = [...leaves]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.startDate);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.startDate);
      return dateB - dateA;
    })
    .slice(0, 5);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { icon: <CheckCircle2 size={16} color="var(--color-success)" />, label: 'Leave approved' };
      case 'rejected': return { icon: <XCircle size={16} color="var(--color-danger)" />, label: 'Leave rejected' };
      case 'pending': default: return { icon: <Clock size={16} color="var(--color-warning)" />, label: 'Leave request submitted' };
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  return (
    <Card title="Leave Activity" subtitle="Recent updates to your requests">
      {recentActivities.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          {recentActivities.map((activity, index) => {
            const config = getStatusConfig(activity.status);
            return (
              <div key={activity.id || index} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '24px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: 'var(--bg-surface-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    {config.icon}
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div style={{ width: '2px', flexGrow: 1, backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                  )}
                </div>
                
                <div style={{ paddingBottom: index < recentActivities.length - 1 ? 'var(--space-2)' : '0' }}>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    {config.label}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                    {activity.type} · {activity.startDate} — {activity.endDate}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
                    {getTimeAgo(activity.createdAt || activity.startDate)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>No recent activity to display.</p>
        </div>
      )}
    </Card>
  );
};

export default LeaveActivityTimeline;

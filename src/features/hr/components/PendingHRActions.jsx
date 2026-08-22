import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Calendar, Clock, Check, X } from 'lucide-react';

const TYPE_COLORS = {
  Vacation: '#6366f1', 'Sick Leave': '#ef4444', Personal: '#84647C', Other: '#3b82f6',
};

export const PendingHRActions = ({ pendingLeaves = [] }) => {
  const nav = useNavigate();
  const [dismissed, setDismissed] = useState([]);
  const active = pendingLeaves.filter(l => !dismissed.includes(l.id));

  return (
    <Card title="Pending HR Actions"
      subtitle={`${active.length} items require action`}
      headerAction={
        <button onClick={() => nav('/hr/leave')} style={{ fontSize: 11, color: 'var(--color-primary)', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontWeight: 600, cursor: 'pointer' }}>
          View All Leave
        </button>
      }>
      {active.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
          <Check size={40} style={{ margin: '0 auto 8px', display: 'block' }} />
          <p style={{ fontSize: 13 }}>All caught up! No pending actions.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          {active.map((leave) => {
            const typeColor = TYPE_COLORS[leave.type] || '#84647C';
            return (
              <div key={leave.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: `4px solid ${typeColor}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{leave.employeeName}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{leave.employeeId} · {leave.department}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: typeColor, background: `${typeColor}18`, borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>{leave.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <Calendar size={11} /> {leave.startDate} → {leave.endDate}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <Clock size={11} /> {leave.days}d · submitted {leave.submittedDaysAgo === 0 ? 'today' : `${leave.submittedDaysAgo}d ago`}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <button onClick={() => nav('/hr/leave')} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    Review
                  </button>
                  <button onClick={() => setDismissed(p => [...p, leave.id])} style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '5px 8px', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default PendingHRActions;

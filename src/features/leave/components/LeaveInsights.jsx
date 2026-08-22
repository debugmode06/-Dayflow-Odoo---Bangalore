import React from 'react';
import Card from '@/components/ui/Card';
import { Lightbulb } from 'lucide-react';

export const LeaveInsights = ({ leaves = [], activeRequest = null }) => {
  // Deterministic insights calculation
  const currentYear = new Date().getFullYear();
  
  const vacationLeaves = leaves.filter(l => l.type === 'Vacation' && l.status === 'approved' && l.startDate.includes(currentYear));
  const vacationUsed = vacationLeaves.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalVacation = 24; // Standard Dayflow Vacation Allowance
  const remainingVacation = Math.max(0, totalVacation - vacationUsed);
  const percentageUsed = totalVacation > 0 ? Math.round((vacationUsed / totalVacation) * 100) : 0;

  // Next upcoming leave
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingLeaves = leaves
    .filter(l => l.status === 'approved' && new Date(l.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const nextLeave = upcomingLeaves.length > 0 ? upcomingLeaves[0] : null;

  return (
    <Card title="Leave Insights" subtitle="Data-driven overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
          <Lightbulb size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', margin: 0, lineHeight: 1.4 }}>
            You have used <strong>{percentageUsed}%</strong> of your annual vacation allowance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
          <Lightbulb size={18} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            You have <strong>{remainingVacation}</strong> vacation days remaining.
          </p>
        </div>

        {nextLeave && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
            <Lightbulb size={18} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Your upcoming {nextLeave.type.toLowerCase()} request for {nextLeave.duration} {nextLeave.duration === 1 ? 'day' : 'days'} is approved.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LeaveInsights;

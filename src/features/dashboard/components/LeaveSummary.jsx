import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const LeaveSummary = ({ leaves = [] }) => {
  const navigate = useNavigate();
  
  // Basic deterministic calculation based on existing logic in member 3's module
  // Hardcoding policies since they are standard in Dayflow
  const POLICIES = { Vacation: 24, Sick: 14, Personal: 5 };
  
  const currentYear = new Date().getFullYear();
  const approvedLeaves = leaves.filter(l => l.status === 'approved' && l.startDate.includes(currentYear));
  
  const used = { Vacation: 0, Sick: 0, Personal: 0 };
  approvedLeaves.forEach(l => {
    if (used[l.type] !== undefined) used[l.type] += (l.duration || 0);
  });

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <Card title="My Leave">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Vacation</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{Math.max(0, POLICIES.Vacation - used.Vacation)} days</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Sick Leave</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{Math.max(0, POLICIES.Sick - used.Sick)} days</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Personal</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{Math.max(0, POLICIES.Personal - used.Personal)} days</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color-subtle)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>Pending Requests</span>
          <Badge variant={pendingCount > 0 ? 'warning' : 'default'} size="sm">{pendingCount}</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button
            onClick={() => navigate('/leave')}
            style={{
              padding: '8px',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer'
            }}
          >
            Apply Leave
          </button>
          <button
            onClick={() => navigate('/leave')}
            style={{
              padding: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer'
            }}
          >
            View Leave
          </button>
        </div>

      </div>
    </Card>
  );
};

export default LeaveSummary;

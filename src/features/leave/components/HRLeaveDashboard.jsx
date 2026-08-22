import React, { useState, useEffect } from 'react';
import { subscribeToAllLeaves } from '../services/leaveService';
import HRLeaveRequestsTable from './HRLeaveRequestsTable';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export const HRLeaveDashboard = ({ title, subtitle, roleMode }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllLeaves((data) => {
      setLeaves(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedThisMonth = leaves.filter(l => l.status === 'approved').length; // naive metric for now

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</p>
        </div>
        <Badge variant={roleMode === 'hr' ? 'ai' : 'info'} size="md">
          {roleMode === 'hr' ? 'HR Command Active' : 'Employee Workspace'}
        </Badge>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Pending Approvals" subtitle="Requires action">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
            {pendingCount}
          </div>
        </Card>
        <Card title="Approved Leaves" subtitle="Company-wide">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px' }}>
            {approvedThisMonth}
          </div>
        </Card>
      </div>

      <HRLeaveRequestsTable leaves={leaves} isLoading={loading} />
    </div>
  );
};

export default HRLeaveDashboard;

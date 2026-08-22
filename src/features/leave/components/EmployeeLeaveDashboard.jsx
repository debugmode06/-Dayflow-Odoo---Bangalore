import React, { useState, useEffect } from 'react';
import { subscribeToEmployeeLeaves } from '../services/leaveService';
import LeaveApplicationForm from './LeaveApplicationForm';
import LeaveHistoryTable from './LeaveHistoryTable';
import { useAuth } from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export const EmployeeLeaveDashboard = ({ title, subtitle, roleMode }) => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToEmployeeLeaves(user.uid, (data) => {
      setLeaves(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate some fake balances for simulation
  const vacationTaken = leaves.filter(l => l.status === 'approved' && l.type === 'Vacation').length * 2; // naive calc

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
        <Card title="Available Vacation" subtitle="Annual Allowance">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px' }}>
            {20 - vacationTaken} Days
          </div>
        </Card>
        <Card title="Pending Requests" subtitle="Awaiting HR Review">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
            {leaves.filter(l => l.status === 'pending').length}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        <LeaveApplicationForm />
        <LeaveHistoryTable leaves={leaves} isLoading={loading} />
      </div>
    </div>
  );
};

export default EmployeeLeaveDashboard;

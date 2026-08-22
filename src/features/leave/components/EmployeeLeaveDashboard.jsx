import React, { useState, useEffect } from 'react';
import { subscribeToEmployeeLeaves, subscribeToAllLeaves } from '../services/leaveService';
import LeaveApplicationForm from './LeaveApplicationForm';
import LeaveHistoryTable from './LeaveHistoryTable';
import LeaveCalendar from './LeaveCalendar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LeaveBalanceIntelligence from './LeaveBalanceIntelligence';

export const EmployeeLeaveDashboard = ({ title, subtitle, roleMode }) => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribeEmp = subscribeToEmployeeLeaves(user.uid, (data) => {
      setLeaves(data);
      setLoading(false);
    });

    const unsubscribeAll = subscribeToAllLeaves((data) => {
      setAllLeaves(data);
    });

    return () => {
      unsubscribeEmp();
      unsubscribeAll();
    };
  }, [user]);

  // We pass activeRequest setter down to LeaveApplicationForm
  // so it can lift its state up to feed LeaveBalanceIntelligence

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

      {/* Leave Balance Intelligence */}
      <LeaveBalanceIntelligence leaves={leaves} activeRequest={activeRequest} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        <LeaveApplicationForm onActiveRequestChange={setActiveRequest} allLeaves={allLeaves} currentLeaves={leaves} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
          <LeaveCalendar leaves={leaves} />
          <LeaveHistoryTable leaves={leaves} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveDashboard;

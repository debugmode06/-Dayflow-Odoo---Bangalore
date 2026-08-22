import React, { useState, useEffect } from 'react';
import { subscribeToEmployeeLeaves, fetchSanitizedLeaves } from '../services/leaveService';
import LeaveApplicationForm from './LeaveApplicationForm';
import LeaveHistoryTable from './LeaveHistoryTable';
import LeaveCalendar from './LeaveCalendar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LeaveBalanceIntelligence from './LeaveBalanceIntelligence';
import LeaveUpcoming from './LeaveUpcoming';
import LeaveInsights from './LeaveInsights';
import LeaveActivityTimeline from './LeaveActivityTimeline';

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

    // Fetch sanitized global leaves for deterministic intelligence calculations
    fetchSanitizedLeaves().then(data => {
      setAllLeaves(data);
    });

    return () => {
      unsubscribeEmp();
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

      {/* Leave Balance Intelligence & Upcoming */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
        <div style={{ flex: '3 1 600px' }}>
          <LeaveBalanceIntelligence leaves={leaves} activeRequest={activeRequest} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <LeaveUpcoming leaves={leaves} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
          <div style={{ flex: '2 1 500px' }}>
            <LeaveApplicationForm onActiveRequestChange={setActiveRequest} allLeaves={allLeaves} currentLeaves={leaves} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <LeaveInsights leaves={leaves} activeRequest={activeRequest} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
          <LeaveHistoryTable leaves={leaves} isLoading={loading} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <LeaveCalendar leaves={leaves} />
            <LeaveActivityTimeline leaves={leaves} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveDashboard;

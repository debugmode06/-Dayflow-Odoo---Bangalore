import React from 'react';
import Card from '@/components/ui/Card';
import { calculateLeaveDuration } from '../intelligence/leaveImpactEngine';

const ALLOWANCES = {
  Vacation: 24,
  Sick: 14,
  Personal: 5
};

// Map form values to allowance keys
const TYPE_MAPPING = {
  'Vacation': 'Vacation',
  'Sick': 'Sick',
  'Personal': 'Personal',
  'Sick Leave': 'Sick',
  'Personal Time': 'Personal'
};

export const LeaveBalanceIntelligence = ({ leaves = [], activeRequest = null }) => {
  // activeRequest: { type: 'Vacation', duration: 3 }

  const calculateBalance = (typeKey) => {
    const allowance = ALLOWANCES[typeKey] || 0;
    
    // Pending/rejected requests must not incorrectly reduce the balance. Only count approved.
    const used = leaves
      .filter(l => l.status === 'approved' && TYPE_MAPPING[l.type] === typeKey)
      .reduce((total, l) => {
        const diffDays = calculateLeaveDuration(l.startDate, l.endDate);
        return total + diffDays;
      }, 0);

    const remaining = Math.max(0, allowance - used);
    
    return { allowance, used, remaining };
  };

  const types = [
    { id: 'Vacation', label: 'Vacation' },
    { id: 'Sick', label: 'Sick Leave' },
    { id: 'Personal', label: 'Personal Time' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
      {types.map(({ id, label }) => {
        const { allowance, used, remaining } = calculateBalance(id);
        const isRequestedType = activeRequest && TYPE_MAPPING[activeRequest.type] === id && activeRequest.duration > 0;
        const requested = isRequestedType ? activeRequest.duration : 0;
        const afterApproval = Math.max(0, remaining - requested);
        
        const progressPercent = Math.min(100, Math.max(0, (used / allowance) * 100));
        const pendingPercent = Math.min(100, Math.max(0, ((used + requested) / allowance) * 100));

        return (
          <Card key={id} title="TIME-OFF BALANCE">
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}>{label}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {remaining} / {allowance} days remaining
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              
              {/* Progress Bar */}
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ 
                  position: 'absolute', left: 0, top: 0, height: '100%', 
                  backgroundColor: 'var(--color-primary)', 
                  width: `${progressPercent}%`,
                  transition: 'width 0.3s ease'
                }} />
                {isRequestedType && (
                  <div style={{ 
                    position: 'absolute', left: `${progressPercent}%`, top: 0, height: '100%', 
                    backgroundColor: 'var(--color-warning)', 
                    width: `${pendingPercent - progressPercent}%`,
                    opacity: 0.7,
                    transition: 'width 0.3s ease'
                  }} />
                )}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Used: {used}d</span>
                <span style={{ fontWeight: 'var(--font-weight-medium)' }}>Remaining: {remaining}d</span>
              </div>

              {/* Active Request Preview */}
              {isRequestedType && (
                <div style={{ 
                  marginTop: 'var(--space-2)', 
                  padding: 'var(--space-2)', 
                  backgroundColor: 'var(--color-primary-light)', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current balance:</span>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{remaining} days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Requested:</span>
                    <span style={{ color: 'var(--color-warning-text)', fontWeight: 'var(--font-weight-bold)' }}>{requested} days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-color-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>After approval:</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-bold)' }}>{afterApproval} days</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default LeaveBalanceIntelligence;

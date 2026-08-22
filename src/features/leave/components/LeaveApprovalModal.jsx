import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { calculateLeaveImpact } from '../intelligence/leaveImpactEngine';
import LeaveImpactSimulator from './LeaveImpactSimulator';

export const LeaveApprovalModal = ({ isOpen, onClose, leave, allLeaves = [], onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const impact = useMemo(() => {
    if (!leave) return null;
    return calculateLeaveImpact({
      requestedStartDate: leave.startDate,
      requestedEndDate: leave.endDate,
      requestingUserId: leave.userId,
      existingLeaves: allLeaves,
      totalEmployees: 100 // Fallback workforce
    });
  }, [leave, allLeaves]);

  if (!leave) return null;

  const handleAction = async (action) => {
    setIsSubmitting(true);
    try {
      if (action === 'approve') {
        await onApprove(leave.id, comment);
      } else {
        await onReject(leave.id, comment);
      }
      setComment('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Leave Request">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Employee</div>
          <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{leave.userName}</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Leave Type</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{leave.type}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Dates</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{leave.startDate} to {leave.endDate}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Reason</div>
          <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }}>
            {leave.reason}
          </div>
        </div>

        {impact && (
          <LeaveImpactSimulator 
             impact={impact} 
             employeeName={leave.userName} 
             leaveDates={`${leave.startDate} to ${leave.endDate}`} 
             leaveType={leave.type} 
          />
        )}

        <Input
          label="HR Comment (Optional)"
          type="text"
          placeholder="Add a note to this request..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Button variant="outline" onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
          <Button variant="danger" onClick={() => handleAction('reject')} isLoading={isSubmitting}>Reject</Button>
          <Button variant="primary" onClick={() => handleAction('approve')} isLoading={isSubmitting}>Approve</Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveApprovalModal;

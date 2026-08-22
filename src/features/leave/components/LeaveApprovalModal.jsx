import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { calculateLeaveImpact } from '../intelligence/leaveImpactEngine';

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
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Simulated Impact</span>
              <Badge variant={impact.impactLevel === 'HIGH' ? 'danger' : impact.impactLevel === 'MEDIUM' ? 'warning' : 'success'}>
                {impact.impactLevel} IMPACT
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {impact.explanation}
            </div>
          </div>
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

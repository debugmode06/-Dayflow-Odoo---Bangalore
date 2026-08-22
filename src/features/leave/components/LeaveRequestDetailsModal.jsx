import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export const LeaveRequestDetailsModal = ({ isOpen, onClose, leave }) => {
  if (!leave) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': default: return 'warning';
    }
  };

  const parseFirestoreDate = (field) => {
    if (!field) return null;
    if (field.toDate) return field.toDate().getTime();
    if (field.seconds) return field.seconds * 1000;
    return new Date(field).getTime();
  };

  const getFormatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parsed = parseFirestoreDate(dateStr);
    if (!parsed) return '-';
    return new Date(parsed).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Request Details"
      description="Detailed view of your leave request"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)' }}>
            {leave.type}
          </div>
          <Badge variant={getStatusVariant(leave.status)} dot>{(leave.status || '').toUpperCase()}</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Requested Dates
            </div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {leave.startDate} – {leave.endDate}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Duration
            </div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {leave.duration} {leave.duration === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reason
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '4px', backgroundColor: 'var(--bg-surface-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            {leave.reason || 'No reason provided.'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HR Comment
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '4px', backgroundColor: 'var(--bg-surface-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            {leave.hrComment || 'No comments from HR yet.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Submitted On
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {getFormatDate(leave.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveRequestDetailsModal;

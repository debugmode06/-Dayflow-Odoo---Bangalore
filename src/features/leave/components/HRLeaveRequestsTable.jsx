import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LeaveApprovalModal from './LeaveApprovalModal';
import { updateLeaveStatus } from '../services/leaveService';
import Toast from '@/components/ui/Toast';

export const HRLeaveRequestsTable = ({ leaves = [], isLoading }) => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [toast, setToast] = useState(null);

  const handleApprove = async (leaveId, comment) => {
    try {
      await updateLeaveStatus(leaveId, 'approved', comment);
      setToast({ message: 'Leave approved successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to approve leave', type: 'error' });
    }
  };

  const handleReject = async (leaveId, comment) => {
    try {
      await updateLeaveStatus(leaveId, 'rejected', comment);
      setToast({ message: 'Leave rejected successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to reject leave', type: 'error' });
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'userName',
      cell: (row) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.userName}</span>
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Dates',
      accessor: 'dates',
      cell: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.startDate} to {row.endDate}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const variants = {
          approved: 'success',
          pending: 'warning',
          rejected: 'danger'
        };
        return <Badge variant={variants[row.status] || 'default'} dot>{row.status.toUpperCase()}</Badge>;
      }
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        row.status === 'pending' ? (
          <Button size="sm" variant="outline" onClick={() => setSelectedLeave(row)}>
            Review
          </Button>
        ) : (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Reviewed</span>
        )
      )
    }
  ];

  return (
    <>
      <Card title="Company Leave Requests" subtitle="Manage employee time-off applications">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        <DataTable
          columns={columns}
          data={leaves}
          isLoading={isLoading}
        />
      </Card>
      
      <LeaveApprovalModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};

export default HRLeaveRequestsTable;

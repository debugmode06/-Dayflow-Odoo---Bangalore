import React from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';

export const LeaveHistoryTable = ({ leaves = [], isLoading }) => {
  const columns = [
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.type}</span>
    },
    {
      header: 'Dates',
      accessor: 'dates',
      cell: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.startDate} to {row.endDate}</span>
    },
    {
      header: 'Reason',
      accessor: 'reason',
      cell: (row) => <span style={{ color: 'var(--text-secondary)', maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.reason}</span>
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
      header: 'HR Comment',
      accessor: 'hrComment',
      cell: (row) => <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{row.hrComment || '-'}</span>
    }
  ];

  return (
    <Card title="Leave History" subtitle="Your past and pending requests">
      <DataTable
        columns={columns}
        data={leaves}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default LeaveHistoryTable;

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import LeaveRequestDetailsModal from './LeaveRequestDetailsModal';

export const LeaveHistoryTable = ({ leaves = [], isLoading }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const columns = [
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.type}</span>
    },
    {
      header: 'Dates',
      accessor: 'dates',
      cell: (row) => <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.startDate} to {row.endDate}</span>
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
    },
    {
      header: 'Action',
      accessor: 'id',
      cell: (row) => (
        <button 
          onClick={() => setSelectedLeave(row)}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-primary-border)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          View
        </button>
      )
    }
  ];

  const filteredLeaves = leaves.filter(leave => {
    if (statusFilter === 'All') return true;
    return leave.status === statusFilter.toLowerCase();
  });

  return (
    <Card title="Leave History" subtitle="Your past and pending requests">
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: statusFilter === filter ? 'var(--color-primary)' : 'var(--border-color)',
              backgroundColor: statusFilter === filter ? 'var(--color-primary-light)' : 'var(--bg-surface)',
              color: statusFilter === filter ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {filter}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filteredLeaves}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Search history..."
      />
      <LeaveRequestDetailsModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </Card>
  );
};

export default LeaveHistoryTable;

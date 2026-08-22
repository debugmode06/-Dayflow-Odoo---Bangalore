import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { Users } from 'lucide-react';

export const HREmployeeDirectoryPage = () => {
  const mockTableData = [
    { id: 'EMP-1001', name: 'Sarah Jenkins', department: 'Engineering', status: 'present', score: 98, role: 'Senior Developer' },
    { id: 'EMP-1002', name: 'Marcus Vance', department: 'Product', status: 'late', score: 88, role: 'Product Manager' },
    { id: 'EMP-1003', name: 'Elena Rostova', department: 'Design', status: 'on-leave', score: 95, role: 'Lead Designer' },
    { id: 'EMP-1004', name: 'David Kim', department: 'Marketing', status: 'present', score: 99, role: 'Growth Specialist' },
  ];

  const columns = [
    { header: 'Employee ID', accessor: 'id' },
    {
      header: 'Employee Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{row.role}</div>
        </div>
      ),
    },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Attendance Status',
      accessor: 'status',
      cell: (row) => {
        const variants = { present: 'success', late: 'warning', 'on-leave': 'info' };
        return <Badge variant={variants[row.status] || 'default'} dot>{row.status.toUpperCase()}</Badge>;
      },
    },
    {
      header: 'Profile Score',
      accessor: 'score',
      cell: (row) => (
        <span style={{ fontWeight: 'var(--font-weight-bold)', color: row.score >= 90 ? 'var(--color-success-text)' : 'var(--color-warning-text)' }}>
          {row.score}%
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={28} color="var(--color-primary)" />
            Employee Management Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Organization-wide staff profiles, department rosters, and employment status.
          </p>
        </div>
        <Badge variant="ai" size="md">
          HR Admin Access
        </Badge>
      </div>

      <Card title="Active Department Roster" subtitle="Organization employee attendance status & profile health">
        <DataTable columns={columns} data={mockTableData} />
      </Card>
    </div>
  );
};

export default HREmployeeDirectoryPage;

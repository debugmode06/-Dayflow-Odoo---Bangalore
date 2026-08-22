import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { Clock, UserCheck, UserMinus, AlertTriangle } from 'lucide-react';

export const HRAttendanceMonitorPage = () => {
  const attendanceLogs = [
    { id: '1', name: 'Sarah Jenkins', department: 'Engineering', checkIn: '08:58 AM', checkOut: '05:30 PM', status: 'present' },
    { id: '2', name: 'Marcus Vance', department: 'Product', checkIn: '09:35 AM', checkOut: '--', status: 'late' },
    { id: '3', name: 'Elena Rostova', department: 'Design', checkIn: '--', checkOut: '--', status: 'on-leave' },
    { id: '4', name: 'David Kim', department: 'Marketing', checkIn: '09:01 AM', checkOut: '05:15 PM', status: 'present' },
  ];

  const columns = [
    { header: 'Employee', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const variants = { present: 'success', late: 'warning', 'on-leave': 'info' };
        return <Badge variant={variants[row.status] || 'default'} dot>{row.status.toUpperCase()}</Badge>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={28} color="var(--color-primary)" />
            HR Attendance Monitor
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Daily check-in logs, punctuality tracking, and organization attendance alerts.
          </p>
        </div>
        <Badge variant="ai" size="md">
          HR Admin Access
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Present Today">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px' }}>
            42 Employees
          </div>
        </Card>
        <Card title="Late Check-Ins">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
            3 Employees
          </div>
        </Card>
        <Card title="On Leave Today">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px' }}>
            5 Employees
          </div>
        </Card>
      </div>

      <Card title="Today's Check-In Monitor" subtitle="Real-time check-in activity stream">
        <DataTable columns={columns} data={attendanceLogs} />
      </Card>
    </div>
  );
};

export default HRAttendanceMonitorPage;

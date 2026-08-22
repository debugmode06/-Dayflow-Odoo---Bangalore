import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { Clock, CheckCircle2, AlertCircle, Calendar, LogIn, LogOut } from 'lucide-react';

export const AttendanceIntelligencePage = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime] = useState('09:05 AM');

  const attendanceHistory = [
    { id: '1', date: '2026-08-22', checkIn: '09:05 AM', checkOut: '--', hours: '6h 45m (In Progress)', status: 'Present' },
    { id: '2', date: '2026-08-21', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8h 30m', status: 'Present' },
    { id: '3', date: '2026-08-20', checkIn: '09:22 AM', checkOut: '05:45 PM', hours: '8h 23m', status: 'Late' },
    { id: '4', date: '2026-08-19', checkIn: '08:55 AM', checkOut: '05:15 PM', hours: '8h 20m', status: 'Present' },
    { id: '5', date: '2026-08-18', checkIn: '09:02 AM', checkOut: '05:30 PM', hours: '8h 28m', status: 'Present' },
  ];

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Work Hours', accessor: 'hours' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const variant = row.status === 'Present' ? 'success' : row.status === 'Late' ? 'warning' : 'danger';
        return <Badge variant={variant} dot>{row.status.toUpperCase()}</Badge>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Attendance Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Daily check-in/out tracking, work hours analytics, and personal attendance history.
          </p>
        </div>
        <Badge variant={isCheckedIn ? 'success' : 'info'} size="md" dot>
          {isCheckedIn ? 'CHECKED IN TODAY' : 'NOT CHECKED IN'}
        </Badge>
      </div>

      {/* Check-In / Out Interactive Card */}
      <Card title="Today's Workday Status">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isCheckedIn ? 'var(--color-success-bg)' : 'var(--bg-surface-secondary)',
                border: `1px solid ${isCheckedIn ? 'var(--color-success-border)' : 'var(--border-color)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={24} color={isCheckedIn ? 'var(--color-success-text)' : 'var(--text-tertiary)'} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                {isCheckedIn ? `Checked in at ${checkInTime}` : 'You have not checked in yet today'}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Standard Shift: 09:00 AM – 05:30 PM (Flexible 8 Hours)
              </div>
            </div>
          </div>

          <Button
            variant={isCheckedIn ? 'outline' : 'primary'}
            size="md"
            icon={isCheckedIn ? LogOut : LogIn}
            onClick={() => setIsCheckedIn(!isCheckedIn)}
          >
            {isCheckedIn ? 'Clock Out' : 'Clock In Now'}
          </Button>
        </div>
      </Card>

      {/* Personal Attendance Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Monthly Attendance Score">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px' }}>
            96.0%
          </div>
        </Card>
        <Card title="Days Present">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px' }}>
            18 Days
          </div>
        </Card>
        <Card title="Late Arrivals">
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
            1 Day
          </div>
        </Card>
      </div>

      {/* Personal Attendance History Table */}
      <Card title="Personal Attendance History" subtitle="Your recent check-in and check-out logs for the current month">
        <DataTable columns={columns} data={attendanceHistory} />
      </Card>
    </div>
  );
};

export default AttendanceIntelligencePage;

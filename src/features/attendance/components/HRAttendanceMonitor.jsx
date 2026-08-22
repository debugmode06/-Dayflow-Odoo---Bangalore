import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import { mockHelpers } from '@/lib/demoMode';

export const HRAttendanceMonitor = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // In a real app, we'd join users and attendance on the backend.
    // For demo, we do it in memory.
    const allAttendance = mockHelpers.getCollection('attendance');
    const users = mockHelpers.getCollection('users');
    
    const enriched = allAttendance.map(att => {
      const user = users.find(u => u.uid === att.userId);
      return {
        ...att,
        employeeName: user?.name || 'Unknown',
        department: user?.department || 'Unknown'
      };
    });
    
    setAttendance(enriched);
  }, []);

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Employee', accessor: 'employeeName', cell: (row) => <div style={{ fontWeight: '500' }}>{row.employeeName}</div> },
    { header: 'Department', accessor: 'department' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut', cell: (row) => row.checkOut || '--:--:--' },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (row) => (
        <span style={{ 
          textTransform: 'capitalize', 
          color: row.status === 'late' ? 'var(--color-warning)' : 'var(--color-success)',
          fontWeight: '500'
        }}>
          {row.status}
        </span>
      ) 
    },
    { header: 'Hours', accessor: 'workingHours', cell: (row) => row.workingHours > 0 ? `${row.workingHours}h` : '--' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>HR Attendance Monitor</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Monitor daily check-ins across the organization</p>
      </div>

      <Card>
        <DataTable columns={columns} data={attendance} />
      </Card>
    </div>
  );
};

export default HRAttendanceMonitor;

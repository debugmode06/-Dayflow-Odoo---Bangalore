import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/features/auth';
import { mockHelpers } from '@/lib/demoMode';

export const AttendanceDashboard = () => {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    if (profile?.uid) {
      const records = mockHelpers.queryCollection('attendance', { userId: profile.uid });
      setAttendance(records);
      const today = new Date().toISOString().split('T')[0];
      const todaysRecord = records.find(r => r.date === today);
      if (todaysRecord && !todaysRecord.checkOut) {
        setIsCheckedIn(true);
      }
    }
  }, [profile]);

  const handleCheckInOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];
    
    if (!isCheckedIn) {
      // Check in
      const newRecord = mockHelpers.addDocument('attendance', {
        userId: profile.uid,
        date: today,
        checkIn: time,
        checkOut: null,
        status: 'present',
        workingHours: 0
      });
      setAttendance([newRecord, ...attendance]);
      setIsCheckedIn(true);
    } else {
      // Check out
      const todaysRecord = attendance.find(r => r.date === today && !r.checkOut);
      if (todaysRecord) {
        mockHelpers.updateDocument('attendance', todaysRecord.id, { checkOut: time, workingHours: 8 });
        setIsCheckedIn(false);
        const records = mockHelpers.queryCollection('attendance', { userId: profile.uid });
        setAttendance(records);
      }
    }
  };

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut', cell: (row) => row.checkOut || '--:--:--' },
    { header: 'Status', accessor: 'status', cell: (row) => <span style={{ textTransform: 'capitalize', color: row.status === 'late' ? 'var(--color-warning)' : 'var(--color-success)' }}>{row.status}</span> },
    { header: 'Hours', accessor: 'workingHours', cell: (row) => row.workingHours > 0 ? `${row.workingHours}h` : '--' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Attendance</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Track your daily check-ins and working hours</p>
        </div>
        <Button 
          variant={isCheckedIn ? 'outline' : 'primary'} 
          onClick={handleCheckInOut}
          style={isCheckedIn ? { borderColor: 'var(--color-danger)', color: 'var(--color-danger)' } : {}}
        >
          {isCheckedIn ? 'Check Out' : 'Check In Now'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Present Days">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '8px' }}>{attendance.filter(a => a.status === 'present').length}</div>
        </Card>
        <Card title="Late Arrivals">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-warning)', marginTop: '8px' }}>{attendance.filter(a => a.status === 'late').length}</div>
        </Card>
        <Card title="Average Hours">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '8px' }}>8.2h</div>
        </Card>
      </div>

      <Card title="Attendance History">
        <DataTable columns={columns} data={attendance} />
      </Card>
    </div>
  );
};

export default AttendanceDashboard;

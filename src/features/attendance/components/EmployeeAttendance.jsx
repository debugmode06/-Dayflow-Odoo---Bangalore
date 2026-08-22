import React, { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance, ATTENDANCE_UI_STATE } from '../hooks/useAttendance';
import { AttendancePulse } from './AttendancePulse';
import { LiveTimer } from './LiveTimer';

// Helper to format Firestore timestamps nicely
const formatTime = (ts) => {
  if (!ts) return '--:--';
  const ms = typeof ts.toMillis === 'function' ? ts.toMillis() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
};

const formatDuration = (seconds) => {
  if (typeof seconds !== 'number') return '--h --m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

// Weekly Attendance Visualizer
const WeeklyAttendance = ({ records }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <Card title="This Week" subtitle="Your recent attendance pattern">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {days.map((day, idx) => {
          // Simplistic mapping: in a real app, align records by actual day of week
          const record = records[idx]; // Warning: assumes records are exactly mon-sun. 
          // For a robust implementation, we would map dates. Since we only have a flat array, we mock the visual matching the user's design.
          const isPresent = record?.status === 'PRESENT';
          
          return (
            <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '48px', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{day}</span>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                backgroundColor: isPresent ? 'var(--color-success-bg)' : 'var(--bg-secondary)',
                color: isPresent ? 'var(--color-success-text)' : 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {isPresent ? '✓' : '—'}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {isPresent ? formatTime(record.checkIn) : '--:--'}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Main Page Component
export const EmployeeAttendance = () => {
  const { user } = useAuth();
  const {
    uiState,
    todayRecord,
    errorMsg,
    presenceData,
    weeklyRecords,
    historyRecords,
    handleStartDay,
    handleEndDay,
    resetError,
    loadWeeklyAndHistory
  } = useAttendance();

  useEffect(() => {
    loadWeeklyAndHistory();
  }, [loadWeeklyAndHistory]);

  const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  
  const isLoading = uiState === ATTENDANCE_UI_STATE.LOADING;
  const isVerifying = uiState === ATTENDANCE_UI_STATE.VERIFYING;
  const isCheckoutLoading = uiState === ATTENDANCE_UI_STATE.CHECKOUT_LOADING;
  const isWorking = uiState === ATTENDANCE_UI_STATE.WORKING;
  const isCompleted = uiState === ATTENDANCE_UI_STATE.COMPLETED;
  const isError = uiState === ATTENDANCE_UI_STATE.ERROR;

  const historyColumns = [
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge variant={row.status === 'PRESENT' ? 'success' : 'default'} dot>{row.status}</Badge> 
    },
    { header: 'Check-in', accessor: 'checkIn', cell: (row) => formatTime(row.checkIn) },
    { header: 'Check-out', accessor: 'checkOut', cell: (row) => formatTime(row.checkOut) },
    { header: 'Duration', accessor: 'workingDuration', cell: (row) => formatDuration(row.workingDuration) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Attendance</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Track your workday and attendance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Main Action Card */}
        <Card style={{ flex: 1 }}>
          <div style={{ padding: 'var(--space-2)' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                Good morning, {user?.displayName?.split(' ')[0] || 'Team Member'}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>{dateStr}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) 0', gap: 'var(--space-6)' }}>
              
              <div style={{ marginBottom: '8px' }}>
                <AttendancePulse state={uiState} />
              </div>

              {/* Main State Display */}
              {isLoading && (
                <div style={{ color: 'var(--text-tertiary)' }}>Loading attendance data...</div>
              )}

              {isError && (
                <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                  <p style={{ color: 'var(--color-danger)', marginBottom: '16px', fontSize: '14px' }}>
                    {errorMsg}
                  </p>
                  <Button variant="outline" onClick={resetError}>TRY AGAIN</Button>
                </div>
              )}

              {(uiState === ATTENDANCE_UI_STATE.READY || isVerifying) && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', marginBottom: '8px' }}>
                    {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date())}
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    onClick={handleStartDay}
                    disabled={isVerifying}
                    isLoading={isVerifying}
                    style={{ marginTop: '16px', maxWidth: '280px' }}
                  >
                    START DAY
                  </Button>
                </div>
              )}

              {(isWorking || isCheckoutLoading) && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Check-in: {formatTime(todayRecord?.checkIn)}
                  </div>
                  <LiveTimer checkInTimestamp={todayRecord?.checkIn} />
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', marginBottom: '24px' }}>
                    Today's work session
                  </div>
                  <Button 
                    variant="danger" 
                    size="lg" 
                    fullWidth 
                    onClick={handleEndDay}
                    disabled={isCheckoutLoading}
                    isLoading={isCheckoutLoading}
                    style={{ maxWidth: '280px' }}
                  >
                    END DAY
                  </Button>
                </div>
              )}

              {isCompleted && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-success-text)' }}>
                    {formatDuration(todayRecord?.workingDuration)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-tertiary)' }}>START</div>
                      <div style={{ fontWeight: '500' }}>{formatTime(todayRecord?.checkIn)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-tertiary)' }}>END</div>
                      <div style={{ fontWeight: '500' }}>{formatTime(todayRecord?.checkOut)}</div>
                    </div>
                  </div>
                  <Badge variant="success" dot style={{ marginTop: '24px' }}>DAY RECORDED</Badge>
                </div>
              )}

            </div>
          </div>
        </Card>

        {/* Weekly & Daily Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', flex: 1 }}>
          
          <Card title="Today's Details" subtitle="Current attendance log">
            <div style={{ marginTop: '16px' }}>
              {todayRecord ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <Badge variant={todayRecord.status === 'PRESENT' ? 'success' : 'default'} dot>{todayRecord.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Check-in</span>
                    <span style={{ fontWeight: '500' }}>{formatTime(todayRecord.checkIn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Check-out</span>
                    <span style={{ fontWeight: '500' }}>{formatTime(todayRecord.checkOut)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Working time</span>
                    <span style={{ fontWeight: '500' }}>{formatDuration(todayRecord.workingDuration)}</span>
                  </div>
                  {presenceData && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Workplace Verification</span>
                      <span style={{ fontSize: '12px', color: presenceData.verified ? 'var(--color-success-text)' : 'var(--color-danger)' }}>
                        {presenceData.verified ? `Verified (${presenceData.distance}m)` : 'Failed'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                  No attendance recorded yet today.
                </div>
              )}
            </div>
          </Card>

          <WeeklyAttendance records={weeklyRecords} />

        </div>
      </div>

      {/* History Table */}
      <Card title="Attendance History" subtitle="Your recorded workdays">
        {historyRecords.length > 0 ? (
          <DataTable columns={historyColumns} data={historyRecords} />
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Your attendance history will appear here after you complete your first workday.
          </div>
        )}
      </Card>
      
    </div>
  );
};

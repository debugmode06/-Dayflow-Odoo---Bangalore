import React, { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance, ATTENDANCE_UI_STATE } from '../hooks/useAttendance';
import { AttendancePulse } from './AttendancePulse';
import { LiveTimer } from './LiveTimer';
import { USE_LOCAL_DEV, DEV_USER, DEV_EMPLOYEES, DEV_DEPARTMENTS, HR_CONFIGURED_LOCATION } from '../dev/attendanceDataProvider';

// Local Development Mode banner — visible only when VITE_ATTENDANCE_LOCAL_DEV=true
const DevModeBanner = () => USE_LOCAL_DEV ? (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
    background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
    color: '#fff', textAlign: 'center', padding: '6px 16px',
    fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  }}>
    <span>🛠</span>
    <span>LOCAL DEVELOPMENT MODE — Multi-Employee Attendance Active ({DEV_EMPLOYEES.length} Employees)</span>
  </div>
) : null;

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

// Helper to map date string to day name abbreviation
const getDayAbbrev = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
};

// Weekly Attendance Visualizer
const WeeklyAttendance = ({ records = [] }) => {
  // Generate Mon-Sun date array for current week
  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      week.push({
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d),
        dateStr: `${yyyy}-${mm}-${dd}`,
      });
    }
    return week;
  };

  const weekDays = getWeekDates();
  const recordMap = new Map(records.map(r => [r.date, r]));

  return (
    <Card title="This Week" subtitle="Your recent attendance pattern">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {weekDays.map(({ label, dateStr }) => {
          const record = recordMap.get(dateStr);
          const isPresent = record?.status === 'PRESENT';
          const isHalfDay = record?.status === 'HALF_DAY';
          const isAbsent = record?.status === 'ABSENT';
          const isLeave = record?.status === 'LEAVE';

          let statusIcon = '—';
          let bg = 'var(--bg-secondary)';
          let color = 'var(--text-tertiary)';

          if (isPresent) {
            statusIcon = '\u2713';
            bg = 'var(--color-success-bg, #f0fdf4)';
            color = 'var(--color-success-text, #16a34a)';
          } else if (isHalfDay) {
            statusIcon = '\u00BD';
            bg = 'var(--color-warning-bg, #fffbeb)';
            color = 'var(--color-warning-text, #d97706)';
          } else if (isAbsent) {
            statusIcon = '\u2715';
            bg = 'var(--color-danger-bg, #fef2f2)';
            color = 'var(--color-danger, #dc2626)';
          } else if (isLeave) {
            statusIcon = 'L';
            bg = 'var(--color-info-bg, #eff6ff)';
            color = 'var(--color-info-text, #2563eb)';
          }

          return (
            <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '48px', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                backgroundColor: bg,
                color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '13px'
              }}>
                {statusIcon}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {record?.checkIn ? formatTime(record.checkIn) : '--:--'}
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
  const { user: authUser } = useAuth();
  // In local dev mode, use the dev user when no Firebase Auth user is present
  const user = USE_LOCAL_DEV && !authUser ? DEV_USER : authUser;
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

  const [reportFilter, setReportFilter] = React.useState('all'); // 'all' | 'weekly' | 'monthly'
  const [selectedDept, setSelectedDept] = React.useState('All Departments');
  const [selectedEmployeeUid, setSelectedEmployeeUid] = React.useState('ALL'); // 'ALL' or employee.uid

  // Dynamic list of employees filtered by selected department
  const availableEmployees = selectedDept === 'All Departments'
    ? DEV_EMPLOYEES
    : DEV_EMPLOYEES.filter(e => e.department === selectedDept);

  const getFilteredHistory = () => {
    if (!historyRecords || historyRecords.length === 0) return [];
    let records = historyRecords;

    // Filter by selected department
    if (selectedDept !== 'All Departments') {
      records = records.filter(r => r.department === selectedDept);
    }

    // Filter by selected employee
    if (selectedEmployeeUid !== 'ALL') {
      records = records.filter(r => r.userId === selectedEmployeeUid || r.employeeId === selectedEmployeeUid);
    }

    // Filter by date range (weekly / monthly)
    if (reportFilter === 'weekly') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      records = records.filter(r => r.date >= cutoffStr);
    } else if (reportFilter === 'monthly') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      records = records.filter(r => r.date >= cutoffStr);
    }

    return records;
  };

  const filteredHistory = getFilteredHistory();

  const historyColumns = [
    { 
      header: 'Employee Name', 
      accessor: 'employeeName', 
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {row.employeeName || user?.displayName || 'Priya Sharma'}
          </div>
          {row.department && (
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{row.department}</div>
          )}
        </div>
      ) 
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge variant={row.status === 'PRESENT' ? 'success' : (row.status === 'HALF_DAY' ? 'warning' : (row.status === 'LEAVE' ? 'info' : 'danger'))} dot>{row.status}</Badge> 
    },
    { header: 'Check-in', accessor: 'checkIn', cell: (row) => formatTime(row.checkIn) },
    { header: 'Check-out', accessor: 'checkOut', cell: (row) => formatTime(row.checkOut) },
    { header: 'Duration', accessor: 'workingDuration', cell: (row) => formatDuration(row.workingDuration) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%', paddingTop: USE_LOCAL_DEV ? '36px' : undefined }}>
      <DevModeBanner />
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
                  
                  {/* Location & Geofence Verification Status */}
                  <div style={{ margin: '12px 0 16px 0', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '13px' }}>
                    {presenceData ? (
                      <div>
                        <span style={{ fontWeight: 'bold', color: presenceData.verified ? 'var(--color-success-text)' : 'var(--color-danger)' }}>
                          {presenceData.verified ? `✓ ${HR_CONFIGURED_LOCATION.name} Verified` : '✕ Outside Workplace Zone'}
                        </span>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Target HR Zone: {HR_CONFIGURED_LOCATION.address} (Allowed: {HR_CONFIGURED_LOCATION.allowedRadiusMeters}m | Current Dist: {presenceData.distance}m)
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)' }}>
                        📍 HR Target: <strong>{HR_CONFIGURED_LOCATION.name}</strong> ({HR_CONFIGURED_LOCATION.allowedRadiusMeters}m radius)
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    onClick={handleStartDay}
                    disabled={isVerifying}
                    isLoading={isVerifying}
                    style={{ marginTop: '8px', maxWidth: '280px' }}
                  >
                    START DAY & CHECK IN
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
      <Card title="Attendance History & Reports" subtitle="Recorded workdays across all departments, employees, and custom period reports">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          
          {/* Department Filter Bar */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              🏢 Filter by Department:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {DEV_DEPARTMENTS.map((dept) => {
                const isActive = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedEmployeeUid('ALL'); // Reset employee selection when department changes
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid',
                      borderColor: isActive ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                      backgroundColor: isActive ? 'var(--color-primary, #3b82f6)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 2px 6px rgba(59,130,246,0.3)' : 'none',
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Row: Period Filter & Employee Dropdown */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color, #e5e7eb)', paddingTop: '12px' }}>
            
            {/* Period Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Period:</span>
              <button
                onClick={() => setReportFilter('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid',
                  borderColor: reportFilter === 'all' ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                  backgroundColor: reportFilter === 'all' ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: reportFilter === 'all' ? 'var(--color-primary, #3b82f6)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                All Dates
              </button>
              <button
                onClick={() => setReportFilter('weekly')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid',
                  borderColor: reportFilter === 'weekly' ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                  backgroundColor: reportFilter === 'weekly' ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: reportFilter === 'weekly' ? 'var(--color-primary, #3b82f6)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                📊 Weekly Report (7 Days)
              </button>
              <button
                onClick={() => setReportFilter('monthly')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid',
                  borderColor: reportFilter === 'monthly' ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                  backgroundColor: reportFilter === 'monthly' ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: reportFilter === 'monthly' ? 'var(--color-primary, #3b82f6)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                📅 Monthly Report (30 Days)
              </button>
            </div>

            {/* Employee Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Employee:</span>
              <select
                value={selectedEmployeeUid}
                onChange={(e) => setSelectedEmployeeUid(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid var(--border-color, #d1d5db)',
                  backgroundColor: 'var(--bg-primary, #ffffff)',
                  color: 'var(--text-primary, #111827)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '220px',
                }}
              >
                <option value="ALL">👥 All Employees in {selectedDept} ({availableEmployees.length})</option>
                {availableEmployees.map((emp) => (
                  <option key={emp.uid} value={emp.uid}>
                    👤 {emp.displayName} — {emp.role}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {filteredHistory.length > 0 ? (
          <DataTable columns={historyColumns} data={filteredHistory} />
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No attendance records found for this period filter.
          </div>
        )}
      </Card>

      {/* Sub-module 2 Integration Banner */}
      <Card variant="ai" title="Attendance Intelligence" subtitle="Workday metrics, scores & pattern insights">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Analyze your punctuality score, weekly trend comparison, and detected pattern signals.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/attendance-intelligence'}
          >
            VIEW INTELLIGENCE
          </Button>
        </div>
      </Card>
      
    </div>
  );
};

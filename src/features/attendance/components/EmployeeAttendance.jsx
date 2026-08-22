import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance, ATTENDANCE_UI_STATE } from '../hooks/useAttendance';
import { useAttendanceIntelligence } from '../hooks/useAttendanceIntelligence';
import { AttendancePulse } from './AttendancePulse';
import { LiveTimer } from './LiveTimer';
import {
  USE_LOCAL_DEV,
  DEV_USER,
  HR_CONFIGURED_LOCATION,
  getAttendanceDateStr,
} from '../dev/attendanceDataProvider';
import { verifyPresence, calculateDistance } from '../utils/location';
import { MapPin, Navigation, CheckCircle, XCircle, AlertTriangle, Clock, Calendar, ChevronRight, RefreshCw, User, Briefcase, Hash } from 'lucide-react';

// ─── Location status constants ────────────────────────────────────────────────
const LOC_STATUS = {
  IDLE: 'IDLE',
  CHECKING: 'CHECKING',
  VERIFIED: 'VERIFIED',
  NOT_VERIFIED: 'NOT_VERIFIED',
  UNAVAILABLE: 'UNAVAILABLE',
};

// ─── Formatting helpers ───────────────────────────────────────────────────────
const formatTime = (ts) => {
  if (!ts) return '--:--';
  const ms = typeof ts.toMillis === 'function'
    ? ts.toMillis()
    : ts.seconds
      ? ts.seconds * 1000
      : new Date(ts).getTime();
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
};

const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '--h --m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
};

// ─── Generate Mon→Sun for current week ───────────────────────────────────────
const getWeekDates = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMon);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d),
      dateStr: getAttendanceDateStr(d),
    });
  }
  return week;
};

// ─── Status badge variant helper ─────────────────────────────────────────────
const statusVariant = (status) => {
  if (!status) return 'default';
  if (status === 'PRESENT') return 'success';
  if (status === 'HALF_DAY' || status === 'LATE') return 'warning';
  if (status === 'ABSENT') return 'danger';
  if (status === 'LEAVE') return 'info';
  return 'default';
};

/* ═══════════════════════════════════════════════════════════════════════════
   WORKPLACE LOCATION VERIFICATION CARD
═══════════════════════════════════════════════════════════════════════════ */
const LocationVerificationCard = ({ locStatus, locData, onVerify }) => {
  const isChecking = locStatus === LOC_STATUS.CHECKING;
  const isVerified = locStatus === LOC_STATUS.VERIFIED;
  const isNotVerified = locStatus === LOC_STATUS.NOT_VERIFIED;
  const isUnavailable = locStatus === LOC_STATUS.UNAVAILABLE;

  const statusColor = isVerified ? '#16a34a'
    : isNotVerified ? '#dc2626'
    : isUnavailable ? '#d97706'
    : 'var(--text-secondary)';

  const statusLabel = isChecking ? '📡 CHECKING…'
    : isVerified ? '✓ VERIFIED'
    : isNotVerified ? '✕ NOT VERIFIED'
    : isUnavailable ? '⚠ LOCATION UNAVAILABLE'
    : '📍 TAP TO VERIFY';

  return (
    <Card title="Workplace Verification" subtitle="Your location must be verified to check in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>

        {/* Office Info */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <MapPin size={20} color="#84647C" style={{ marginTop: '1px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{HR_CONFIGURED_LOCATION.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{HR_CONFIGURED_LOCATION.address}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Geofence: {HR_CONFIGURED_LOCATION.allowedRadiusMeters}m radius</div>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div style={{
          padding: '10px 14px', borderRadius: '8px',
          backgroundColor: isVerified ? '#f0fdf4' : isNotVerified ? '#fef2f2' : isUnavailable ? '#fffbeb' : 'var(--bg-secondary)',
          border: `1.5px solid ${isVerified ? '#bbf7d0' : isNotVerified ? '#fecaca' : isUnavailable ? '#fef3c7' : 'var(--border-color)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: statusColor }}>{statusLabel}</span>
          {locData?.distance != null && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{locData.distance}m from office</span>
          )}
        </div>

        {/* Location Details */}
        {locData && (
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {locData.latitude && (
              <span>📌 Current: {locData.latitude.toFixed(5)}, {locData.longitude.toFixed(5)}</span>
            )}
          </div>
        )}

        {/* Unavailable message */}
        {isUnavailable && (
          <p style={{ fontSize: '12px', color: '#b45309', margin: 0 }}>
            Please enable location permissions in your browser settings to verify workplace presence.
          </p>
        )}

        {/* Verify Button */}
        {!isVerified && (
          <button
            onClick={onVerify}
            disabled={isChecking}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              backgroundColor: isChecking ? 'var(--bg-secondary)' : '#84647C',
              color: isChecking ? 'var(--text-tertiary)' : '#ffffff',
              fontWeight: '700', fontSize: '13px', cursor: isChecking ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Navigation size={14} />
            {isChecking ? 'Verifying location…' : 'Verify My Location'}
          </button>
        )}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   INTELLIGENCE SUMMARY CARD  (inline on attendance page)
═══════════════════════════════════════════════════════════════════════════ */
const IntelligenceSummaryCard = ({ employeeUid }) => {
  const navigate = useNavigate();
  const { intelligence, isLoading } = useAttendanceIntelligence('All Departments', employeeUid);

  if (isLoading) {
    return (
      <Card variant="ai" title="Attendance Intelligence" subtitle="Calculating your workday insights…">
        <div style={{ padding: '16px 0', color: 'var(--text-tertiary)', fontSize: '13px' }}>Calculating…</div>
      </Card>
    );
  }

  const m = intelligence?.metrics;
  const s = intelligence?.score;

  return (
    <Card variant="ai" title="Attendance Intelligence" subtitle="Your punctuality score and attendance metrics">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>

        {s && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Score Ring */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `conic-gradient(#84647C ${(s.score / 100) * 360}deg, var(--bg-secondary) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 4px var(--bg-surface)',
              }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#84647C' }}>{s.score}</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Score</div>
            </div>

            {/* Metrics Grid */}
            {m && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', flex: 1 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>{m.attendancePercentage ?? 0}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Attendance</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{m.onTimePercentage ?? 0}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>On-time</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>{m.lateCount ?? 0}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Late</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{m.absentCount ?? 0}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Absent</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{m.halfDayCount ?? 0}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Half-day</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>{m.presentCount ?? 0}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Present</div>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/attendance-intelligence')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px', border: 'none',
            backgroundColor: '#84647C', color: '#ffffff',
            fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(132,100,124,0.35)',
          }}
        >
          VIEW ATTENDANCE INTELLIGENCE
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   WEEKLY ATTENDANCE VISUALIZER
═══════════════════════════════════════════════════════════════════════════ */
const WeeklyAttendanceCard = ({ records = [] }) => {
  const weekDays = getWeekDates();
  const recordMap = new Map(records.map(r => [r.date, r]));

  return (
    <Card title="This Week's Attendance" subtitle="Monday → Sunday — your daily status">
      {/* Circle row */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {weekDays.map(({ label, dateStr }) => {
          const rec = recordMap.get(dateStr);
          const isPresent = rec?.status === 'PRESENT';
          const isHalfDay = rec?.status === 'HALF_DAY';
          const isAbsent = rec?.status === 'ABSENT';
          const isLeave = rec?.status === 'LEAVE';

          let icon = '—', bg = 'var(--bg-secondary)', col = 'var(--text-tertiary)';
          if (isPresent) { icon = '✓'; bg = '#f0fdf4'; col = '#16a34a'; }
          else if (isHalfDay) { icon = '½'; bg = '#fffbeb'; col = '#d97706'; }
          else if (isAbsent) { icon = '✕'; bg = '#fef2f2'; col = '#dc2626'; }
          else if (isLeave) { icon = 'L'; bg = '#eff6ff'; col = '#2563eb'; }

          return (
            <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '44px', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{label}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                {icon}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {rec?.checkIn ? formatTime(rec.checkIn) : '--:--'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed table */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ color: 'var(--text-tertiary)' }}>
              {['Day', 'Date', 'Status', 'Check-in', 'Check-out', 'Duration'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '4px 8px', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekDays.map(({ label, dateStr }) => {
              const rec = recordMap.get(dateStr);
              return (
                <tr key={dateStr} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '6px 8px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-tertiary)' }}>{formatDate(dateStr)}</td>
                  <td style={{ padding: '6px 8px' }}>
                    {rec ? <Badge variant={statusVariant(rec.status)} dot>{rec.status}</Badge> : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </td>
                  <td style={{ padding: '6px 8px' }}>{rec?.checkIn ? formatTime(rec.checkIn) : '—'}</td>
                  <td style={{ padding: '6px 8px' }}>{rec?.checkOut ? formatTime(rec.checkOut) : '—'}</td>
                  <td style={{ padding: '6px 8px' }}>{rec?.workingDuration ? formatDuration(rec.workingDuration) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EMPLOYEE ATTENDANCE PAGE
═══════════════════════════════════════════════════════════════════════════ */
export const EmployeeAttendance = () => {
  const { user: authUser } = useAuth();
  const user = USE_LOCAL_DEV && !authUser ? DEV_USER : authUser;
  const navigate = useNavigate();

  // Attendance hook
  const {
    uiState,
    todayRecord,
    errorMsg,
    weeklyRecords,
    historyRecords,
    handleStartDay,
    handleEndDay,
    resetError,
    resetToday,
    loadWeeklyAndHistory,
  } = useAttendance();

  // Location state (independent from attendance hook)
  const [locStatus, setLocStatus] = useState(LOC_STATUS.IDLE);
  const [locData, setLocData] = useState(null);

  const verifyLocation = useCallback(async () => {
    setLocStatus(LOC_STATUS.CHECKING);
    setLocData(null);

    if (USE_LOCAL_DEV) {
      // Auto-verify in local dev mode (42m simulated distance)
      await new Promise(r => setTimeout(r, 600));
      setLocData({ verified: true, distance: 42, latitude: HR_CONFIGURED_LOCATION.latitude, longitude: HR_CONFIGURED_LOCATION.longitude });
      setLocStatus(LOC_STATUS.VERIFIED);
      return;
    }

    const result = await verifyPresence(HR_CONFIGURED_LOCATION);
    setLocData(result);

    if (result.error) {
      setLocStatus(LOC_STATUS.UNAVAILABLE);
    } else if (result.verified) {
      setLocStatus(LOC_STATUS.VERIFIED);
    } else {
      setLocStatus(LOC_STATUS.NOT_VERIFIED);
    }
  }, []);

  // Auto-run location check on mount
  useEffect(() => {
    verifyLocation();
  }, [verifyLocation]);

  useEffect(() => {
    loadWeeklyAndHistory();
  }, [loadWeeklyAndHistory]);

  // Filter weekly records to current user only
  const myWeeklyRecords = weeklyRecords.filter(r =>
    r.userId === user?.uid || r.employeeId === user?.employeeId
  );

  // Filter history to current user only — NO department/employee selectors on employee page
  const myHistoryRecords = historyRecords.filter(r =>
    r.userId === user?.uid || r.employeeId === user?.employeeId
  );

  const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const isLoading = uiState === ATTENDANCE_UI_STATE.LOADING;
  const isVerifying = uiState === ATTENDANCE_UI_STATE.VERIFYING;
  const isWorking = uiState === ATTENDANCE_UI_STATE.WORKING;
  const isCheckoutLoading = uiState === ATTENDANCE_UI_STATE.CHECKOUT_LOADING;
  const isCompleted = uiState === ATTENDANCE_UI_STATE.COMPLETED;
  const isError = uiState === ATTENDANCE_UI_STATE.ERROR;
  const isReady = uiState === ATTENDANCE_UI_STATE.READY;

  const isLocVerified = locStatus === LOC_STATUS.VERIFIED;

  // History table columns — employee sees only their own, no employee/department columns
  const historyColumns = [
    { header: 'Date', accessor: 'date', cell: (row) => formatDate(row.date) },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge variant={statusVariant(row.status)} dot>{row.status}</Badge>,
    },
    { header: 'Check-in', accessor: 'checkIn', cell: (row) => formatTime(row.checkIn) },
    { header: 'Check-out', accessor: 'checkOut', cell: (row) => formatTime(row.checkOut) },
    { header: 'Duration', accessor: 'workingDuration', cell: (row) => formatDuration(row.workingDuration) },
    {
      header: 'Verification',
      accessor: 'verificationStatus',
      cell: (row) => (
        <Badge variant={row.verificationStatus === 'VERIFIED' ? 'success' : 'default'}>
          {row.verificationStatus === 'VERIFIED' ? '✓ Verified' : (row.verificationStatus || 'N/A')}
        </Badge>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

      {/* Dev Banner */}
      {USE_LOCAL_DEV && (
        <div style={{
          padding: '6px 16px', borderRadius: '8px',
          background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
          color: '#fff', fontSize: '12px', fontWeight: '600', textAlign: 'center',
        }}>
          🛠 LOCAL DEVELOPMENT MODE — Priya Sharma / EMP001 / Engineering
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
          My Attendance
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Track your workday, check-in, check-out, and attendance history.
        </p>
      </div>

      {/* ── Row 1: Employee Info + Location Verification ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>

        {/* Employee Information Card */}
        <Card title="Employee Information" subtitle="Your profile for today">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                backgroundColor: '#84647C', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 'bold', flexShrink: 0,
              }}>
                {(user?.displayName || 'P').charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-primary)' }}>
                  {user?.displayName || 'Priya Sharma'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {user?.role || 'Senior Frontend Engineer'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={14} color="var(--text-tertiary)" />
                <span style={{ color: 'var(--text-secondary)' }}>Employee ID:</span>
                <strong>{user?.employeeId || 'EMP001'}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={14} color="var(--text-tertiary)" />
                <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
                <strong>{user?.department || 'Engineering'}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="var(--text-tertiary)" />
                <span style={{ color: 'var(--text-secondary)' }}>Today:</span>
                <strong>{dateStr}</strong>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Verification Card */}
        <LocationVerificationCard
          locStatus={locStatus}
          locData={locData}
          onVerify={verifyLocation}
        />
      </div>

      {/* ── Row 2: Main Action Card + Today's Details ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>

        {/* Main Action Card */}
        <Card>
          <div style={{ padding: 'var(--space-2)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.displayName?.split(' ')[0] || 'Priya'}!
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-8) 0', gap: 'var(--space-4)' }}>
              <div style={{ marginBottom: '8px' }}>
                <AttendancePulse state={uiState} />
              </div>

              {/* LOADING */}
              {isLoading && (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                  <RefreshCw size={16} style={{ marginRight: '6px', display: 'inline' }} />
                  Loading attendance data...
                </div>
              )}

              {/* ERROR */}
              {isError && (
                <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                  <AlertTriangle size={32} color="#dc2626" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: 'var(--color-danger, #dc2626)', marginBottom: '16px', fontSize: '13px' }}>
                    {errorMsg || 'Unable to load attendance.'}
                  </p>
                  <Button variant="outline" onClick={resetError}>TRY AGAIN</Button>
                </div>
              )}

              {/* READY — Start Day */}
              {(isReady || (isVerifying && !isWorking)) && !isError && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date())}
                  </div>

                  {!isLocVerified && (
                    <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', fontSize: '12px', color: '#b45309' }}>
                      ⚠️ Please verify your location first before starting your day.
                    </div>
                  )}

                  <button
                    onClick={handleStartDay}
                    disabled={isVerifying || !isLocVerified}
                    style={{
                      width: '100%', maxWidth: '300px', padding: '16px 28px', borderRadius: '12px',
                      border: 'none', fontWeight: '800', fontSize: '16px', letterSpacing: '0.04em',
                      cursor: isVerifying || !isLocVerified ? 'not-allowed' : 'pointer',
                      backgroundColor: isLocVerified ? '#16a34a' : '#d1d5db',
                      color: '#ffffff',
                      boxShadow: isLocVerified ? '0 4px 16px rgba(22,163,74,0.4)' : 'none',
                      transition: 'all 0.25s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    }}
                  >
                    {isVerifying ? '⏳ Verifying…' : '✅ CHECK IN'}
                  </button>

                  {myHistoryRecords.length === 0 && !todayRecord && (
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                      No attendance recorded yet today.
                    </p>
                  )}
                </div>
              )}

              {/* WORKING */}
              {(isWorking || isCheckoutLoading) && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <Badge variant="success" dot style={{ marginBottom: '12px', fontSize: '13px', padding: '6px 16px' }}>WORKING</Badge>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Checked in at: <strong>{formatTime(todayRecord?.checkIn)}</strong>
                  </div>
                  <LiveTimer checkInTimestamp={todayRecord?.checkIn} />
                  <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', marginBottom: '8px' }}>
                    ✓ Workplace Verified
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '20px' }}>Today's work session in progress</div>
                  <button
                    onClick={handleEndDay}
                    disabled={isCheckoutLoading}
                    style={{
                      width: '100%', maxWidth: '300px', padding: '16px 28px', borderRadius: '12px',
                      border: 'none', fontWeight: '800', fontSize: '16px', letterSpacing: '0.04em',
                      cursor: isCheckoutLoading ? 'not-allowed' : 'pointer',
                      backgroundColor: '#dc2626', color: '#ffffff',
                      boxShadow: '0 4px 16px rgba(220,38,38,0.4)',
                      transition: 'all 0.25s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    }}
                  >
                    {isCheckoutLoading ? '⏳ Checking out…' : '🔴 CHECK OUT'}
                  </button>
                </div>
              )}

              {/* COMPLETED */}
              {isCompleted && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <Badge variant="success" dot style={{ marginBottom: '12px', fontSize: '13px', padding: '6px 16px' }}>DAY RECORDED</Badge>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#16a34a', marginBottom: '12px' }}>
                    {formatDuration(todayRecord?.workingDuration)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-tertiary)' }}>CHECK-IN</div>
                      <div style={{ fontWeight: '600' }}>{formatTime(todayRecord?.checkIn)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-tertiary)' }}>CHECK-OUT</div>
                      <div style={{ fontWeight: '600' }}>{formatTime(todayRecord?.checkOut)}</div>
                    </div>
                  </div>

                  {/* Dev mode: Reset button to re-test the flow */}
                  {USE_LOCAL_DEV && (
                    <button
                      onClick={resetToday}
                      style={{
                        marginTop: '20px', padding: '8px 20px', borderRadius: '8px',
                        border: '1.5px dashed #84647C', backgroundColor: 'transparent',
                        color: '#84647C', fontWeight: '600', fontSize: '12px',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      🔄 Reset Today (Dev Mode — Re-test CHECK IN / CHECK OUT)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Today's Attendance Details Card */}
        <Card title="Today's Attendance" subtitle="Current attendance log">
          <div style={{ marginTop: '16px' }}>
            {todayRecord ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <Badge variant={todayRecord.checkOut ? 'success' : 'info'} dot>
                    {todayRecord.checkOut ? 'PRESENT' : 'WORKING'}
                  </Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Check-in</span>
                  <span style={{ fontWeight: '600' }}>{formatTime(todayRecord.checkIn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Check-out</span>
                  <span style={{ fontWeight: '600' }}>{todayRecord.checkOut ? formatTime(todayRecord.checkOut) : '--:--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Working Duration</span>
                  <span style={{ fontWeight: '600' }}>{todayRecord.workingDuration ? formatDuration(todayRecord.workingDuration) : '--h --m'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Verification</span>
                  <Badge variant={todayRecord.verificationStatus === 'VERIFIED' ? 'success' : 'default'}>
                    {todayRecord.verificationStatus === 'VERIFIED' ? '✓ Verified' : 'N/A'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status</span><span style={{ color: 'var(--text-tertiary)' }}>NOT STARTED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Check-in</span><span style={{ color: 'var(--text-tertiary)' }}>--</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Check-out</span><span style={{ color: 'var(--text-tertiary)' }}>--</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Duration</span><span style={{ color: 'var(--text-tertiary)' }}>--</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Weekly Attendance ── */}
      <WeeklyAttendanceCard records={myWeeklyRecords} />

      {/* ── Attendance History (own records only) ── */}
      <Card
        title="Attendance History"
        subtitle={`Your personal attendance records — ${myHistoryRecords.length} entries`}
      >
        {myHistoryRecords.length > 0 ? (
          <DataTable columns={historyColumns} data={myHistoryRecords} />
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No attendance records found.
          </div>
        )}
      </Card>

      {/* ── Attendance Intelligence Summary ── */}
      <IntelligenceSummaryCard employeeUid={user?.uid || 'dev-user-1'} />

    </div>
  );
};

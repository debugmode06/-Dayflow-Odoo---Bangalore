import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/hooks/useAuth';
import {
  getAttendanceHistory,
  DEV_EMPLOYEES,
  DEV_DEPARTMENTS,
  HR_CONFIGURED_LOCATION,
  USE_LOCAL_DEV,
  DEV_USER,
  getAttendanceDateStr,
} from '../dev/attendanceDataProvider';
import { calculateAttendanceMetrics, compareMetrics } from '../intelligence/attendanceMetrics';
import { calculateAttendanceScore } from '../intelligence/scoreCalculator';
import { detectPatterns } from '../intelligence/patternDetector';
import { IntelligenceScore } from './intelligence/IntelligenceScore';
import { IntelligenceMetrics } from './intelligence/IntelligenceMetrics';
import { WeeklyComparison } from './intelligence/WeeklyComparison';
import { PatternInsights } from './intelligence/PatternInsights';
import { Users, CheckCircle2, XCircle, Clock, AlertTriangle, Calendar, ShieldCheck, MapPin, Search, RefreshCw, Filter, ChevronRight } from 'lucide-react';

// ─── Time formatting helpers ──────────────────────────────────────────────────
const formatTime = (ts) => {
  if (!ts) return '--:--';
  const ms = typeof ts.toMillis === 'function' ? ts.toMillis() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
};

const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '--h --m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

// ─── Dynamic Monday → Sunday week generator ──────────────────────────────────
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

/* ─────────────────────────────────────────────────────────
   HR ATTENDANCE DASHBOARD COMPONENT
───────────────────────────────────────────────────────── */
export const HRAttendance = () => {
  const { user: authUser } = useAuth();
  const user = USE_LOCAL_DEV && !authUser ? DEV_USER : authUser;

  // ─── Component State ────────────────────────────────────────────────────────
  const [allRecords, setAllRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Present' | 'Working' | 'Late' | 'Half Day' | 'Absent' | 'Leave'
  const [selectedDateRange, setSelectedDateRange] = useState('This Month'); // 'Today' | 'This Week' | 'This Month' | 'All Dates'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('ALL'); // 'ALL' or employeeId

  // Fetch all workforce records
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const now = new Date();
      const endStr = getAttendanceDateStr(now);
      const records = await getAttendanceHistory('ALL', { endDate: endStr, allEmployees: true });
      setAllRecords(records || []);
    } catch (err) {
      console.error('Failed to load workforce attendance:', err);
      setIsError(true);
      setErrorMsg(err.message || 'Unable to load workforce attendance.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Today's date string
  const todayStr = useMemo(() => getAttendanceDateStr(new Date()), []);

  // ─── Filter Calculations ────────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    if (!allRecords) return [];
    let result = [...allRecords];

    // Filter by Employee Selector
    if (selectedEmployeeId !== 'ALL') {
      result = result.filter(r => r.employeeId === selectedEmployeeId || r.userId === selectedEmployeeId);
    }

    // Filter by Department
    if (selectedDepartment !== 'All Departments') {
      result = result.filter(r => r.department === selectedDepartment);
    }

    // Filter by Status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Late') {
        result = result.filter(r => {
          if (r.status !== 'PRESENT') return false;
          if (!r.checkIn) return false;
          const d = typeof r.checkIn.toDate === 'function' ? r.checkIn.toDate() : new Date(r.checkIn);
          const mins = d.getHours() * 60 + d.getMinutes();
          return mins > 555; // 09:15 AM
        });
      } else {
        const statusMap = {
          'Present': 'PRESENT',
          'Working': 'PRESENT',
          'Half Day': 'HALF_DAY',
          'Absent': 'ABSENT',
          'Leave': 'LEAVE',
        };
        const targetStatus = statusMap[selectedStatus] || selectedStatus.toUpperCase();
        result = result.filter(r => r.status === targetStatus);
      }
    }

    // Filter by Date Range
    const now = new Date();
    if (selectedDateRange === 'Today') {
      result = result.filter(r => r.date === todayStr);
    } else if (selectedDateRange === 'This Week') {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);
      const cutoffStr = getAttendanceDateStr(cutoff);
      result = result.filter(r => r.date >= cutoffStr);
    } else if (selectedDateRange === 'This Month') {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      const cutoffStr = getAttendanceDateStr(cutoff);
      result = result.filter(r => r.date >= cutoffStr);
    }

    // Search filter (Employee Name or ID)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        (r.employeeName && r.employeeName.toLowerCase().includes(term)) ||
        (r.employeeId && r.employeeId.toLowerCase().includes(term))
      );
    }

    return result;
  }, [allRecords, selectedEmployeeId, selectedDepartment, selectedStatus, selectedDateRange, searchTerm, todayStr]);

  // ─── Scope Records for Overview Cards Calculations ─────────────────────────
  const scopeRecords = useMemo(() => {
    if (!allRecords) return [];
    let base = [...allRecords];

    if (selectedEmployeeId !== 'ALL') {
      base = base.filter(r => r.employeeId === selectedEmployeeId || r.userId === selectedEmployeeId);
    }
    if (selectedDepartment !== 'All Departments') {
      base = base.filter(r => r.department === selectedDepartment);
    }
    if (selectedDateRange === 'Today') {
      base = base.filter(r => r.date === todayStr);
    } else if (selectedDateRange === 'This Week') {
      const cutoff = new Date();
      cutoff.setDate(new Date().getDate() - 7);
      const cutoffStr = getAttendanceDateStr(cutoff);
      base = base.filter(r => r.date >= cutoffStr);
    } else if (selectedDateRange === 'This Month') {
      const cutoff = new Date();
      cutoff.setDate(new Date().getDate() - 30);
      const cutoffStr = getAttendanceDateStr(cutoff);
      base = base.filter(r => r.date >= cutoffStr);
    }
    return base;
  }, [allRecords, selectedEmployeeId, selectedDepartment, selectedDateRange, todayStr]);

  // ─── Dynamically Calculated Overview Metrics ────────────────────────────────
  const overviewMetrics = useMemo(() => {
    const totalEmp = selectedDepartment === 'All Departments'
      ? DEV_EMPLOYEES.length
      : DEV_EMPLOYEES.filter(e => e.department === selectedDepartment).length;

    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let leave = 0;

    scopeRecords.forEach(r => {
      if (r.status === 'PRESENT') {
        present++;
        if (r.checkIn) {
          const d = typeof r.checkIn.toDate === 'function' ? r.checkIn.toDate() : new Date(r.checkIn);
          const mins = d.getHours() * 60 + d.getMinutes();
          if (mins > 555) late++;
        }
      } else if (r.status === 'ABSENT') {
        absent++;
      } else if (r.status === 'HALF_DAY') {
        halfDay++;
      } else if (r.status === 'LEAVE') {
        leave++;
      }
    });

    const eligible = scopeRecords.length || 1;
    const attPct = Math.round(((present + halfDay * 0.5) / eligible) * 100);

    return {
      totalEmployees: totalEmp,
      present,
      absent,
      late,
      halfDay,
      leave,
      attendancePercentage: isNaN(attPct) ? 0 : attPct,
    };
  }, [scopeRecords, selectedDepartment]);

  // ─── Selected Employee Details ──────────────────────────────────────────────
  const selectedEmployeeObj = useMemo(() => {
    if (selectedEmployeeId === 'ALL') return null;
    return DEV_EMPLOYEES.find(e => e.employeeId === selectedEmployeeId || e.uid === selectedEmployeeId);
  }, [selectedEmployeeId]);

  const selectedEmployeeRecords = useMemo(() => {
    if (!selectedEmployeeObj) return [];
    return allRecords.filter(r => r.employeeId === selectedEmployeeObj.employeeId || r.userId === selectedEmployeeObj.uid);
  }, [allRecords, selectedEmployeeObj]);

  const selectedEmployeeToday = useMemo(() => {
    return selectedEmployeeRecords.find(r => r.date === todayStr);
  }, [selectedEmployeeRecords, todayStr]);

  const selectedEmployeeSummary = useMemo(() => {
    if (!selectedEmployeeRecords.length) return null;
    return calculateAttendanceMetrics(selectedEmployeeRecords);
  }, [selectedEmployeeRecords]);

  // ─── Attendance Intelligence Calculation ──────────────────────────────────
  const intelligenceData = useMemo(() => {
    const dataset = allRecords || [];
    let recordsToAnalyze = dataset;

    if (selectedEmployeeObj && selectedEmployeeRecords.length > 0) {
      recordsToAnalyze = selectedEmployeeRecords;
    } else if (filteredRecords && filteredRecords.length > 0) {
      recordsToAnalyze = filteredRecords;
    } else if (scopeRecords && scopeRecords.length > 0) {
      recordsToAnalyze = scopeRecords;
    }

    const curMetrics = calculateAttendanceMetrics(recordsToAnalyze);
    const scoreData = calculateAttendanceScore(curMetrics);
    const comparison = compareMetrics(curMetrics, curMetrics);
    const patterns = detectPatterns(comparison, curMetrics);

    return {
      metrics: curMetrics,
      score: scoreData,
      comparison,
      patterns,
    };
  }, [selectedEmployeeObj, selectedEmployeeRecords, filteredRecords, scopeRecords, allRecords]);

  // ─── Table Columns Configuration ───────────────────────────────────────────
  const workforceColumns = [
    {
      header: 'Employee Name',
      accessor: 'employeeName',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: '#84647C', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '13px', flexShrink: 0
          }}>
            {(row.employeeName || 'E').charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.employeeName || 'Employee'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{row.role || 'Staff'}</div>
          </div>
        </div>
      ),
    },
    { header: 'Employee ID', accessor: 'employeeId' },
    {
      header: 'Department',
      accessor: 'department',
      cell: (row) => <Badge variant="info">{row.department || 'General'}</Badge>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let variant = 'default';
        if (row.status === 'PRESENT') variant = 'success';
        else if (row.status === 'HALF_DAY' || row.status === 'LATE') variant = 'warning';
        else if (row.status === 'ABSENT') variant = 'danger';
        else if (row.status === 'LEAVE') variant = 'info';
        return <Badge variant={variant} dot>{row.status}</Badge>;
      },
    },
    { header: 'Check-in', accessor: 'checkIn', cell: (row) => formatTime(row.checkIn) },
    { header: 'Check-out', accessor: 'checkOut', cell: (row) => formatTime(row.checkOut) },
    { header: 'Working Duration', accessor: 'workingDuration', cell: (row) => formatDuration(row.workingDuration) },
    {
      header: 'Workplace Verification',
      accessor: 'verificationStatus',
      cell: (row) => (
        <Badge variant={row.verificationStatus === 'VERIFIED' ? 'success' : 'default'}>
          {row.verificationStatus === 'VERIFIED' ? '✓ Verified' : (row.verificationStatus || 'Unavailable')}
        </Badge>
      ),
    },
  ];

  // Clear filters action
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All Departments');
    setSelectedStatus('All');
    setSelectedDateRange('This Month');
    setSelectedEmployeeId('ALL');
  };

  // Loading view
  if (isLoading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: '#84647C' }} />
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Loading workforce attendance...</h2>
      </div>
    );
  }

  // Error view
  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-danger)' }}>
        <AlertTriangle size={40} style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Unable to load workforce attendance.</h2>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>{errorMsg}</p>
        <Button variant="primary" onClick={loadData} style={{ marginTop: '16px' }}>Retry</Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Page Header ── */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
          Attendance Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Monitor workforce attendance, punctuality and working hours.
        </p>
      </div>

      {/* ── 1. CLICKABLE ATTENDANCE OVERVIEW CARDS ── */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          💡 Click any overview card below to instantly filter workforce records:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
          
          {/* Card 1: Total Employees */}
          <div
            onClick={() => { setSelectedStatus('All'); setSelectedEmployeeId('ALL'); }}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'All' ? '#84647C' : 'var(--border-color)',
              borderLeft: '4px solid #84647C', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'All' ? '0 4px 12px rgba(132, 100, 124, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Employees</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--text-primary)' }}>
              {overviewMetrics.totalEmployees}
            </div>
          </div>

          {/* Card 2: Present */}
          <div
            onClick={() => setSelectedStatus('Present')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'Present' ? '#16a34a' : 'var(--border-color)',
              borderLeft: '4px solid #16a34a', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'Present' ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Present</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#16a34a' }}>
              {overviewMetrics.present}
            </div>
          </div>

          {/* Card 3: Absent */}
          <div
            onClick={() => setSelectedStatus('Absent')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'Absent' ? '#dc2626' : 'var(--border-color)',
              borderLeft: '4px solid #dc2626', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'Absent' ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Absent</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#dc2626' }}>
              {overviewMetrics.absent}
            </div>
          </div>

          {/* Card 4: Late */}
          <div
            onClick={() => setSelectedStatus('Late')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'Late' ? '#d97706' : 'var(--border-color)',
              borderLeft: '4px solid #d97706', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'Late' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Late</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#d97706' }}>
              {overviewMetrics.late}
            </div>
          </div>

          {/* Card 5: Half Day */}
          <div
            onClick={() => setSelectedStatus('Half Day')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'Half Day' ? '#f59e0b' : 'var(--border-color)',
              borderLeft: '4px solid #f59e0b', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'Half Day' ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Half Day</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#f59e0b' }}>
              {overviewMetrics.halfDay}
            </div>
          </div>

          {/* Card 6: On Leave */}
          <div
            onClick={() => setSelectedStatus('Leave')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: selectedStatus === 'Leave' ? '#2563eb' : 'var(--border-color)',
              borderLeft: '4px solid #2563eb', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selectedStatus === 'Leave' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>On Leave</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#2563eb' }}>
              {overviewMetrics.leave}
            </div>
          </div>

          {/* Card 7: Attendance % */}
          <div
            onClick={() => setSelectedStatus('All')}
            style={{
              padding: '16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid', borderColor: 'var(--border-color)',
              borderLeft: '4px solid #8b5cf6', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Attendance %</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#8b5cf6' }}>
              {overviewMetrics.attendancePercentage}%
            </div>
          </div>

        </div>
      </div>

      {/* ── 9. LATE & ABSENCE MONITORING ALERTS ── */}
      <Card title="Attendance Alerts & Monitoring" subtitle="Real-time punctuality signals and absence alerts">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
          <div
            onClick={() => setSelectedStatus('Late')}
            style={{ padding: '14px 16px', borderRadius: '8px', backgroundColor: 'var(--color-warning-bg, #fffbeb)', border: '1px solid var(--color-warning-border, #fef3c7)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-warning-text, #d97706)', fontWeight: '700' }}>⚠️ LATE ARRIVALS</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#d97706' }}>{overviewMetrics.late} Infractions</div>
          </div>
          <div
            onClick={() => setSelectedStatus('Absent')}
            style={{ padding: '14px 16px', borderRadius: '8px', backgroundColor: 'var(--color-danger-bg, #fef2f2)', border: '1px solid var(--color-danger-border, #fecaca)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-danger, #dc2626)', fontWeight: '700' }}>🚨 ABSENCES</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#dc2626' }}>{overviewMetrics.absent} Infractions</div>
          </div>
          <div
            onClick={() => setSelectedStatus('Half Day')}
            style={{ padding: '14px 16px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #fde68a', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '12px', color: '#b45309', fontWeight: '700' }}>⏳ HALF DAYS</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: '#b45309' }}>{overviewMetrics.halfDay} Recorded</div>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>📈 REPEATED LATE PATTERNS</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: 'var(--text-primary)' }}>1 Pattern Detected</div>
          </div>
        </div>
      </Card>

      {/* ── 3 & 4. SEARCH & FILTERS BAR ── */}
      <Card variant="default">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Row: Search + Employee Selector */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search by Employee name or Employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-color, #d1d5db)',
                  fontSize: '13px',
                }}
              />
            </div>

            {/* Employee Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Employee:</span>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #84647C',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '220px',
                }}
              >
                <option value="ALL">👥 All Employees ({DEV_EMPLOYEES.length})</option>
                {DEV_EMPLOYEES.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    👤 {emp.displayName} ({emp.employeeId} - {emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom Row: Department, Status, Date Filters + Clear */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            
            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '500' }}
              >
                {DEV_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status Filter:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '500' }}
              >
                {['All', 'Present', 'Working', 'Late', 'Half Day', 'Absent', 'Leave'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Date Range:</span>
              {['Today', 'This Week', 'This Month', 'All Dates'].map((dt) => (
                <button
                  key={dt}
                  onClick={() => setSelectedDateRange(dt)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid',
                    borderColor: selectedDateRange === dt ? '#84647C' : 'var(--border-color)',
                    backgroundColor: selectedDateRange === dt ? '#84647C' : 'transparent',
                    color: selectedDateRange === dt ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {dt}
                </button>
              ))}
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '8px',
                backgroundColor: '#84647C', color: '#ffffff',
                border: 'none', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(132,100,124,0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={14} />
              Clear All Filters
            </button>
          </div>

        </div>
      </Card>

      {/* ── 5 & 6. INDIVIDUAL EMPLOYEE ATTENDANCE DETAILS SECTION (When an Employee is Selected) ── */}
      {selectedEmployeeObj && (
        <Card title="EMPLOYEE ATTENDANCE" subtitle={`Detailed profile, summary & weekly visualizer for ${selectedEmployeeObj.displayName}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Employee Bio Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#84647C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                {selectedEmployeeObj.displayName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{selectedEmployeeObj.displayName}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  ID: <strong>{selectedEmployeeObj.employeeId}</strong> | Department: <strong>{selectedEmployeeObj.department}</strong> | Role: {selectedEmployeeObj.role}
                </div>
              </div>
            </div>

            {/* Today's Status & Attendance Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              
              {/* Today's Attendance Box */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Today's Attendance ({todayStr})
                </div>
                {selectedEmployeeToday ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                      <Badge variant={selectedEmployeeToday.status === 'PRESENT' ? 'success' : 'warning'} dot>{selectedEmployeeToday.status}</Badge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Check-in:</span>
                      <span style={{ fontWeight: '600' }}>{formatTime(selectedEmployeeToday.checkIn)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Check-out:</span>
                      <span style={{ fontWeight: '600' }}>{formatTime(selectedEmployeeToday.checkOut)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Working Duration:</span>
                      <span style={{ fontWeight: '600' }}>{formatDuration(selectedEmployeeToday.workingDuration)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Verification:</span>
                      <Badge variant="success">✓ {selectedEmployeeToday.verificationStatus || 'Verified'}</Badge>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>
                    No check-in record for today yet.
                  </div>
                )}
              </div>

              {/* Attendance Summary Metrics Box */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  ATTENDANCE SUMMARY (30 Days)
                </div>
                {selectedEmployeeSummary ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Present Days</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>{selectedEmployeeSummary.presentCount}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Late Days</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>{selectedEmployeeSummary.lateCount}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Absent Days</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{selectedEmployeeSummary.absentCount}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Half Days</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{selectedEmployeeSummary.halfDayCount}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Leave Days</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{selectedEmployeeSummary.leaveCount}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Attendance %</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>{selectedEmployeeSummary.attendancePercentage}%</div>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>

            {/* 7. WEEKLY ATTENDANCE VISUALIZER (Mon -> Sun) */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
                WEEKLY ATTENDANCE (Current Week Mon–Sun)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: '4px' }}>
                {getWeekDates().map(({ label, dateStr }) => {
                  const rec = selectedEmployeeRecords.find(r => r.date === dateStr);
                  const isPresent = rec?.status === 'PRESENT';
                  const isHalfDay = rec?.status === 'HALF_DAY';
                  const isAbsent = rec?.status === 'ABSENT';
                  const isLeave = rec?.status === 'LEAVE';

                  let bg = 'var(--bg-secondary)';
                  let color = 'var(--text-tertiary)';
                  let symbol = '—';

                  if (isPresent) { bg = '#f0fdf4'; color = '#16a34a'; symbol = '✓'; }
                  else if (isHalfDay) { bg = '#fffbeb'; color = '#d97706'; symbol = '½'; }
                  else if (isAbsent) { bg = '#fef2f2'; color = '#dc2626'; symbol = '✕'; }
                  else if (isLeave) { bg = '#eff6ff'; color = '#2563eb'; symbol = 'L'; }

                  return (
                    <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '54px', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {symbol}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{rec?.checkIn ? formatTime(rec.checkIn) : '--:--'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </Card>
      )}

      {/* ── 2 & 8. TODAY'S WORKFORCE & HISTORICAL ATTENDANCE TABLE ── */}
      <Card
        title={`Attendance History (${selectedDateRange}) — ${filteredRecords.length} Records`}
        subtitle="Workforce check-in logs, duration and workplace verification"
      >
        {filteredRecords.length > 0 ? (
          <DataTable columns={workforceColumns} data={filteredRecords} />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: '15px', fontWeight: '500' }}>No attendance records found for active filters.</p>
            <button
              onClick={handleClearFilters}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginTop: '14px', padding: '9px 22px', borderRadius: '8px',
                backgroundColor: '#84647C', color: '#ffffff',
                border: 'none', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(132,100,124,0.35)',
              }}
            >
              <RefreshCw size={14} />
              Clear All Filters
            </button>
          </div>
        )}
      </Card>

      {/* ── 10. WORKPLACE VERIFICATION CARD ── */}
      <Card title="Workplace Verification & Office Geofence" subtitle="HR Target Office Coordinates & Security Policy">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(132, 100, 124, 0.12)', color: '#84647C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              Office: {HR_CONFIGURED_LOCATION.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Address: {HR_CONFIGURED_LOCATION.address} | Geofence Radius: <strong>{HR_CONFIGURED_LOCATION.allowedRadiusMeters}m</strong>
            </div>
          </div>
          <Badge variant="success">
            ✓ Security Rules Active
          </Badge>
        </div>
      </Card>

      {/* ── 11 & 12. HR ATTENDANCE INTELLIGENCE & WORKFORCE INTELLIGENCE ── */}
      <Card variant="ai" title="HR Attendance Intelligence & Anomaly Detection" subtitle="Powered by Dayflow Calculation Engine">
        {intelligenceData && intelligenceData.score ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: '12px' }}>
            {/* Context Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'rgba(132,100,124,0.1)', borderRadius: '8px', border: '1px solid rgba(132,100,124,0.2)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#84647C' }}>
                {selectedEmployeeObj
                  ? `📊 Showing: ${selectedEmployeeObj.displayName} (${selectedEmployeeObj.department})`
                  : selectedDepartment !== 'All Departments'
                    ? `🏢 Showing: ${selectedDepartment} Department`
                    : `👥 Showing: All Employees — ${filteredRecords.length} records analysed`
                }
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
              {/* Left column — Score + Patterns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <IntelligenceScore scoreData={intelligenceData.score} />
                <PatternInsights patterns={intelligenceData.patterns} />
              </div>
              {/* Right column — Metrics + Weekly comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <IntelligenceMetrics metrics={intelligenceData.metrics} comparison={intelligenceData.comparison} />
                <WeeklyComparison comparison={intelligenceData.comparison} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <RefreshCw size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <p style={{ fontSize: '14px' }}>Loading intelligence data...</p>
          </div>
        )}
      </Card>

    </div>
  );
};

export default HRAttendance;

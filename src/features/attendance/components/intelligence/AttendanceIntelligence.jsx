import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAttendanceIntelligence } from '../../hooks/useAttendanceIntelligence';
import { IntelligenceScore } from './IntelligenceScore';
import { IntelligenceMetrics } from './IntelligenceMetrics';
import { WeeklyComparison } from './WeeklyComparison';
import { PatternInsights } from './PatternInsights';
import {
  DEV_DEPARTMENTS,
  DEV_EMPLOYEES,
  USE_LOCAL_DEV,
} from '../../dev/attendanceDataProvider';

/* ─────────────────────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────────────────────── */
const IntelligenceSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
    <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
      <div style={{ width: '260px', height: '28px', borderRadius: '6px', background: 'var(--border-color)', margin: '0 auto 12px' }} />
      <div style={{ width: '200px', height: '16px', borderRadius: '4px', background: 'var(--border-color)', margin: '0 auto' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
        <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--border-color)', margin: '0 auto var(--space-6)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', height: '200px' }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export const AttendanceIntelligence = ({ demoData = null }) => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedEmployeeUid, setSelectedEmployeeUid] = useState('ALL');

  const { intelligence, isLoading, error, retry } = useAttendanceIntelligence(
    selectedDept,
    selectedEmployeeUid,
    demoData
  );

  const departmentsList = USE_LOCAL_DEV ? DEV_DEPARTMENTS : ['All Departments', 'Engineering', 'Product', 'HR', 'Sales'];
  const employeesList = USE_LOCAL_DEV ? DEV_EMPLOYEES : [];

  // Filter employees dropdown options by department if selected
  const availableEmployees = selectedDept === 'All Departments'
    ? employeesList
    : employeesList.filter(e => e.department === selectedDept);

  /* Loading */
  if (isLoading) {
    return <IntelligenceSkeleton />;
  }

  /* Error */
  if (error) {
    return (
      <div
        style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
        role="alert"
      >
        <div style={{ fontSize: '40px' }} aria-hidden="true">⚠️</div>
        <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>UNABLE TO LOAD INTELLIGENCE</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          We couldn&apos;t calculate your attendance insights right now.
        </p>
        <Button onClick={retry}>TRY AGAIN</Button>
      </div>
    );
  }

  const { score, metrics, comparison, patterns } = intelligence || {};

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        paddingTop: USE_LOCAL_DEV ? '12px' : undefined,
      }}
    >
      {/* ── Hero Header ── */}
      <header style={{ textAlign: 'center', paddingTop: 'var(--space-2)' }}>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
          }}
        >
          Attendance Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>
          Department & Employee Workday Analytics, Scores & Signal Detection
        </p>
      </header>

      {/* ── Filter Controls Bar: Departments & Employee Selector ── */}
      <Card variant="default">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Department Tabs */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              🏢 Filter by Department:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {departmentsList.map((dept) => {
                const isActive = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedEmployeeUid('ALL'); // Reset employee selection when department changes
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: isActive ? 'var(--color-primary, #3b82f6)' : 'var(--border-color, #e5e7eb)',
                      backgroundColor: isActive ? 'var(--color-primary, #3b82f6)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                    }}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Employee Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-color, #e5e7eb)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              👤 Filter by Employee:
            </span>
            <select
              value={selectedEmployeeUid}
              onChange={(e) => setSelectedEmployeeUid(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-color, #d1d5db)',
                backgroundColor: 'var(--bg-primary, #ffffff)',
                color: 'var(--text-primary, #111827)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '240px',
              }}
            >
              <option value="ALL">👥 All Employees ({availableEmployees.length})</option>
              {availableEmployees.map((emp) => (
                <option key={emp.uid} value={emp.uid}>
                  👤 {emp.displayName} — {emp.role} ({emp.department})
                </option>
              ))}
            </select>

            {selectedEmployeeUid !== 'ALL' && (
              <Badge variant="info">
                Viewing Individual: {employeesList.find(e => e.uid === selectedEmployeeUid)?.displayName}
              </Badge>
            )}
          </div>

        </div>
      </Card>

      {/* ── Active Scope Overview Indicator ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
          Active View: <span style={{ color: 'var(--color-primary, #3b82f6)' }}>{selectedDept}</span>
          {selectedEmployeeUid !== 'ALL' && ` › ${employeesList.find(e => e.uid === selectedEmployeeUid)?.displayName}`}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          Period: Past 7 Days vs Previous Week
        </div>
      </div>

      {/* ── Intelligence Dashboard: Two-column layout ── */}
      {intelligence && metrics && metrics.totalDays > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          {/* Left column — Score + Patterns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <IntelligenceScore scoreData={score} />
            <PatternInsights patterns={patterns} />
          </div>

          {/* Right column — Metrics + Weekly comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <IntelligenceMetrics metrics={metrics} comparison={comparison} />
            <WeeklyComparison comparison={comparison} />
          </div>
        </div>
      ) : (
        <Card>
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No intelligence data recorded for the selected department/employee filter.
          </div>
        </Card>
      )}
    </main>
  );
};

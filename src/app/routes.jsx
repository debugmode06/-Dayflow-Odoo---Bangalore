import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import {
  WorkforcePulseCard,
  WorkforcePulseDrawer,
  HRAIAssistantDrawer,
  fetchWorkforcePulseInsight,
} from '@/features/workforce';
import {
  EmployeeLeaveDashboard,
  HRLeaveDashboard,
} from '@/features/leave';

// Route Guard Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/unauthorized" replace />;

  if (requiredRole === 'hr' && role !== 'hr' && role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Interactive Workspace Dashboard with NVIDIA NIM Llama 3.1 8B Workforce Pulse Integration
const DayflowDashboard = ({ title, subtitle, roleMode }) => {
  const [pulseData, setPulseData] = useState(null);
  const [whyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [assistantDrawerOpen, setAssistantDrawerOpen] = useState(false);

  useEffect(() => {
    // Deterministic metrics payload calculated by app logic
    const initialMetrics = {
      attendanceScore: 91,
      availabilityScore: 82,
      leaveLoadScore: 84,
      profileHealthScore: 88,
      lateArrivals: 6,
      absences: 2,
      recentPatterns: [
        'Late arrivals increased from 3 to 6 this week',
        'Team availability decreased due to overlapping approved leave',
      ],
    };

    fetchWorkforcePulseInsight(initialMetrics).then((res) => {
      setPulseData(res);
    });
  }, []);

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
      header: 'Score',
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
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</p>
        </div>
        <Badge variant={roleMode === 'hr' ? 'ai' : 'info'} size="md">
          {roleMode === 'hr' ? 'HR Command Active' : 'Employee Workspace'}
        </Badge>
      </div>

      {/* Primary Workforce Pulse Component (NVIDIA NIM Llama 3.1 8B) */}
      {pulseData && (
        <WorkforcePulseCard
          pulseData={pulseData}
          onOpenWhyDrawer={() => setWhyDrawerOpen(true)}
          onOpenAssistantDrawer={() => setAssistantDrawerOpen(true)}
        />
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Card title="Attendance Score" subtitle="30-day trailing avg">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)', marginTop: '8px' }}>
            91.0%
          </div>
        </Card>

        <Card title="Team Availability" subtitle="Current active staffing">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginTop: '8px' }}>
            82.0%
          </div>
        </Card>

        <Card title="Leave Load" subtitle="Scheduled time-off index">
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning-text)', marginTop: '8px' }}>
            84.0%
          </div>
        </Card>
      </div>

      {/* Shared Data & Security Verification Table */}
      <Card title="Active Department Roster" subtitle="Real-time employee attendance status & profile health">
        <DataTable columns={columns} data={mockTableData} />
      </Card>

      {/* Side Drawers */}
      <WorkforcePulseDrawer
        isOpen={whyDrawerOpen}
        onClose={() => setWhyDrawerOpen(false)}
        pulseData={pulseData || {}}
      />

      <HRAIAssistantDrawer
        isOpen={assistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
        metricsContext={pulseData?.metrics || {}}
      />
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Employee Routes */}
        <Route path="/dashboard" element={<DayflowDashboard title="Employee Dashboard" subtitle="Welcome back, Alex. Your workday is aligned." roleMode="employee" />} />
        <Route path="/profile" element={<DayflowDashboard title="Employee 360° Profile" subtitle="Identity & Profile Management Module" roleMode="employee" />} />
        <Route path="/attendance" element={<DayflowDashboard title="Attendance Intelligence" subtitle="Check-in/out & Attendance Patterns" roleMode="employee" />} />
        <Route path="/leave" element={<EmployeeLeaveDashboard title="Smart Leave & Time-Off" subtitle="Manage your leave requests and balances" roleMode="employee" />} />
        <Route path="/payroll" element={<DayflowDashboard title="My Payroll & Salary" subtitle="Transparent compensation visibility" roleMode="employee" />} />

        {/* HR / Admin Protected Routes */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute requiredRole="hr">
              <DayflowDashboard title="HR Command Center" subtitle="Centralized HR workforce management" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute requiredRole="hr">
              <DayflowDashboard title="Employee Management Directory" subtitle="All staff profiles and access management" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute requiredRole="hr">
              <DayflowDashboard title="HR Attendance Monitor" subtitle="Daily & weekly workforce check-in tracking" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/leave"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRLeaveDashboard title="Leave Approvals Workflow" subtitle="Manage company-wide leave requests" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <ProtectedRoute requiredRole="hr">
              <DayflowDashboard title="Payroll & Compensation Control" subtitle="Salary structures & salary visibility" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/workforce-pulse"
          element={
            <ProtectedRoute requiredRole="hr">
              <DayflowDashboard title="Workforce Pulse AI Explanation" subtitle="NVIDIA NIM Llama 3.1 8B Insights & Anomaly Analysis" roleMode="hr" />
            </ProtectedRoute>
          }
        />

        {/* Error & Fallback Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
};

export default AppRoutes;

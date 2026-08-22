import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import Login from '@/pages/Login';
import { HRCommandCenterPage } from '@/features/workforce';
import { PayrollPage } from '@/features/payroll';

// Route Guard Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole === 'hr' && role !== 'hr' && role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Generic Employee Workspace Dashboard Placeholder (No Member 4 HR Analytics)
const DayflowDashboard = ({ title, subtitle, roleMode }) => {
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

      {/* Shared Data Roster Table */}
      <Card title="Active Department Roster" subtitle="Real-time employee attendance status & profile health">
        <DataTable columns={columns} data={mockTableData} />
      </Card>
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
        <Route path="/leave" element={<DayflowDashboard title="Smart Leave & Time-Off" subtitle="Applications & Leave Impact Simulator" roleMode="employee" />} />
        <Route path="/payroll" element={<DayflowDashboard title="My Payroll & Salary" subtitle="Transparent compensation visibility" roleMode="employee" />} />

        {/* HR / Admin Protected Routes */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRCommandCenterPage />
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
              <DayflowDashboard title="Leave Approvals Workflow" subtitle="HR comment & Leave Impact Simulation" roleMode="hr" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <ProtectedRoute requiredRole="hr">
              <PayrollPage />
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

        {/* Auth & Error Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
};

export default AppRoutes;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth';
import { LoginPage, SignupPage, VerificationGate } from '@/features/auth';
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
import { EmployeeDashboard } from '@/features/dashboard/components/EmployeeDashboard';

// Import new module components
import { EmployeeProfile } from '@/features/dashboard/components/EmployeeProfile';
import { AttendanceDashboard } from '@/features/attendance/components/AttendanceDashboard';
import { PayrollDashboard } from '@/features/payroll/components/PayrollDashboard';
import { HRCommandCenter } from '@/features/dashboard/components/HRCommandCenter';
import { EmployeeDirectory } from '@/features/employees/components/EmployeeDirectory';
import { HRAttendanceMonitor } from '@/features/attendance/components/HRAttendanceMonitor';
import { HRPayrollDashboard } from '@/features/payroll/components/HRPayrollDashboard';

// Route Guard Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole === 'hr' && role !== 'hr' && role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <VerificationGate>{children}</VerificationGate>;
};

// Route Guard for unauthenticated only (e.g. Login page)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return children;
};

// Dashboard Route Dispatcher
const DashboardDispatcher = () => {
  const { role, loading } = useAuth();
  
  if (loading) return null;
  
  if (role === 'hr' || role === 'admin') {
    return <Navigate to="/hr/dashboard" replace />;
  }
  
  return <Navigate to="/employee/dashboard" replace />;
};

const AppShellLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

import { WorkforcePulse } from '@/features/dashboard/components/WorkforcePulse';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardDispatcher /></ProtectedRoute>} />

      {/* Application Shell (Protected Routes) */}
      <Route element={<ProtectedRoute><AppShellLayout /></ProtectedRoute>}>
        
        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/leave" element={<EmployeeLeaveDashboard title="Smart Leave & Time-Off" subtitle="Manage your leave requests and balances" roleMode="employee" />} />
        <Route path="/payroll" element={<PayrollDashboard />} />

        {/* Legacy redirect for old links */}
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />

        {/* HR / Admin Protected Routes */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRCommandCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute requiredRole="hr">
              <EmployeeDirectory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRAttendanceMonitor />
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
              <HRPayrollDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/workforce-pulse"
          element={
            <ProtectedRoute requiredRole="hr">
              <WorkforcePulse />
            </ProtectedRoute>
          }
        />
        
        {/* Error & Fallback Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

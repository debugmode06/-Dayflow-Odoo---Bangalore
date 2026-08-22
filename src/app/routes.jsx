import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth';
import { LoginPage, SignupPage, VerificationGate } from '@/features/auth';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import { EmployeeDashboardPage } from '@/pages/EmployeeDashboardPage';
import { EmployeeProfilePage } from '@/features/employees/pages/EmployeeProfilePage';
import { AttendanceIntelligencePage } from '@/features/attendance/pages/AttendanceIntelligencePage';
import {
  HRCommandCenterPage,
  HREmployeeDirectoryPage,
  HRAttendanceMonitorPage,
} from '@/features/workforce';
import {
  PayrollPage,
  EmployeePayrollPage,
} from '@/features/payroll';
import {
  EmployeeLeaveDashboard,
  HRLeaveDashboard,
} from '@/features/leave';

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
        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/profile" element={<EmployeeProfilePage />} />
        <Route path="/attendance" element={<AttendanceIntelligencePage />} />
        <Route path="/leave" element={<EmployeeLeaveDashboard title="Smart Leave & Time-Off" subtitle="Manage your leave requests and balances" roleMode="employee" />} />
        <Route path="/payroll" element={<EmployeePayrollPage />} />

        {/* Legacy redirect for old links */}
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />

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
              <HREmployeeDirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRAttendanceMonitorPage />
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
              <PayrollPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/workforce-pulse"
          element={
            <ProtectedRoute requiredRole="hr">
              <HRCommandCenterPage />
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

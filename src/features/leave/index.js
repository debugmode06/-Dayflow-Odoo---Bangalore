/**
 * Feature Module: Smart Leave & Impact Simulator
 * Owned by: Member 3
 */

export const MODULE_NAME = 'leave';

// Components
export { default as EmployeeLeaveDashboard } from './components/EmployeeLeaveDashboard';
export { default as LeaveApplicationForm } from './components/LeaveApplicationForm';
export { default as LeaveHistoryTable } from './components/LeaveHistoryTable';
export { default as HRLeaveDashboard } from './components/HRLeaveDashboard';
export { default as HRLeaveRequestsTable } from './components/HRLeaveRequestsTable';
export { default as LeaveApprovalModal } from './components/LeaveApprovalModal';

// Services
export * from './services/leaveService';

export default {
  name: MODULE_NAME,
};

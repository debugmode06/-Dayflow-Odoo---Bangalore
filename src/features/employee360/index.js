/**
 * Feature Module: Employee 360° Profile & Activity Timeline
 * Owned by: Member 1
 */

export const MODULE_NAME = 'employee360';

// Components & Pages
export { default as Employee360Page } from './pages/Employee360Page';
export { default as Employee360Header } from './components/Employee360Header';
export { default as PersonalInformation } from './components/PersonalInformation';
export { default as JobInformation } from './components/JobInformation';
export { default as SalaryStructure } from './components/SalaryStructure';
export { default as DocumentsSection } from './components/DocumentsSection';
export { default as AttendanceSummary } from './components/AttendanceSummary';
export { default as LeaveHistory } from './components/LeaveHistory';
export { default as ActivityTimeline } from './components/ActivityTimeline';
export { default as ProfileEditForm } from './components/ProfileEditForm';

// Services
export * from './services/employeeProfileService';
export * from './services/activityTimelineService';

// Hooks
export { default as useEmployeeProfile } from './hooks/useEmployeeProfile';

export default {
  name: MODULE_NAME,
};

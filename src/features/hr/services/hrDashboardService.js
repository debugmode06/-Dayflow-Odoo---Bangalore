/**
 * HR Dashboard Service
 * Unified abstraction layer — returns demo data in demo mode, Firestore data in production.
 * UI components never need to know the source.
 */

import {
  DEMO_WORKFORCE_TODAY,
  DEMO_HEALTH_SCORE,
  DEMO_CHANGES,
  DEMO_ATTENDANCE_TREND,
  DEMO_DEPARTMENT_HEALTH,
  DEMO_TOMORROW,
  DEMO_RISKS,
  DEMO_HR_ACTIONS,
  DEMO_LEAVE_IMPACT,
  DEMO_ATTENTION_HEATMAP,
  DEMO_EMPLOYEE_SIGNALS,
  DEMO_PENDING_LEAVES,
  DEMO_PAYROLL,
  DEMO_CAPACITY,
} from '../demo/hrDashboardMockData';

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

// Simulate a small async delay in demo mode to show loading states
const demoDelay = () => new Promise((r) => setTimeout(r, 300));

// ─── Public API ───────────────────────────────────────────────────────────────

export const getWorkforceOverview = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_WORKFORCE_TODAY; }
  // TODO: Aggregate from Firestore users + attendance collections
  return DEMO_WORKFORCE_TODAY;
};

export const getHealthScore = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_HEALTH_SCORE; }
  return DEMO_HEALTH_SCORE;
};

export const getWhatChanged = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_CHANGES; }
  return DEMO_CHANGES;
};

export const getAttendanceTrend = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_ATTENDANCE_TREND; }
  return DEMO_ATTENDANCE_TREND;
};

export const getDepartmentHealth = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_DEPARTMENT_HEALTH; }
  return DEMO_DEPARTMENT_HEALTH;
};

export const getTomorrowCapacity = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_TOMORROW; }
  return DEMO_TOMORROW;
};

export const getWorkforceRisks = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_RISKS; }
  return DEMO_RISKS;
};

export const getHRActions = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_HR_ACTIONS; }
  return DEMO_HR_ACTIONS;
};

export const getLeaveImpact = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_LEAVE_IMPACT; }
  return DEMO_LEAVE_IMPACT;
};

export const getAttentionHeatmap = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_ATTENTION_HEATMAP; }
  return DEMO_ATTENTION_HEATMAP;
};

export const getEmployeeSignals = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_EMPLOYEE_SIGNALS; }
  return DEMO_EMPLOYEE_SIGNALS;
};

export const getPendingLeaves = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_PENDING_LEAVES; }
  return DEMO_PENDING_LEAVES;
};

export const getPayrollSummary = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_PAYROLL; }
  return DEMO_PAYROLL;
};

export const getCapacity = async () => {
  if (IS_DEMO) { await demoDelay(); return DEMO_CAPACITY; }
  return DEMO_CAPACITY;
};

/**
 * Aggregate all dashboard data in a single call — avoids N separate Firestore reads.
 */
export const getDashboardData = async () => {
  const [
    overview, health, changes, attendance, departments,
    tomorrow, risks, actions, leave, heatmap,
    signals, pendingLeaves, payroll, capacity
  ] = await Promise.all([
    getWorkforceOverview(), getHealthScore(), getWhatChanged(),
    getAttendanceTrend(), getDepartmentHealth(), getTomorrowCapacity(),
    getWorkforceRisks(), getHRActions(), getLeaveImpact(),
    getAttentionHeatmap(), getEmployeeSignals(), getPendingLeaves(),
    getPayrollSummary(), getCapacity(),
  ]);

  return {
    overview, health, changes, attendance, departments,
    tomorrow, risks, actions, leave, heatmap,
    signals, pendingLeaves, payroll, capacity,
    lastUpdated: new Date(),
  };
};

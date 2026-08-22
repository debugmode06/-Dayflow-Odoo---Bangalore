/**
 * HR Dashboard Demo Data
 * Isolated from production services — clearly marked as sample/demo data.
 * Used when VITE_DEMO_MODE=true or when Firebase is unavailable.
 */

const TODAY = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => fmt(new Date(TODAY.getTime() - n * 86400000));
const daysFromNow = (n) => fmt(new Date(TODAY.getTime() + n * 86400000));

// ─────────────────────────────────────────────
// DEPARTMENTS
// ─────────────────────────────────────────────
export const DEMO_DEPARTMENTS = [
  { id: 'eng', name: 'Engineering', headcount: 42, color: '#6366f1' },
  { id: 'design', name: 'Design', headcount: 18, color: '#8b5cf6' },
  { id: 'sales', name: 'Sales', headcount: 27, color: '#f59e0b' },
  { id: 'marketing', name: 'Marketing', headcount: 15, color: '#10b981' },
  { id: 'hr', name: 'Human Resources', headcount: 8, color: '#84647C' },
  { id: 'finance', name: 'Finance', headcount: 10, color: '#3b82f6' },
];

// ─────────────────────────────────────────────
// WORKFORCE STATS — TODAY
// ─────────────────────────────────────────────
export const DEMO_WORKFORCE_TODAY = {
  totalEmployees: 120,
  presentToday: 98,
  absentToday: 5,
  onLeave: 10,
  lateToday: 7,
  pendingLeaveRequests: 3,
  openHRActions: 6,
  activeDepartments: 6,
};

// ─────────────────────────────────────────────
// WORKFORCE HEALTH SCORE BREAKDOWN
// ─────────────────────────────────────────────
export const DEMO_HEALTH_SCORE = {
  overall: 88,
  label: 'Good',
  breakdown: {
    attendance: 91,
    availability: 82,
    leaveLoad: 84,
    punctuality: 88,
    profileHealth: 96,
  },
  explanation:
    'Workforce health is strong. Attendance remains healthy at 91%, but leave concentration in Design and availability pressure in Sales require attention.',
  calculationNotes: [
    { factor: 'Attendance Rate (91%)', weight: '35%', contribution: 31.9, note: 'Above healthy baseline of 88%' },
    { factor: 'Availability (82%)', weight: '25%', contribution: 20.5, note: 'Slightly below optimal 85%' },
    { factor: 'Leave Load (84%)', weight: '20%', contribution: 16.8, note: '10 employees on leave today' },
    { factor: 'Punctuality (88%)', weight: '12%', contribution: 10.6, note: '7 late arrivals logged today' },
    { factor: 'Profile Health (96%)', weight: '8%', contribution: 7.7, note: '5 incomplete profiles' },
  ],
};

// ─────────────────────────────────────────────
// WHAT CHANGED SINCE YESTERDAY
// ─────────────────────────────────────────────
export const DEMO_CHANGES = [
  { metric: 'Attendance', yesterday: 93.4, today: 91.0, unit: '%', trend: 'down' },
  { metric: 'Leave Requests', yesterday: 1, today: 3, unit: '', trend: 'up', isBad: true },
  { metric: 'Engineering Availability', yesterday: 95, today: 88, unit: '%', trend: 'down' },
  { metric: 'Punctuality', yesterday: 85, today: 88, unit: '%', trend: 'up' },
  { metric: 'Absent Today', yesterday: 3, today: 5, unit: '', trend: 'up', isBad: true },
];

// ─────────────────────────────────────────────
// ATTENDANCE — LAST 7 DAYS
// ─────────────────────────────────────────────
export const DEMO_ATTENDANCE_TREND = [
  { date: daysAgo(6), day: 'Mon', present: 112, absent: 3, late: 5, onLeave: 8, total: 120 },
  { date: daysAgo(5), day: 'Tue', present: 108, absent: 5, late: 7, onLeave: 9, total: 120 },
  { date: daysAgo(4), day: 'Wed', present: 113, absent: 2, late: 5, onLeave: 8, total: 120 },
  { date: daysAgo(3), day: 'Thu', present: 110, absent: 4, late: 6, onLeave: 10, total: 120 },
  { date: daysAgo(2), day: 'Fri', present: 104, absent: 6, late: 10, onLeave: 10, total: 120 },
  { date: daysAgo(1), day: 'Sat', present: 112, absent: 3, late: 5, onLeave: 10, total: 120 },
  { date: fmt(TODAY), day: 'Today', present: 98, absent: 5, late: 7, onLeave: 10, total: 120 },
];

// ─────────────────────────────────────────────
// DEPARTMENT HEALTH
// ─────────────────────────────────────────────
export const DEMO_DEPARTMENT_HEALTH = [
  {
    id: 'eng', name: 'Engineering', headcount: 42,
    attendance: 94, availability: 88, leaveLoad: 10, punctuality: 91,
    risk: 'low', riskReason: 'All metrics healthy',
    onLeave: 4, absent: 1, late: 2,
  },
  {
    id: 'design', name: 'Design', headcount: 18,
    attendance: 89, availability: 72, leaveLoad: 22, punctuality: 85,
    risk: 'medium', riskReason: 'High leave concentration — 4 of 18 on leave',
    onLeave: 4, absent: 1, late: 2,
  },
  {
    id: 'sales', name: 'Sales', headcount: 27,
    attendance: 84, availability: 68, leaveLoad: 26, punctuality: 80,
    risk: 'high', riskReason: 'Low availability and attendance trending down',
    onLeave: 5, absent: 2, late: 3,
  },
  {
    id: 'marketing', name: 'Marketing', headcount: 15,
    attendance: 93, availability: 87, leaveLoad: 7, punctuality: 90,
    risk: 'low', riskReason: 'All metrics within healthy range',
    onLeave: 1, absent: 0, late: 1,
  },
  {
    id: 'hr', name: 'Human Resources', headcount: 8,
    attendance: 100, availability: 95, leaveLoad: 0, punctuality: 95,
    risk: 'low', riskReason: 'Full team present today',
    onLeave: 0, absent: 0, late: 0,
  },
  {
    id: 'finance', name: 'Finance', headcount: 10,
    attendance: 90, availability: 80, leaveLoad: 10, punctuality: 88,
    risk: 'low', riskReason: 'Stable with minor leave load',
    onLeave: 1, absent: 1, late: 1,
  },
];

// ─────────────────────────────────────────────
// TOMORROW'S WORKFORCE
// ─────────────────────────────────────────────
export const DEMO_TOMORROW = {
  date: daysFromNow(1),
  overallCapacity: 84,
  expectedPresent: 101,
  expectedOnLeave: 12,
  expectedAbsent: 7,
  departments: [
    { name: 'Engineering', capacity: 88, risk: 'low' },
    { name: 'Design', capacity: 72, risk: 'medium' },
    { name: 'Sales', capacity: 63, risk: 'high' },
    { name: 'Marketing', capacity: 87, risk: 'low' },
    { name: 'Finance', capacity: 90, risk: 'low' },
    { name: 'Human Resources', capacity: 95, risk: 'low' },
  ],
  insight: 'Sales team is expected to drop below 65% capacity tomorrow due to 5 approved leaves and 2 predicted absences. Consider backup coverage.',
};

// ─────────────────────────────────────────────
// WORKFORCE RISKS (Rules Engine — no external AI)
// ─────────────────────────────────────────────
export const DEMO_RISKS = [
  {
    id: 'r1', severity: 'high',
    title: 'Sales staffing risk',
    description: 'Sales team availability expected to fall below 65% tomorrow.',
    recommendation: 'Review planned leave and arrange backup coverage.',
    department: 'Sales',
    action: '/hr/attendance',
    actionLabel: 'View Attendance',
  },
  {
    id: 'r2', severity: 'medium',
    title: 'Leave concentration in Design',
    description: '4 of 18 Design employees are on leave simultaneously — 22% leave load.',
    recommendation: 'Consider staggering leave approvals to maintain team coverage.',
    department: 'Design',
    action: '/hr/leave',
    actionLabel: 'View Leave',
  },
  {
    id: 'r3', severity: 'medium',
    title: 'Repeated late arrivals',
    description: '4 employees have had late arrivals 3+ times this week.',
    recommendation: 'Initiate an attendance review for affected employees.',
    department: 'All',
    action: '/hr/attendance',
    actionLabel: 'Review Attendance',
  },
  {
    id: 'r4', severity: 'low',
    title: 'Incomplete employee profiles',
    description: '5 employee profiles are missing emergency contact or department info.',
    recommendation: 'Send reminders to affected employees to complete their profiles.',
    department: 'Various',
    action: '/hr/employees',
    actionLabel: 'Employee Directory',
  },
];

// ─────────────────────────────────────────────
// HR ACTIONS — NEEDS ATTENTION
// ─────────────────────────────────────────────
export const DEMO_HR_ACTIONS = [
  {
    id: 'a1', type: 'leave', severity: 'high',
    title: '3 leave requests pending approval',
    subtitle: 'Oldest: 2 days ago',
    action: '/hr/leave', actionLabel: 'Review Requests',
  },
  {
    id: 'a2', type: 'attendance', severity: 'medium',
    title: 'Engineering availability drops below 80% tomorrow',
    subtitle: '4 approved leaves + 2 unplanned absences',
    action: '/hr/attendance', actionLabel: 'View Team',
  },
  {
    id: 'a3', type: 'attendance', severity: 'medium',
    title: '4 employees with repeated late arrivals',
    subtitle: 'Pattern detected over last 5 days',
    action: '/hr/attendance', actionLabel: 'Review Attendance',
  },
  {
    id: 'a4', type: 'profile', severity: 'low',
    title: '5 employee profiles are incomplete',
    subtitle: 'Missing emergency contact or department info',
    action: '/hr/employees', actionLabel: 'Complete Profiles',
  },
];

// ─────────────────────────────────────────────
// LEAVE IMPACT
// ─────────────────────────────────────────────
export const DEMO_LEAVE_IMPACT = {
  today: {
    approved: 8, pending: 3, rejected: 1, total: 12,
    byDepartment: [
      { name: 'Engineering', count: 4, impact: 10, level: 'low' },
      { name: 'Design', count: 4, impact: 22, level: 'medium' },
      { name: 'Sales', count: 5, impact: 19, level: 'medium' },
      { name: 'Marketing', count: 1, impact: 7, level: 'low' },
    ],
  },
  tomorrow: {
    approved: 10, pending: 2, total: 12,
    byDepartment: [
      { name: 'Engineering', count: 3, impact: 7, level: 'low' },
      { name: 'Design', count: 4, impact: 22, level: 'medium' },
      { name: 'Sales', count: 6, impact: 22, level: 'high' },
      { name: 'Marketing', count: 1, impact: 7, level: 'low' },
    ],
  },
  next7Days: { totalApproved: 24, peakDay: daysFromNow(3), peakCount: 14 },
};

// ─────────────────────────────────────────────
// ATTENTION HEATMAP
// ─────────────────────────────────────────────
export const DEMO_ATTENTION_HEATMAP = [
  { dept: 'Engineering', attendance: 'low', leave: 'low', availability: 'low', profile: 'low' },
  { dept: 'Design', attendance: 'medium', leave: 'high', availability: 'high', profile: 'low' },
  { dept: 'Sales', attendance: 'high', leave: 'medium', availability: 'high', profile: 'medium' },
  { dept: 'Marketing', attendance: 'low', leave: 'low', availability: 'low', profile: 'low' },
  { dept: 'Finance', attendance: 'low', leave: 'low', availability: 'low', profile: 'low' },
  { dept: 'HR', attendance: 'low', leave: 'low', availability: 'low', profile: 'low' },
];

// ─────────────────────────────────────────────
// EMPLOYEE SIGNALS
// ─────────────────────────────────────────────
export const DEMO_EMPLOYEE_SIGNALS = [
  {
    id: 's1', type: 'attendance',
    title: '4 employees with repeated late arrivals',
    description: 'Detected in Engineering (2) and Sales (2) — occurring 3+ days this week.',
    action: '/hr/attendance', actionLabel: 'Review',
  },
  {
    id: 's2', type: 'attendance',
    title: '2 employees with unusual absence pattern',
    description: 'Unplanned absences on consecutive days without leave application.',
    action: '/hr/attendance', actionLabel: 'Review',
  },
  {
    id: 's3', type: 'profile',
    title: '5 incomplete employee profiles',
    description: 'Missing emergency contact, department assignment, or designation.',
    action: '/hr/employees', actionLabel: 'View Directory',
  },
  {
    id: 's4', type: 'leave',
    title: '1 team with concentrated leave',
    description: 'Design team has 4 simultaneous absences — 22% of team capacity.',
    action: '/hr/leave', actionLabel: 'View Leaves',
  },
];

// ─────────────────────────────────────────────
// PENDING LEAVE REQUESTS
// ─────────────────────────────────────────────
export const DEMO_PENDING_LEAVES = [
  {
    id: 'pl1', employeeName: 'Sarah Jenkins', employeeId: 'EMP-1045',
    department: 'Engineering', type: 'Vacation', days: 3,
    startDate: daysFromNow(2), endDate: daysFromNow(4),
    submittedDaysAgo: 2, status: 'pending',
  },
  {
    id: 'pl2', employeeName: 'Marcus Vance', employeeId: 'EMP-1012',
    department: 'Sales', type: 'Sick Leave', days: 1,
    startDate: daysFromNow(1), endDate: daysFromNow(1),
    submittedDaysAgo: 0, status: 'pending',
  },
  {
    id: 'pl3', employeeName: 'Ananya Krishnan', employeeId: 'EMP-1067',
    department: 'Design', type: 'Personal', days: 2,
    startDate: daysFromNow(3), endDate: daysFromNow(4),
    submittedDaysAgo: 1, status: 'pending',
  },
];

// ─────────────────────────────────────────────
// PAYROLL SUMMARY
// ─────────────────────────────────────────────
export const DEMO_PAYROLL = {
  isDemo: true,
  month: 'August 2026',
  totalDisbursed: 6609000,
  employeeCount: 120,
  averageSalary: 55075,
  pendingActions: 2,
  trend: { value: 4.2, direction: 'up' },
};

// ─────────────────────────────────────────────
// TEAM CAPACITY
// ─────────────────────────────────────────────
export const DEMO_CAPACITY = {
  current: 82,
  tomorrow: 79,
  sevenDayAvg: 84,
  insight: 'Capacity is expected to decline slightly tomorrow due to planned leave in Sales and Design.',
};

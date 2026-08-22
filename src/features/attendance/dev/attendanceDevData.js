/**
 * LOCAL DEVELOPMENT DATA — MEMBER 2 ATTENDANCE MODULE
 *
 * Isolated sample data for local development without Firebase.
 * Includes multiple employees across departments, HR workplace locations,
 * and 30 days of realistic attendance history per employee.
 */

import { ATTENDANCE_STATUS, VERIFICATION_TYPE, VERIFICATION_STATUS } from '../constants';

/** Primary Dev User */
export const DEV_USER = {
  uid: 'dev-user-1',
  employeeId: 'EMP-101',
  displayName: 'Priya Sharma',
  department: 'Engineering',
  role: 'Senior Frontend Engineer',
  email: 'priya.sharma@dayflow.local',
};

/** HR Configured Office Location */
export const HR_CONFIGURED_LOCATION = {
  name: 'Bangalore Tech Park (Main HQ)',
  address: 'Embassy Tech Village, Outer Ring Road, Bangalore',
  latitude: 12.9716,
  longitude: 77.5946,
  allowedRadiusMeters: 150,
};

/** List of Employees across Departments */
export const DEV_EMPLOYEES = [
  { uid: 'dev-user-1', employeeId: 'EMP-101', displayName: 'Priya Sharma', department: 'Engineering', role: 'Senior Frontend Engineer' },
  { uid: 'dev-user-2', employeeId: 'EMP-102', displayName: 'Rajesh Kumar', department: 'Engineering', role: 'Backend Lead' },
  { uid: 'dev-user-3', employeeId: 'EMP-103', displayName: 'Ananya Roy', department: 'Product', role: 'Product Manager' },
  { uid: 'dev-user-4', employeeId: 'EMP-104', displayName: 'Vikram Patel', department: 'Design', role: 'UI/UX Designer' },
  { uid: 'dev-user-5', employeeId: 'EMP-105', displayName: 'Sneha Reddy', department: 'HR', role: 'HR Specialist' },
  { uid: 'dev-user-6', employeeId: 'EMP-106', displayName: 'Amit Verma', department: 'Sales', role: 'Sales Executive' },
];

/** List of Departments */
export const DEV_DEPARTMENTS = ['All Departments', 'Engineering', 'Product', 'Design', 'HR', 'Sales'];

// ─── Timestamp helpers ───────────────────────────────────────────────────────

/** Wrap a JS Date into a Firestore-compatible timestamp object */
export const toFirestoreTs = (date) => {
  const ms = date instanceof Date ? date.getTime() : date;
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: 0,
    toMillis: () => ms,
  };
};

/** Build a Date for a specific hour:minute on a given date string (YYYY-MM-DD) */
const dateAt = (dateStr, hour, minute = 0) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, hour, minute, 0, 0);
};

// ─── Date helpers ────────────────────────────────────────────────────────────

export const getAttendanceDateStr = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const offsetDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return getAttendanceDateStr(d);
};

// ─── Generate 30 days of realistic sample records for ALL EMPLOYEES ─────────────

/**
 * Generates deterministic attendance records for all employees over the last 30 days.
 * Returns a Map keyed by docId (`${uid}_${dateStr}`).
 */
export const buildSampleRecords = () => {
  const records = new Map();

  // Distinct attendance patterns per employee index
  const employeePatterns = [
    // Priya (Engineering)
    ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT'],
    // Rajesh (Engineering)
    ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT'],
    // Ananya (Product)
    ['PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'],
    // Vikram (Design)
    ['PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'],
    // Sneha (HR)
    ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT'],
    // Amit (Sales)
    ['PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'HALF_DAY', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LEAVE', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'],
  ];

  DEV_EMPLOYEES.forEach((emp, empIdx) => {
    const pattern = employeePatterns[empIdx % employeePatterns.length];

    for (let i = 0; i < 30; i++) {
      const dayOffset = -(30 - i); // -30 .. -1
      const dateStr = offsetDays(dayOffset);
      const status = pattern[i];
      const docId = `${emp.uid}_${dateStr}`;

      if (status === 'ABSENT' || status === 'LEAVE') {
        records.set(docId, {
          id: docId,
          userId: emp.uid,
          employeeId: emp.employeeId,
          employeeName: emp.displayName,
          department: emp.department,
          role: emp.role,
          date: dateStr,
          checkIn: null,
          checkOut: null,
          workingDuration: null,
          status: status === 'ABSENT' ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.LEAVE,
          verificationType: null,
          verificationStatus: null,
          locationName: HR_CONFIGURED_LOCATION.name,
        });
        continue;
      }

      // Check-in around 9:00 - 9:30 AM
      const ciMinute = (empIdx * 4 + i * 3) % 35;
      const ciDate = dateAt(dateStr, 9, ciMinute);
      let coDate = dateAt(dateStr, 18, (empIdx * 5 + i * 2) % 45);
      let durationSec = Math.floor((coDate.getTime() - ciDate.getTime()) / 1000);

      if (status === 'HALF_DAY') {
        coDate = dateAt(dateStr, 13, 30);
        durationSec = Math.floor((coDate.getTime() - ciDate.getTime()) / 1000);
      }

      records.set(docId, {
        id: docId,
        userId: emp.uid,
        employeeId: emp.employeeId,
        employeeName: emp.displayName,
        department: emp.department,
        role: emp.role,
        date: dateStr,
        checkIn: toFirestoreTs(ciDate),
        checkOut: toFirestoreTs(coDate),
        workingDuration: durationSec,
        status: status === 'HALF_DAY' ? ATTENDANCE_STATUS.HALF_DAY : ATTENDANCE_STATUS.PRESENT,
        verificationType: VERIFICATION_TYPE.GEOFENCE,
        verificationStatus: VERIFICATION_STATUS.VERIFIED,
        locationName: HR_CONFIGURED_LOCATION.name,
      });
    }
  });

  return records;
};

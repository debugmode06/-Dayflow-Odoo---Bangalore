/**
 * LOCAL DEVELOPMENT SERVICE — MEMBER 2 ATTENDANCE MODULE
 *
 * In-memory implementation of attendanceService.js.
 * Exposes exact function signatures plus multi-employee & department query support.
 */

import {
  DEV_USER,
  DEV_EMPLOYEES,
  DEV_DEPARTMENTS,
  HR_CONFIGURED_LOCATION,
  buildSampleRecords,
  getAttendanceDateStr,
  toFirestoreTs,
} from './attendanceDevData';
import { ATTENDANCE_STATUS, VERIFICATION_TYPE, VERIFICATION_STATUS } from '../constants';

// ─── In-memory store ─────────────────────────────────────────────────────────

/** Map of all historical records keyed by docId (`${uid}_${dateStr}`) */
const _historicalRecords = buildSampleRecords();

/** Today's active sessions per userId */
const _todaySessions = new Map();

// ─── Exported helpers ────────────────────────────────────────────────────────

export { DEV_USER as getDevUser, DEV_USER, DEV_EMPLOYEES, DEV_DEPARTMENTS, HR_CONFIGURED_LOCATION };

export const getAttendanceDate = (date = new Date()) => getAttendanceDateStr(date);

export const getAttendanceDocId = (userId, dateStr) => `${userId}_${dateStr}`;

export const getAllEmployees = () => DEV_EMPLOYEES;

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Get daily attendance for a specific user and date.
 */
export const getDailyAttendance = async (userId, dateStr) => {
  const targetUid = userId || DEV_USER.uid;
  const todayStr = getAttendanceDateStr();

  if (dateStr === todayStr && _todaySessions.has(targetUid)) {
    return { ..._todaySessions.get(targetUid) };
  }

  const docId = getAttendanceDocId(targetUid, dateStr);
  const record = _historicalRecords.get(docId);
  return record ? { ...record } : null;
};

/**
 * Check in for an employee.
 */
export const checkIn = async (user, verificationType, verificationStatus) => {
  const userId = user?.uid || DEV_USER.uid;
  const employeeId = user?.employeeId || DEV_USER.employeeId;
  const employeeName = user?.displayName || DEV_USER.displayName;
  const department = user?.department || DEV_USER.department || 'Engineering';
  const role = user?.role || DEV_USER.role || 'Software Engineer';
  const dateStr = getAttendanceDateStr();

  if (_todaySessions.has(userId) && !_todaySessions.get(userId).checkOut) {
    throw new Error('Already checked in for today.');
  }

  const now = new Date();
  const record = {
    id: getAttendanceDocId(userId, dateStr),
    userId,
    employeeId,
    employeeName,
    department,
    role,
    date: dateStr,
    checkIn: toFirestoreTs(now),
    checkOut: null,
    workingDuration: null,
    status: ATTENDANCE_STATUS.PRESENT,
    verificationType: verificationType || VERIFICATION_TYPE.GEOFENCE,
    verificationStatus: verificationStatus || VERIFICATION_STATUS.VERIFIED,
    locationName: HR_CONFIGURED_LOCATION.name,
  };

  _todaySessions.set(userId, record);
  return { ...record };
};

/**
 * Check out for an employee.
 */
export const checkOut = async (userId) => {
  const targetUid = userId || DEV_USER.uid;
  const activeSession = _todaySessions.get(targetUid);

  if (!activeSession) {
    throw new Error('No check-in found for today.');
  }
  if (activeSession.checkOut) {
    throw new Error('Already checked out for today.');
  }

  const now = new Date();
  const checkInMs = activeSession.checkIn.toMillis();
  const durationSec = Math.max(0, Math.floor((now.getTime() - checkInMs) / 1000));

  const updatedSession = {
    ...activeSession,
    checkOut: toFirestoreTs(now),
    workingDuration: durationSec,
  };

  _todaySessions.set(targetUid, updatedSession);
  return { ...updatedSession };
};

/**
 * Get weekly attendance for a user or department.
 */
export const getWeeklyAttendance = async (userId, startDateStr, endDateStr, filters = {}) => {
  const todayStr = getAttendanceDateStr();
  const results = [];

  const allRecordsMap = new Map(_historicalRecords);
  _todaySessions.forEach((session, uid) => {
    allRecordsMap.set(getAttendanceDocId(uid, todayStr), session);
  });

  allRecordsMap.forEach((record) => {
    if (record.date >= startDateStr && record.date <= endDateStr) {
      if (filters.department && filters.department !== 'All Departments') {
        if (record.department !== filters.department) return;
      } else if (userId && userId !== 'ALL' && !filters.allEmployees) {
        if (record.userId !== userId) return;
      }
      results.push({ ...record });
    }
  });

  return results.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get attendance history with optional filters (supports all employees & department filtering).
 */
export const getAttendanceHistory = async (userId, filters = {}) => {
  const todayStr = getAttendanceDateStr();
  const allRecordsMap = new Map(_historicalRecords);

  _todaySessions.forEach((session, uid) => {
    allRecordsMap.set(getAttendanceDocId(uid, todayStr), session);
  });

  let results = [...allRecordsMap.values()];

  // Filter by userId if not requesting ALL or filtering by specific employeeId
  if (filters.employeeId && filters.employeeId !== 'ALL') {
    results = results.filter((r) => r.employeeId === filters.employeeId || r.userId === filters.employeeId);
  } else if (userId && userId !== 'ALL' && !filters.allEmployees) {
    results = results.filter((r) => r.userId === userId);
  }

  // Filter by department
  if (filters.department && filters.department !== 'All Departments') {
    results = results.filter((r) => r.department === filters.department);
  }

  // Filter by date range
  if (filters.startDate) {
    results = results.filter((r) => r.date >= filters.startDate);
  }
  if (filters.endDate) {
    results = results.filter((r) => r.date <= filters.endDate);
  }
  if (filters.status && filters.status !== 'All') {
    results = results.filter((r) => r.status === filters.status);
  }

  return results.sort((a, b) => b.date.localeCompare(a.date)); // Descending by date
};

/**
 * HR: Get all employees attendance for a date.
 */
export const getAllEmployeesAttendance = async (dateStr, filters = {}) => {
  const todayStr = getAttendanceDateStr();
  const allRecordsMap = new Map(_historicalRecords);

  _todaySessions.forEach((session, uid) => {
    allRecordsMap.set(getAttendanceDocId(uid, todayStr), session);
  });

  let results = [];
  allRecordsMap.forEach((record) => {
    if (record.date === dateStr) {
      if (filters.department && filters.department !== 'All Departments') {
        if (record.department !== filters.department) return;
      }
      if (filters.status && filters.status !== 'All') {
        if (record.status !== filters.status) return;
      }
      results.push({ ...record });
    }
  });

  return results;
};

/**
 * Reset today's session for a user (dev mode only — for re-testing the check-in/check-out flow).
 */
export const resetTodaySession = (userId) => {
  const targetUid = userId || DEV_USER.uid;
  _todaySessions.delete(targetUid);
};

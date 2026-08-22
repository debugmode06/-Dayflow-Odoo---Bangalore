/**
 * ATTENDANCE DATA PROVIDER — MEMBER 2 ATTENDANCE MODULE
 *
 * Environment-driven single switching point.
 *
 * Set in .env.local:
 *   VITE_ATTENDANCE_LOCAL_DEV=true   → in-memory dev service (no Firebase)
 *   (omit or false)                  → Firebase / Firestore production service
 */

import * as devService  from './attendanceDevService';
import * as prodService from '../services/attendanceService';

const USE_LOCAL_DEV = import.meta.env.VITE_ATTENDANCE_LOCAL_DEV === 'true';

// Active service — resolved at module load time
const svc = USE_LOCAL_DEV ? devService : prodService;

// ─── Common utility ───────────────────────────────────────────────────────────
export const getAttendanceDate        = (...args) => svc.getAttendanceDate(...args);
export const getAttendanceDocId       = (...args) => svc.getAttendanceDocId(...args);

// ─── Read operations ──────────────────────────────────────────────────────────
export const getDailyAttendance       = (...args) => svc.getDailyAttendance(...args);
export const getWeeklyAttendance      = (...args) => svc.getWeeklyAttendance(...args);
export const getAttendanceHistory     = (...args) => svc.getAttendanceHistory(...args);
export const getAllEmployeesAttendance = (...args) => svc.getAllEmployeesAttendance(...args);

// ─── Write operations ─────────────────────────────────────────────────────────
export const checkIn  = (...args) => svc.checkIn(...args);
export const checkOut = (...args) => svc.checkOut(...args);

// ─── Dev-only helpers & Config ────────────────────────────────────────────────
export const DEV_USER               = USE_LOCAL_DEV ? devService.DEV_USER               : null;
export const DEV_EMPLOYEES          = USE_LOCAL_DEV ? devService.DEV_EMPLOYEES          : [];
export const DEV_DEPARTMENTS        = USE_LOCAL_DEV ? devService.DEV_DEPARTMENTS        : ['All Departments'];
export const HR_CONFIGURED_LOCATION = devService.HR_CONFIGURED_LOCATION;
export const getDevUser             = USE_LOCAL_DEV ? devService.getDevUser             : null;

/** True when running in local development mode (no Firebase). */
export { USE_LOCAL_DEV };

import { useState, useEffect, useCallback } from 'react';
import { fetchEmployeeProfile } from '../services/employeeProfileService';
import { fetchActivityTimeline } from '../services/activityTimelineService';
import { fetchAttendanceSummary, fetchLeaveHistory } from '../services/employeeProfileService';
import {
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_LEAVE_HISTORY,
} from '../utils/mockEmployeeData';

/**
 * useEmployeeProfile — loads and manages all Employee 360° data.
 *
 * Data strategy:
 * 1. PRIMARY: Firebase Firestore — users/{uid} (auto-creates if missing)
 * 2. FALLBACK (attendance/leave only): Mock data when integration modules
 *    are not yet available.
 * 3. Profile itself NEVER falls back to mock — it either loads real data
 *    or auto-creates a minimal real document from Firebase Auth.
 *
 * Error types:
 *   'permission-denied' → Firestore rules not deployed
 *   'not-found'         → Document missing (auto-create attempted)
 *   'network'           → Firebase unavailable
 *
 * @param {string} targetUid - Firebase Auth UID of the employee to load
 */
const useEmployeeProfile = (targetUid) => {
  const [profile, setProfile]               = useState(null);
  const [timeline, setTimeline]             = useState([]);
  const [attendanceSummary, setAttendance]  = useState(null);
  const [leaveHistory, setLeaveHistory]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [timelineLoading, setTimelineLoading]     = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // ── Profile (real Firebase — no mock fallback) ────────────────────────────
  const loadProfile = useCallback(async () => {
    if (!targetUid) {
      setLoading(false);
      setError('No authenticated user. Please log in.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // fetchEmployeeProfile auto-creates the document if missing
      const data = await fetchEmployeeProfile(targetUid);
      setProfile(data);
    } catch (err) {
      const message = err?.message || 'Failed to load profile.';
      console.error('[useEmployeeProfile] Profile load failed:', message);
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [targetUid]);

  // ── Timeline (real Firebase; silent empty state on failure) ───────────────
  const loadTimeline = useCallback(async () => {
    if (!targetUid) return;
    setTimelineLoading(true);
    try {
      const events = await fetchActivityTimeline(targetUid);
      setTimeline(events); // empty array is valid — shows "No activity yet"
    } catch {
      setTimeline([]); // Non-fatal — show empty state
    } finally {
      setTimelineLoading(false);
    }
  }, [targetUid]);

  // ── Attendance + Leave (real Firebase; mock fallback if module not deployed) ─
  const loadIntegrationData = useCallback(async () => {
    if (!targetUid) return;
    setAttendanceLoading(true);
    try {
      const [att, leave] = await Promise.all([
        fetchAttendanceSummary(targetUid),
        fetchLeaveHistory(targetUid),
      ]);
      // null/[] means the module has no data yet — show empty state (NOT mock)
      setAttendance(att ?? null);
      setLeaveHistory(leave ?? []);
    } catch {
      // Module not deployed or query failed — silent empty state
      setAttendance(null);
      setLeaveHistory([]);
    } finally {
      setAttendanceLoading(false);
    }
  }, [targetUid]);

  useEffect(() => {
    loadProfile();
    loadTimeline();
    loadIntegrationData();
  }, [loadProfile, loadTimeline, loadIntegrationData]);

  /**
   * Refresh profile and timeline after a successful update.
   */
  const refreshProfile = useCallback(() => {
    loadProfile();
    loadTimeline();
  }, [loadProfile, loadTimeline]);

  /**
   * Optimistically update profile state after save without re-fetching.
   */
  const patchProfile = useCallback((updates) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return {
    profile,
    timeline,
    attendanceSummary,
    leaveHistory,
    loading,
    error,
    timelineLoading,
    attendanceLoading,
    usingMockData: false, // Always false — profile is always real Firebase data
    refreshProfile,
    patchProfile,
  };
};

export default useEmployeeProfile;

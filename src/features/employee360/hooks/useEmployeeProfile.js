import { useState, useEffect, useCallback } from 'react';
import { fetchEmployeeProfile } from '../services/employeeProfileService';
import { fetchActivityTimeline } from '../services/activityTimelineService';
import { fetchAttendanceSummary, fetchLeaveHistory } from '../services/employeeProfileService';

/**
 * useEmployeeProfile — loads and manages all Employee 360° data.
 *
 * @param {string} targetUid - UID of the employee to load
 */
const useEmployeeProfile = (targetUid) => {
  const [profile, setProfile]               = useState(null);
  const [timeline, setTimeline]             = useState([]);
  const [attendanceSummary, setAttendance]  = useState(null);
  const [leaveHistory, setLeaveHistory]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!targetUid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployeeProfile(targetUid);
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [targetUid]);

  const loadTimeline = useCallback(async () => {
    if (!targetUid) return;
    setTimelineLoading(true);
    try {
      const events = await fetchActivityTimeline(targetUid);
      setTimeline(events);
    } catch {
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  }, [targetUid]);

  const loadIntegrationData = useCallback(async () => {
    if (!targetUid) return;
    setAttendanceLoading(true);
    try {
      const [att, leave] = await Promise.all([
        fetchAttendanceSummary(targetUid),
        fetchLeaveHistory(targetUid),
      ]);
      setAttendance(att);
      setLeaveHistory(leave);
    } catch {
      // Integration data is non-critical; silently ignore
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
   * Called after a successful profile update to refresh local state.
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
    refreshProfile,
    patchProfile,
  };
};

export default useEmployeeProfile;

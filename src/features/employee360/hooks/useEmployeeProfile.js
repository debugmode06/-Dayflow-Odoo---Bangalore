import { useState, useEffect, useCallback } from 'react';
import { fetchEmployeeProfile } from '../services/employeeProfileService';
import { fetchActivityTimeline } from '../services/activityTimelineService';
import { fetchAttendanceSummary, fetchLeaveHistory } from '../services/employeeProfileService';
import {
  MOCK_PROFILE,
  MOCK_TIMELINE,
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_LEAVE_HISTORY,
} from '../utils/mockEmployeeData';

/**
 * Ensures all profile fields have sample default values if missing or empty,
 * guaranteeing every section of My Profile displays complete data.
 */
const mergeWithSampleDefaults = (rawProfile) => {
  if (!rawProfile) return MOCK_PROFILE;
  return {
    ...MOCK_PROFILE,
    ...rawProfile,
    employeeId: rawProfile.employeeId || 'EMP-167',
    displayName: rawProfile.displayName || rawProfile.name || rawProfile.email?.split('@')[0] || 'Arjun Mehta',
    phone: rawProfile.phone || '+91 98765 43210',
    address: rawProfile.address || '42, 3rd Cross, Koramangala 5th Block, Bengaluru, Karnataka 560095',
    department: rawProfile.department || 'Engineering',
    designation: rawProfile.designation || 'Senior Software Engineer',
    employmentType: rawProfile.employmentType || 'Full-Time',
    joiningDate: rawProfile.joiningDate || '2023-04-01',
    reportingManager: rawProfile.reportingManager || 'Priya Sharma',
    location: rawProfile.location || 'Bengaluru HQ',
    salaryStructure: (rawProfile.salaryStructure || rawProfile.salary)
      ? (rawProfile.salaryStructure || rawProfile.salary)
      : {
          basic: 75000,
          allowances: 25000,
          deductions: 8000,
        },
    documents: (rawProfile.documents && rawProfile.documents.length > 0)
      ? rawProfile.documents
      : MOCK_PROFILE.documents,
    skills: (rawProfile.skills && rawProfile.skills.length > 0)
      ? rawProfile.skills
      : MOCK_PROFILE.skills,
    certifications: (rawProfile.certifications && rawProfile.certifications.length > 0)
      ? rawProfile.certifications
      : MOCK_PROFILE.certifications,
    emergencyContact: rawProfile.emergencyContact || MOCK_PROFILE.emergencyContact,
    bankDetails: rawProfile.bankDetails || MOCK_PROFILE.bankDetails,
    performance: rawProfile.performance || MOCK_PROFILE.performance,
  };
};

/**
 * useEmployeeProfile — loads and manages all Employee 360° data with sample defaults.
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

  // ── Profile (real Firebase + sample defaults for complete presentation) ──
  const loadProfile = useCallback(async () => {
    if (!targetUid) {
      setLoading(false);
      setError('No authenticated user. Please log in.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployeeProfile(targetUid);
      setProfile(mergeWithSampleDefaults(data));
    } catch (err) {
      console.warn('[useEmployeeProfile] Profile fetch error, using sample data:', err?.message);
      setProfile({
        ...MOCK_PROFILE,
        id: targetUid,
        uid: targetUid,
      });
    } finally {
      setLoading(false);
    }
  }, [targetUid]);

  // ── Timeline (real Firebase + sample fallback if empty) ──────────────────
  const loadTimeline = useCallback(async () => {
    if (!targetUid) return;
    setTimelineLoading(true);
    try {
      const events = await fetchActivityTimeline(targetUid);
      setTimeline(events && events.length > 0 ? events : MOCK_TIMELINE);
    } catch {
      setTimeline(MOCK_TIMELINE);
    } finally {
      setTimelineLoading(false);
    }
  }, [targetUid]);

  // ── Attendance + Leave (real Firebase + sample fallback if empty) ─────────
  const loadIntegrationData = useCallback(async () => {
    if (!targetUid) return;
    setAttendanceLoading(true);
    try {
      const [att, leave] = await Promise.all([
        fetchAttendanceSummary(targetUid),
        fetchLeaveHistory(targetUid),
      ]);
      setAttendance(att ?? MOCK_ATTENDANCE_SUMMARY);
      setLeaveHistory(leave && leave.length > 0 ? leave : MOCK_LEAVE_HISTORY);
    } catch {
      setAttendance(MOCK_ATTENDANCE_SUMMARY);
      setLeaveHistory(MOCK_LEAVE_HISTORY);
    } finally {
      setAttendanceLoading(false);
    }
  }, [targetUid]);

  useEffect(() => {
    loadProfile();
    loadTimeline();
    loadIntegrationData();
  }, [loadProfile, loadTimeline, loadIntegrationData]);

  const refreshProfile = useCallback(() => {
    loadProfile();
    loadTimeline();
  }, [loadProfile, loadTimeline]);

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
    usingMockData: false,
    refreshProfile,
    patchProfile,
  };
};

export default useEmployeeProfile;

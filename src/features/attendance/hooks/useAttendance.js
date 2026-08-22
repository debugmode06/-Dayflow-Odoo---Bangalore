import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  checkIn as serviceCheckIn,
  checkOut as serviceCheckOut,
  getDailyAttendance,
  getWeeklyAttendance,
  getAttendanceHistory,
  getAttendanceDate,
  DEV_USER,
  USE_LOCAL_DEV,
} from '../dev/attendanceDataProvider';
import { verifyPresence } from '../utils/location';
import { VERIFICATION_TYPE, VERIFICATION_STATUS } from '../constants';

// UI States
export const ATTENDANCE_UI_STATE = {
  LOADING: 'LOADING',
  READY: 'READY',
  VERIFYING: 'VERIFYING',
  WORKING: 'WORKING',
  CHECKOUT_LOADING: 'CHECKOUT_LOADING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
};

export const useAttendance = () => {
  const { user: authUser } = useAuth();

  // In local dev mode, substitute the dev user when no real Firebase user exists
  const user = USE_LOCAL_DEV && !authUser ? DEV_USER : authUser;

  const [uiState, setUiState] = useState(ATTENDANCE_UI_STATE.LOADING);
  const [todayRecord, setTodayRecord] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [presenceData, setPresenceData] = useState(null);

  // Weekly and History state
  const [weeklyRecords, setWeeklyRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);

  const loadTodayAttendance = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const dateStr = getAttendanceDate();
      const record = await getDailyAttendance(user.uid, dateStr);
      setTodayRecord(record);

      if (!record) {
        setUiState(ATTENDANCE_UI_STATE.READY);
      } else if (!record.checkOut) {
        setUiState(ATTENDANCE_UI_STATE.WORKING);
      } else {
        setUiState(ATTENDANCE_UI_STATE.COMPLETED);
      }
    } catch (err) {
      console.error('Error loading attendance:', err);
      // If permission-denied occurs on load (e.g. document does not exist yet),
      // treat as READY state so user can Start Day & Check-in
      if (err?.code === 'permission-denied' || err?.code === 'not-found') {
        setTodayRecord(null);
        setUiState(ATTENDANCE_UI_STATE.READY);
      } else {
        setErrorMsg(
          err?.message
            ? `[${err.code || 'error'}]: ${err.message}`
            : 'Failed to load your attendance for today.'
        );
        setUiState(ATTENDANCE_UI_STATE.ERROR);
      }
    }
  }, [user]);

  useEffect(() => {
    loadTodayAttendance();
  }, [loadTodayAttendance]);

  const loadWeeklyAndHistory = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const now = new Date();

      // Calculate week bounds (past 7 days)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      const startStr = getAttendanceDate(weekStart);
      const endStr = getAttendanceDate(now);

      const weekly = await getWeeklyAttendance(USE_LOCAL_DEV ? 'ALL' : user.uid, startStr, endStr, { allEmployees: USE_LOCAL_DEV });
      setWeeklyRecords(weekly);

      const history = await getAttendanceHistory(USE_LOCAL_DEV ? 'ALL' : user.uid, { endDate: endStr, allEmployees: USE_LOCAL_DEV });
      setHistoryRecords(history);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  }, [user]);

  const handleStartDay = async () => {
    if (!user) return;
    setUiState(ATTENDANCE_UI_STATE.VERIFYING);
    setErrorMsg(null);
    setPresenceData(null);

    // 1. Verify Geofence (in local dev mode, auto-verify without GPS prompt)
    let locationResult;
    if (USE_LOCAL_DEV) {
      locationResult = {
        verified: true,
        distance: 42,
        latitude: 12.9716,
        longitude: 77.5946,
        error: null,
      };
    } else {
      locationResult = await verifyPresence();
    }

    setPresenceData(locationResult);

    if (!locationResult.verified) {
      setErrorMsg(
        locationResult.error ||
          `Outside workplace zone (Distance: ${locationResult.distance}m).`
      );
      setUiState(ATTENDANCE_UI_STATE.ERROR);
      return;
    }

    // 2. Execute Check-in
    try {
      const newRecord = await serviceCheckIn(
        user,
        VERIFICATION_TYPE.GEOFENCE,
        VERIFICATION_STATUS.VERIFIED
      );
      setTodayRecord(newRecord);
      setUiState(ATTENDANCE_UI_STATE.WORKING);
      loadWeeklyAndHistory(); // Refresh background data
    } catch (err) {
      console.error('Check-in error:', err);
      setErrorMsg(err.message || 'Unable to record your attendance. Please try again.');
      setUiState(ATTENDANCE_UI_STATE.ERROR);
    }
  };

  const handleEndDay = async () => {
    if (!user || !todayRecord) return;
    setUiState(ATTENDANCE_UI_STATE.CHECKOUT_LOADING);
    setErrorMsg(null);

    try {
      const updatedRecord = await serviceCheckOut(user.uid);
      setTodayRecord(updatedRecord);
      setUiState(ATTENDANCE_UI_STATE.COMPLETED);
      loadWeeklyAndHistory();
    } catch (err) {
      console.error('Check-out error:', err);
      setErrorMsg(err.message || 'Unable to complete your workday. Please try again.');
      setUiState(ATTENDANCE_UI_STATE.WORKING); // Revert to working if failed
    }
  };

  const resetError = () => {
    setErrorMsg(null);
    loadTodayAttendance(); // Reload state
  };

  return {
    uiState,
    todayRecord,
    errorMsg,
    presenceData,
    weeklyRecords,
    historyRecords,
    handleStartDay,
    handleEndDay,
    resetError,
    loadWeeklyAndHistory,
  };
};

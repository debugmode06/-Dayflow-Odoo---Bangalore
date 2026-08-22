import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  checkIn as serviceCheckIn,
  checkOut as serviceCheckOut,
  getDailyAttendance,
  getWeeklyAttendance,
  getAttendanceHistory,
  getAttendanceDate,
} from '../services/attendanceService';
import { verifyPresence } from '../utils/location';
import { VERIFICATION_TYPE, VERIFICATION_STATUS, ATTENDANCE_STATUS } from '../constants';

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
  const { user } = useAuth();
  
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
      setErrorMsg('Failed to load your attendance for today.');
      setUiState(ATTENDANCE_UI_STATE.ERROR);
    }
  }, [user]);

  useEffect(() => {
    loadTodayAttendance();
  }, [loadTodayAttendance]);

  const loadWeeklyAndHistory = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const now = new Date();
      
      // Calculate week bounds (e.g. past 7 days or Mon-Sun)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6); // Past 7 days
      const startStr = getAttendanceDate(weekStart);
      const endStr = getAttendanceDate(now);

      const weekly = await getWeeklyAttendance(user.uid, startStr, endStr);
      setWeeklyRecords(weekly);

      const history = await getAttendanceHistory(user.uid, { endDate: endStr });
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

    // 1. Verify Geofence
    const locationResult = await verifyPresence();
    setPresenceData(locationResult);

    if (!locationResult.verified) {
      setErrorMsg(locationResult.error || `Outside workplace zone (Distance: ${locationResult.distance}m).`);
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

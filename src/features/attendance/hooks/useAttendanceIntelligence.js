import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getWeeklyAttendance,
  DEV_USER,
  USE_LOCAL_DEV,
} from '../dev/attendanceDataProvider';
import { generateIntelligence } from '../intelligence/intelligenceService';

// Calculate start and end strings for bounded periods
const getBoundedDateStr = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const useAttendanceIntelligence = (
  selectedDepartment = 'All Departments',
  selectedEmployeeUid = 'ALL',
  demoData = null
) => {
  const { user: authUser } = useAuth();
  const user = USE_LOCAL_DEV && !authUser ? DEV_USER : authUser;

  const [intelligence, setIntelligence] = useState(demoData);
  const [isLoading, setIsLoading] = useState(!demoData);
  const [error, setError] = useState(null);

  const loadIntelligence = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();

      // Current period: Last 7 days
      const currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 6);

      // Previous period: 7 days before current
      const previousEnd = new Date(currentStart);
      previousEnd.setDate(currentStart.getDate() - 1);
      const previousStart = new Date(previousEnd);
      previousStart.setDate(previousEnd.getDate() - 6);

      const currentStartStr  = getBoundedDateStr(currentStart);
      const currentEndStr    = getBoundedDateStr(now);
      const previousStartStr = getBoundedDateStr(previousStart);
      const previousEndStr   = getBoundedDateStr(previousEnd);

      const filterPayload = {
        department: selectedDepartment,
        employeeId: selectedEmployeeUid,
      };

      const [currentRecords, previousRecords] = await Promise.all([
        getWeeklyAttendance(selectedEmployeeUid, currentStartStr, currentEndStr, filterPayload),
        getWeeklyAttendance(selectedEmployeeUid, previousStartStr, previousEndStr, filterPayload),
      ]);

      const data = generateIntelligence(currentRecords, previousRecords);
      setIntelligence(data);
    } catch (err) {
      console.error('Failed to load attendance intelligence:', err);
      setError('Unable to load attendance insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedDepartment, selectedEmployeeUid]);

  useEffect(() => {
    if (demoData) {
      setIntelligence(demoData);
      setIsLoading(false);
      return;
    }
    loadIntelligence();
  }, [loadIntelligence, demoData]);

  return {
    intelligence,
    isLoading,
    error,
    retry: loadIntelligence,
  };
};

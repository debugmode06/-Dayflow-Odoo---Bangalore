/**
 * Attendance calculation logic & intelligence rules for Dayflow
 */

export const STANDARD_WORK_HOURS = 8;
export const STANDARD_CHECKIN_TIME = '09:00'; // 9:00 AM

export const calculateAttendanceStatus = (checkInTime) => {
  if (!checkInTime) return 'absent';
  
  const date = checkInTime.toDate ? checkInTime.toDate() : new Date(checkInTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // 9:15 AM threshold (555 minutes)
  if (timeInMinutes <= 555) {
    return 'present';
  } else if (timeInMinutes <= 720) { // Before 12:00 PM
    return 'late';
  } else {
    return 'half-day';
  }
};

export const calculateAttendanceScore = (records = []) => {
  if (!records || records.length === 0) return 100;

  let score = 100;
  const totalDays = records.length;

  let lateCount = 0;
  let absentCount = 0;
  let halfDayCount = 0;

  records.forEach((record) => {
    if (record.status === 'late') lateCount++;
    if (record.status === 'absent') absentCount++;
    if (record.status === 'half-day') halfDayCount++;
  });

  const penalty = (lateCount * 3) + (halfDayCount * 5) + (absentCount * 10);
  const finalScore = Math.max(0, Math.min(100, Math.round(score - (penalty / (totalDays / 5)))));
  return finalScore;
};

export const detectAttendancePatterns = (records = []) => {
  const anomalies = [];
  
  if (records.length >= 3) {
    const consecutiveLates = records.slice(0, 3).every(r => r.status === 'late');
    if (consecutiveLates) {
      anomalies.push({
        type: 'frequent_late',
        message: '3 consecutive late check-ins detected',
        severity: 'warning',
      });
    }
  }

  return anomalies;
};

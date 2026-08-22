export const STANDARD_CHECKIN_MINUTES = 540; // 09:00 AM (9 * 60)
export const LATE_THRESHOLD_MINUTES = 555; // 09:15 AM (9 * 60 + 15)
export const HALF_DAY_THRESHOLD_MINUTES = 720; // 12:00 PM (12 * 60)

/**
 * Normalizes a single attendance record into a standardized format for calculations.
 * @param {Object} record - Raw Firestore attendance record
 */
export const normalizeRecord = (record) => {
  if (!record) return null;

  let checkInMinutes = null;
  if (record.checkIn) {
    const date = typeof record.checkIn.toDate === 'function' ? record.checkIn.toDate() : new Date(record.checkIn);
    checkInMinutes = date.getHours() * 60 + date.getMinutes();
  }

  const isPresent = record.status === 'PRESENT';
  const isAbsent = record.status === 'ABSENT';
  const isHalfDay = record.status === 'HALF_DAY';
  const isLeave = record.status === 'LEAVE';

  const isOnTime = isPresent && checkInMinutes !== null && checkInMinutes <= LATE_THRESHOLD_MINUTES;
  const isLate = isPresent && checkInMinutes !== null && checkInMinutes > LATE_THRESHOLD_MINUTES && checkInMinutes <= HALF_DAY_THRESHOLD_MINUTES;

  return {
    ...record,
    checkInMinutes,
    isPresent,
    isAbsent,
    isHalfDay,
    isLeave,
    isOnTime,
    isLate
  };
};

/**
 * Calculates raw metrics from a list of normalized attendance records.
 * @param {Array} records - Array of raw Firestore records
 */
export const calculateAttendanceMetrics = (records = []) => {
  if (!records || records.length === 0) {
    return {
      totalDays: 0,
      presentCount: 0,
      absentCount: 0,
      halfDayCount: 0,
      leaveCount: 0,
      lateCount: 0,
      onTimeCount: 0,
      attendancePercentage: 0,
      onTimePercentage: 0
    };
  }

  const normalized = records.map(normalizeRecord).filter(Boolean);

  let presentCount = 0;
  let absentCount = 0;
  let halfDayCount = 0;
  let leaveCount = 0;
  let lateCount = 0;
  let onTimeCount = 0;

  normalized.forEach(record => {
    if (record.isPresent) presentCount++;
    if (record.isAbsent) absentCount++;
    if (record.isHalfDay) halfDayCount++;
    if (record.isLeave) leaveCount++;
    if (record.isLate) lateCount++;
    if (record.isOnTime) onTimeCount++;
  });

  // Calculate percentages
  const eligibleAttendanceDays = presentCount + absentCount + halfDayCount;
  const attendancePercentage = eligibleAttendanceDays > 0 
    ? ((presentCount + (halfDayCount * 0.5)) / eligibleAttendanceDays) * 100 
    : 0;

  const eligibleArrivalDays = presentCount; // Only days they actually arrived count towards punctuality
  const onTimePercentage = eligibleArrivalDays > 0 
    ? (onTimeCount / eligibleArrivalDays) * 100 
    : 0;

  return {
    totalDays: records.length,
    presentCount,
    absentCount,
    halfDayCount,
    leaveCount,
    lateCount,
    onTimeCount,
    attendancePercentage: Number(attendancePercentage.toFixed(2)),
    onTimePercentage: Number(onTimePercentage.toFixed(2))
  };
};

/**
 * Compares two metric sets (e.g. current week vs previous week)
 */
export const compareMetrics = (currentMetrics, previousMetrics) => {
  const calculateChange = (current, previous) => {
    const diff = current - previous;
    const pct = previous === 0 ? (current > 0 ? 100 : 0) : (diff / previous) * 100;
    return {
      current,
      previous,
      difference: diff,
      percentageChange: Number(pct.toFixed(2)),
      trend: diff > 0 ? 'INCREASING' : (diff < 0 ? 'DECREASING' : 'FLAT')
    };
  };

  return {
    lateCount: calculateChange(currentMetrics.lateCount, previousMetrics.lateCount),
    absentCount: calculateChange(currentMetrics.absentCount, previousMetrics.absentCount),
    halfDayCount: calculateChange(currentMetrics.halfDayCount, previousMetrics.halfDayCount),
    onTimePercentage: calculateChange(currentMetrics.onTimePercentage, previousMetrics.onTimePercentage),
    attendancePercentage: calculateChange(currentMetrics.attendancePercentage, previousMetrics.attendancePercentage)
  };
};

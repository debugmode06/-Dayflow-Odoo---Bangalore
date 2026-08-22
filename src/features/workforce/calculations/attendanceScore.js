import { PENALTIES } from './constants';

/**
 * Calculates the Attendance Score based on actual available attendance records.
 * 
 * @param {Array} attendanceRecords - Array of attendance documents for the period.
 * @returns {Object} { score, breakdown, explanation }
 */
export const calculateAttendanceScore = (attendanceRecords = []) => {
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return {
      score: null,
      breakdown: { present: 0, absent: 0, late: 0, halfDay: 0 },
      explanation: 'No attendance data available for the period.',
      status: 'neutral',
      warnings: []
    };
  }

  let present = 0;
  let absent = 0;
  let late = 0;
  let halfDay = 0; // placeholder if half‑day flag exists

  attendanceRecords.forEach(rec => {
    if (rec.status === 'Present') {
      present++;
      if (rec.late) late++;
      if (rec.halfDay) halfDay++;
    } else if (rec.status === 'Absent') {
      absent++;
    }
  });

  const total = present + absent + halfDay; // total counted records
  const basePercentage = total > 0 ? (present / total) * 100 : 0;
  const penalty = (late * PENALTIES.LATE_ARRIVAL) + (absent * PENALTIES.ABSENCE) + (halfDay * PENALTIES.HALF_DAY);
  const rawScore = basePercentage - penalty;
  const clamped = Math.max(0, Math.min(100, Math.round(rawScore)));

  let explanation = '';
  let status = 'stable';
  if (clamped >= 90) {
    explanation = 'Excellent attendance performance.';
    status = 'up';
  } else if (clamped >= 75) {
    explanation = 'Good attendance with minor issues.';
    status = 'stable';
  } else {
    explanation = 'Attendance needs improvement.';
    status = 'down';
  }

  const warnings = [];
  if (late > 0) warnings.push('Late arrivals increased');

  return {
    score: clamped,
    breakdown: { present, absent, late, halfDay },
    explanation,
    status,
    warnings
  };
};

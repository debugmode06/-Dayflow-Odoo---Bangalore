import { PULSE_WEIGHTS, STATUS_THRESHOLDS, PULSE_LABELS } from './constants';
import { calculateAttendanceScore } from './attendanceScore';
import { calculateAvailabilityScore } from './availabilityScore';
import { calculateLeaveHealthScore } from './leaveHealthScore';
import { calculateProfileHealthScore } from './profileHealthScore';

/**
 * Aggregates the core signals to generate the final Workforce Pulse score.
 */
export const calculateWorkforcePulse = (data) => {
  const { employees, attendanceRecords, absentToday, onLeaveToday, leavesToday, pendingLeaves } = data;

  const attendanceSignal = calculateAttendanceScore(attendanceRecords);
  const availabilitySignal = calculateAvailabilityScore(employees, absentToday, onLeaveToday);
  const leaveSignal = calculateLeaveHealthScore(employees, leavesToday, pendingLeaves);
  const profileSignal = calculateProfileHealthScore(employees);

  let activeWeightsSum = 0;
  let weightedScoreSum = 0;
  let availableSignals = 0;

  // Only aggregate scores that are not null
  if (attendanceSignal.score !== null) {
    activeWeightsSum += PULSE_WEIGHTS.ATTENDANCE;
    weightedScoreSum += attendanceSignal.score * PULSE_WEIGHTS.ATTENDANCE;
    availableSignals++;
  }
  
  if (availabilitySignal.score !== null) {
    activeWeightsSum += PULSE_WEIGHTS.AVAILABILITY;
    weightedScoreSum += availabilitySignal.score * PULSE_WEIGHTS.AVAILABILITY;
    availableSignals++;
  }
  
  if (leaveSignal.score !== null) {
    activeWeightsSum += PULSE_WEIGHTS.LEAVE_HEALTH;
    weightedScoreSum += leaveSignal.score * PULSE_WEIGHTS.LEAVE_HEALTH;
    availableSignals++;
  }
  
  if (profileSignal.score !== null) {
    activeWeightsSum += PULSE_WEIGHTS.PROFILE_HEALTH;
    weightedScoreSum += profileSignal.score * PULSE_WEIGHTS.PROFILE_HEALTH;
    availableSignals++;
  }

  let finalScore = null;
  let status = 'INSUFFICIENT DATA';
  
  if (availableSignals > 0) {
    // Normalize score based on available active weights (to handle missing data gracefully)
    finalScore = Math.round(weightedScoreSum / activeWeightsSum);
    
    if (finalScore >= STATUS_THRESHOLDS.EXCELLENT) status = PULSE_LABELS.EXCELLENT;
    else if (finalScore >= STATUS_THRESHOLDS.HEALTHY) status = PULSE_LABELS.HEALTHY;
    else if (finalScore >= STATUS_THRESHOLDS.WATCH) status = PULSE_LABELS.WATCH;
    else status = PULSE_LABELS.NEEDS_ATTENTION;
  }

  // Generate deterministic "Why this score?" reasons
  const reasons = { positives: [], warnings: [] };

  if (attendanceSignal.score !== null) {
    if (attendanceSignal.score >= 75 && attendanceSignal.breakdown.lates === 0) reasons.positives.push('Strong attendance');
    if (attendanceSignal.breakdown.lates > 0) reasons.warnings.push('Late arrivals recorded recently');
    if (attendanceSignal.breakdown.absences > 0 && attendanceSignal.score < 90) reasons.warnings.push('Absences are affecting attendance');
  }

  if (availabilitySignal.score !== null) {
    if (availabilitySignal.score >= 80) reasons.positives.push('Healthy team availability');
    else reasons.warnings.push('Workforce availability dropped');
  }

  if (leaveSignal.score !== null) {
    if (leaveSignal.score >= 80) reasons.positives.push('Leave activity remains manageable');
    else if (leaveSignal.breakdown.pending > 5) reasons.warnings.push('High number of pending leave requests');
    else reasons.warnings.push('Leave overlap is increasing');
  }

  if (profileSignal.score !== null) {
    if (profileSignal.score >= 90) reasons.positives.push('Employee profiles are mostly complete');
    if (profileSignal.breakdown.incompleteProfiles > 0 && profileSignal.score < 90) reasons.warnings.push('Multiple employee profiles are incomplete');
  }

  return {
    score: finalScore,
    status,
    signals: {
      attendance: attendanceSignal,
      availability: availabilitySignal,
      leaveHealth: leaveSignal,
      profileHealth: profileSignal,
    },
    reasons
  };
};

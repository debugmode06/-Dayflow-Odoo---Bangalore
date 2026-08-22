/**
 * Workforce Pulse Metrics & Analytics Calculations
 */

export const calculateWorkforceHealthScore = ({
  attendanceRate = 95,
  leaveLoad = 10,
  profileCompletion = 90,
  anomalyCount = 0,
}) => {
  // Weighted calculation formula
  const attendanceWeight = 0.5;
  const leaveWeight = 0.2;
  const profileWeight = 0.15;
  const anomalyPenaltyWeight = 0.15;

  const leaveFactor = Math.max(0, 100 - leaveLoad * 2);
  const anomalyPenalty = Math.max(0, 100 - anomalyCount * 15);

  const overallScore = Math.round(
    attendanceRate * attendanceWeight +
    leaveFactor * leaveWeight +
    profileCompletion * profileWeight +
    anomalyPenalty * anomalyPenaltyWeight
  );

  return Math.max(0, Math.min(100, overallScore));
};

export const generateWorkforceSignals = (stats = {}) => {
  const signals = [];

  if ((stats.attendanceRate || 0) >= 92) {
    signals.push({
      type: 'positive',
      text: 'High daily attendance rate maintained across key departments.',
    });
  } else if ((stats.attendanceRate || 0) < 85) {
    signals.push({
      type: 'risk',
      text: 'Attendance rate dropped below healthy baseline (85%).',
    });
  }

  if ((stats.pendingLeavesCount || 0) > 5) {
    signals.push({
      type: 'action',
      text: `${stats.pendingLeavesCount} leave approvals pending HR review.`,
    });
  }

  return signals;
};

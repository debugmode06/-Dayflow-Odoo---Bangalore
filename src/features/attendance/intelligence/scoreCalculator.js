export const PENALTY_WEIGHTS = {
  LATE: 3,
  HALF_DAY: 5,
  ABSENT: 10
};

/**
 * Calculates a deterministic attendance score based on Phase 1 approved formula.
 * Base score 100, penalized by late, half-day, and absent counts.
 * Penalty is normalized against a standard 5-day week ratio.
 * 
 * @param {Object} metrics - The metrics object from calculateAttendanceMetrics
 */
export const calculateAttendanceScore = (metrics) => {
  if (!metrics || metrics.totalDays === 0) {
    return {
      score: 100,
      grade: 'EXCELLENT',
      positiveFactors: [],
      negativeFactors: ['Insufficient data for score calculation'],
      components: { attendance: 100, punctuality: 100, consistency: 100 }
    };
  }

  const { lateCount, halfDayCount, absentCount, totalDays, onTimePercentage, attendancePercentage } = metrics;

  const totalPenalty = (lateCount * PENALTY_WEIGHTS.LATE) + 
                       (halfDayCount * PENALTY_WEIGHTS.HALF_DAY) + 
                       (absentCount * PENALTY_WEIGHTS.ABSENT);

  // Normalize penalty to a 5-day baseline
  // If analyzing a 30 day period, raw penalties would unfairly decimate the score.
  const normalizationFactor = Math.max(1, totalDays / 5);
  const normalizedPenalty = totalPenalty / normalizationFactor;

  const rawScore = 100 - normalizedPenalty;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine Grade
  let grade = 'NEEDS_ATTENTION';
  if (score >= 90) grade = 'STRONG';
  else if (score >= 75) grade = 'FAIR';

  // Generate deterministic explanations
  const positiveFactors = [];
  const negativeFactors = [];

  if (attendancePercentage >= 95) positiveFactors.push('Strong attendance consistency');
  if (onTimePercentage >= 90) positiveFactors.push('High on-time arrival rate');
  if (lateCount === 0 && totalDays >= 5) positiveFactors.push('Perfect punctuality record');

  if (absentCount > 0) negativeFactors.push(`Recorded ${absentCount} undocumented absence(s)`);
  if (lateCount >= 3) negativeFactors.push(`High frequency of late arrivals (${lateCount})`);
  if (score < 75 && negativeFactors.length === 0) negativeFactors.push('Multiple minor attendance infractions');

  // Component breakdown (approximate mapping for UI charts)
  const components = {
    attendance: Math.round(attendancePercentage),
    punctuality: Math.round(onTimePercentage),
    consistency: Math.max(0, 100 - (absentCount * 5)) // Simplified consistency metric
  };

  return {
    score,
    grade,
    positiveFactors,
    negativeFactors,
    components
  };
};
